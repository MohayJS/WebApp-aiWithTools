const { GoogleGenAI } = require("@google/genai");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const path = require("path");
require("dotenv").config();

// Load env vars
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
                ...process.env,
                PATH: process.env.PATH || "",
            }
        });

        await client.connect(transport);
        console.log("✅ MCP Connected!");

        // 2. Test List Tools
        console.log("\n2. Testing List Tools...");
        const toolsResult = await client.listTools();
        console.log("✅ Tools found:", toolsResult.tools.map(t => t.name).join(", "));

        // 3. Test Gemini Connection
        console.log("\n3. Testing Gemini Connection...");
        const genAI = new GoogleGenAI({ apiKey: apiKey });

        if (genAI.chats) {
            console.log("Using genAI.chats...");

            // Fetch tools
            console.log("Fetching tools for Gemini...");
            const tools = toolsResult.tools.map(tool => {
                const parameters = {
                    type: "OBJECT",
                    properties: {},
                    required: tool.inputSchema.required || []
                };

                if (tool.inputSchema.properties) {
                    for (const [key, value] of Object.entries(tool.inputSchema.properties)) {
                        const prop = value;
                        let type = "STRING";
                        if (prop.type === 'integer' || prop.type === 'number') type = "NUMBER";
                        if (prop.type === 'boolean') type = "BOOLEAN";
                        if (prop.type === 'array') type = "ARRAY";
                        if (prop.type === 'object') type = "OBJECT";

                        parameters.properties[key] = {
                            type: type,
                            description: prop.description,
                        };
                    }
                }

                return {
                    name: tool.name,
                    description: tool.description,
                    parameters: parameters
                };
            });

            console.log("Creating chat with tools...");
            const chat = await genAI.chats.create({
                model: "gemini-2.5-flash",
                config: {
                    systemInstruction: "You are a helpful assistant.",
                    tools: [{ functionDeclarations: tools }],
                },
            });

            console.log("Sending message...");
            const result = await chat.sendMessage({ message: "List the courses available." });
            console.log("✅ Gemini Response Text:", result.text);
            console.log("Result keys:", Object.keys(result));

            // Check for function calls
            if (result.functionCalls) {
                console.log("result.functionCalls is:", typeof result.functionCalls);
                if (typeof result.functionCalls === 'function') {
                    console.log("Calls:", result.functionCalls());
                } else {
                    console.log("Calls:", result.functionCalls);
                }
            } else {
                console.log("No result.functionCalls property");
            }

        } else {
            console.error("❌ Unknown Gemini SDK structure.");
        }

        console.log("\n--- Test Passed ---");
        process.exit(0);

    } catch (error) {
        console.error("\n❌ TEST FAILED");
        console.error("Error:", error);
        if (error.cause) console.error("Cause:", error.cause);
        process.exit(1);
    }
}

test();
