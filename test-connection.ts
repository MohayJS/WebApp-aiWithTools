import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";
import path from "path";

// Load env vars
dotenv.config();

const apiKey = process.env.GOOGLE_AI_API_KEY;
const mcpServerPath = "C:\\xampp\\htdocs\\mcp-msuenrollment\\dist\\index.js";

console.log("--- Starting Test ---");
console.log("API Key present:", !!apiKey);
console.log("MCP Path:", mcpServerPath);

async function test() {
  try {
    // 1. Test MCP Connection
    console.log("\n1. Testing MCP Connection...");
    const client = new Client({
      name: "test-client",
      version: "1.0.0",
    });

    const transport = new StdioClientTransport({
      command: "node",
      args: [mcpServerPath],
      env: {
        ...(process.env as Record<string, string>),
        PATH: process.env.PATH || "",
      },
    });

    await client.connect(transport);
    console.log("✅ MCP Connected!");

    // 2. Test List Tools
    console.log("\n2. Testing List Tools...");
    const toolsResult = await client.listTools();
    console.log(
      "✅ Tools found:",
      toolsResult.tools.map((t) => t.name).join(", ")
    );

    // 3. Test Gemini Connection
    console.log("\n3. Testing Gemini Connection...");
    const genAI = new GoogleGenerativeAI(apiKey!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent("Hello");
    console.log("✅ Gemini Response:", result.response.text());

    console.log("\n--- Test Passed ---");
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ TEST FAILED");
    console.error("Error:", error);
    if (error.cause) console.error("Cause:", error.cause);
    process.exit(1);
  }
}

test();
