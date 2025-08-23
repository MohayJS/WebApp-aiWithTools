import { GoogleGenAI, mcpToTool } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

// Store chat sessions in memory (in production, use a database or Redis)
const chatSessions = new Map();

// Create server parameters for stdio connection
const serverParams = new StdioClientTransport({
  command: "node", // Executable
  args: [
    "C:/xampp/htdocs/gemini-cli/mcp-database-server/dist/src/index.js",
    "--mysql",
    "--host", "localhost",
    "--database", "classattendancedb",
    "--port", "3306",
    "--user", "root",
    "--password", "Ngick13@"
  ],
});

const client = new Client({
  name: "example-client",
  version: "1.0.0",
});

await client.connect(serverParams);

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, messages } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get or create chat session
    let chat = chatSessions.get(sessionId);

    if (!chat) {
      chat = await genAI.chats.create({
        model: "gemini-2.5-flash",
        config: {
          tools: [mcpToTool(client)], // uses the session, will automatically call the tool using automatic function calling
        },
      });
      chatSessions.set(sessionId, chat);

      // If there are previous messages, send them to establish context
      if (messages && messages.length > 0) {
        for (const msg of messages) {
          if (msg.role === "user") {
            await chat.sendMessage({ message: msg.content });
          }
        }
      }
    }

    // Send the current message
    const response = await chat.sendMessage({ message });

    return NextResponse.json({
      response: response.text,
      sessionId,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
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
      // Clear all sessions if no specific sessionId provided
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
