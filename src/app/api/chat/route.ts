import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Store chat sessions in memory
const chatSessions = new Map();

// MCP Client Setup
// Use the path from env or default to the one we know
const mcpServerPath = "C:\\xampp\\htdocs\\mcp-msuenrollment\\dist\\index.js";

const client = new Client({
  name: "webapp-client",
  version: "1.0.0",
});

let isConnected = false;

async function ensureMcpConnection() {
  if (isConnected) return;

  console.log("Connecting to MCP server at:", mcpServerPath);

  const transport = new StdioClientTransport({
    command: "node",
    args: [mcpServerPath],
    env: {
      ...(process.env as Record<string, string>), // Inherit env vars (DB creds)
      PATH: process.env.PATH || "", // Ensure node is in path
    },
  });

  try {
    await client.connect(transport);
    isConnected = true;
    console.log("Connected to MCP server");
  } catch (error) {
    console.error("Failed to connect to MCP server:", error);
    throw error;
  }
}

// Since we can't easily access client.tools synchronously before listing them,
// we need to list tools from MCP and then map them.
async function getGeminiTools(mcpClient: Client) {
  const result = await mcpClient.listTools();
  return result.tools.map((tool) => {
    // Basic mapping of JSON Schema to Gemini Schema
    // Note: This might need more robust recursive mapping for complex types
    const parameters: any = {
      type: SchemaType.OBJECT,
      properties: {},
      required: tool.inputSchema.required || [],
    };

    if (tool.inputSchema.properties) {
      for (const [key, value] of Object.entries(tool.inputSchema.properties)) {
        const prop = value as any;
        // Map basic types
        let type = SchemaType.STRING;
        if (prop.type === "integer" || prop.type === "number")
          type = SchemaType.NUMBER;
        if (prop.type === "boolean") type = SchemaType.BOOLEAN;
        if (prop.type === "array") type = SchemaType.ARRAY;
        if (prop.type === "object") type = SchemaType.OBJECT;

        parameters.properties[key] = {
          type: type,
          description: prop.description,
        };
      }
    }

    return {
      name: tool.name,
      description: tool.description,
      parameters: parameters,
    };
  });
}

export async function POST(request: NextRequest) {
  try {
    await ensureMcpConnection();
    const { message, sessionId, messages, user } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get or create chat session
    let chat = chatSessions.get(sessionId);

    if (!chat) {
      if (!user) {
        return NextResponse.json(
          { error: "User context is required for new session" },
          { status: 400 }
        );
      }

      const systemInstruction = `
        You are a helpful Student Enrollment Assistant for MSU.
        Your goal is to help students manage their course enrollments.

        Current Student Context:
        - Name: ${user.firstName} ${user.lastName}
        - Student ID (Display): ${user.idNumber}
        - User UUID (Internal): ${user.id}

        CRITICAL WORKFLOW - Follow these steps in order:
        1. When a student asks what courses they can enroll in, ALWAYS use check_eligible_courses tool FIRST.
        2. ONLY show sections for courses that are in the eligible_courses list from check_eligible_courses.
        3. NEVER recommend or show sections for courses in the not_eligible_courses list.
        4. If a student asks about a specific course that's not eligible, explain why (missing prerequisites) and suggest they complete the prerequisites first.

        Rules:
        5. Always use the User UUID (${user.id}) when calling tools that require 'student_id'. Do NOT use the Display ID.
        6. When listing courses or sections, present them in a clear, readable format (e.g., tables or bullet points).
        7. Before enrolling a student, you can check if they are already enrolled or if there are conflicts if the tools allow, but primarily rely on the tool's return message.
        8. If a tool returns an error, explain it clearly to the student.
        9. Be polite and professional.
        10. You have access to tools to list courses, list sections, check enrollments, enroll/drop students, check prerequisites, and check eligible courses. Use them!
        
        Section Recommendations:
        11. When a student asks you to choose sections for them or says "you decide", you SHOULD make recommendations and proceed with enrollment.
        12. To recommend sections, FIRST use check_eligible_courses to confirm eligibility, THEN use list_sections for ONLY the eligible courses.
        13. Prioritize sections based on:
           - Availability (not full)
           - Balanced schedule (avoid back-to-back classes if possible)
           - Morning vs afternoon preferences if mentioned
        14. When recommending, explain briefly why you chose each section (e.g., "Section A has good availability and fits well in your schedule").
        15. You can use the batch enrollment feature by providing multiple section IDs to enroll_student (e.g., section_ids="1,2,3").
        16. After making recommendations and getting student approval (or if they explicitly say "enroll me" or "you decide"), proceed with the enrollment.
      `;

      // Fetch tools from MCP
      const tools = await getGeminiTools(client);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: tools }],
      });

      chat = model.startChat();
      chatSessions.set(sessionId, chat);
    }

    // Send the current message
    let result = await chat.sendMessage(message);
    let response = result.response;

    // Simple loop for tool calls (max 5 turns to prevent infinite loops)
    let turns = 0;
    const functionCalls = response.functionCalls();

    while (functionCalls && functionCalls.length > 0 && turns < 5) {
      turns++;
      const functionResponses = [];

      for (const call of functionCalls) {
        try {
          const toolResult = (await client.callTool({
            name: call.name,
            arguments: call.args as any,
          })) as CallToolResult;

          // MCP returns { content: [{ type: 'text', text: '...' }] }
          const resultText = toolResult.content
            .map((c: any) => (c.type === "text" ? c.text : ""))
            .join("\n");

          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: { result: resultText },
            },
          });
        } catch (e: any) {
          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: { error: e.message },
            },
          });
        }
      }

      // Send tool results back to model
      result = await chat.sendMessage(functionResponses);
      response = result.response;
    }

    return NextResponse.json({
      response: response.text(),
      sessionId,
    });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    // Log detailed error if available
    if (error.cause) console.error("Error cause:", error.cause);
    if (error.stack) console.error("Error stack:", error.stack);

    return NextResponse.json(
      { error: "Failed to process message", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (sessionId) {
      chatSessions.delete(sessionId);
    } else {
      chatSessions.clear();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing chat session:", error);
    return NextResponse.json(
      { error: "Failed to clear session" },
      { status: 500 }
    );
  }
}
