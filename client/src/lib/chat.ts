import { config } from "dotenv";
import readline from "readline/promises";
import { GoogleGenAI } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// Load environment variables
config();

// Define types for the application
interface ChatMessage {
  role: "user" | "model" | "function";
  name?: string; // For function messages
  parts: {
    text: string;
    type: string;
  }[];
}

interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

interface ToolCall {
  name: string;
  args: Record<string, any>;
}

interface ToolResult {
  content: {
    text: string;
    [key: string]: any;
  }[];
}

interface ChatMessage {
  role: "user" | "model" | "function";
  name?: string; // For function messages
  parts: {
    text: string;
    type: string;
  }[];
}

// Placeholder type for GenerateContentResult (replace with actual type from @google/genai)
interface GenerateContentResult {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string;
        type: string;
        functionCall?: {
          name: string;
          args: Record<string, any>;
        };
      }>;
    };
  }>;
}

// Initialize clients
const ai: GoogleGenAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});
const mcpClient: Client = new Client({
  name: "example-client",
  version: "1.0.0",
});

const chatHistory: ChatMessage[] = [];
const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let tools: Tool[] = [];

// Connect to MCP server and get tools
async function initialize(): Promise<void> {
  try {
    await mcpClient.connect(
      new SSEClientTransport(new URL("http://localhost:3000/api/test/sse"))
    );
    console.log("Connected to Model Context Protocol server");

    const availableTools = await mcpClient.listTools();
    tools = availableTools.tools.map((tool: any) => ({
      name: tool.name,
      description: tool.description || "",
      parameters: {
        type: tool.inputSchema.type,
        properties: tool.inputSchema.properties,
        required: tool.inputSchema.required || [],
      },
    }));
    console.log("Available Tools: ", tools);

    // Start the chat loop after initialization
    await chatLoop();
  } catch (error: unknown) {
    console.error("Error initializing:", error);
  }
}

async function chatLoop(): Promise<void> {
  try {
    // Prompt user
    const question: string = await rl.question("You: ");
    chatHistory.push({
      role: "user",
      parts: [
        {
          text: question,
          type: "text",
        },
      ],
    });

    // Call generateContent with current chatHistory and tools
    let response: GenerateContentResult = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: chatHistory,
      config: {
        tools: {
          functionDeclarations: tools,
        },
      },
    });

    // Handle tool calls
    while (response.candidates[0].content.parts[0]?.functionCall) {
      const functionCall = response.candidates[0].content.parts[0].functionCall;
      const toolResult: ToolResult = await mcpClient.callTool({
        name: functionCall.name,
        arguments: functionCall.args,
      });

      // Add tool result as "function" message
      chatHistory.push({
        role: "function",
        name: functionCall.name,
        parts: [
          {
            text: toolResult.content[0]?.text || "",
            type: "text",
          },
        ],
      });

      // Call generateContent again with updated chatHistory
      response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: chatHistory,
        config: {
          tools: {
            functionDeclarations: tools,
          },
        },
      });
    }

    // Add final assistant response to chatHistory
    chatHistory.push({
      role: "model",
      parts: response.candidates[0].content.parts.map((part) => ({
        text: part.text || "",
        type: part.type || "text",
      })),
    });

    console.log(
      `AI: ${response.candidates[0].content.parts[0]?.text || "No response"}`
    );

    // Call chatLoop again for next turn
    await chatLoop();
  } catch (error: unknown) {
    console.error("Error in chat loop:", error);
    await chatLoop();
  }
}

// Start the application
initialize();
