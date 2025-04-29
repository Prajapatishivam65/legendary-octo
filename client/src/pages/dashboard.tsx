import { useEffect, useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

interface Message {
  role: "user" | "model";
  parts: {
    text: string;
    type: "text";
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

interface FunctionCall {
  name: string;
  args: Record<string, any>;
}

const Dashboard = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mcpClient, setMcpClient] = useState<Client | null>(null);
  const [aiClient, setAiClient] = useState<GoogleGenAI | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom of messages whenever chat history updates
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const connectToMcp = async () => {
    try {
      setIsLoading(true);

      // Initialize Google GenAI client
      const ai = new GoogleGenAI({ apiKey });
      setAiClient(ai);

      // Initialize MCP client
      const client = new Client({
        name: "dashboard-client",
        version: "1.0.0",
      });

      await client.connect(
        new SSEClientTransport(new URL("http://localhost:3001/sse"))
      );

      // Get available tools
      const toolList = (await client.listTools()).tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description || "", // Provide empty string fallback for undefined descriptions
          parameters: {
            type: tool.inputSchema.type,
            properties: tool.inputSchema.properties || {}, // Ensure properties is an object
            required: tool.inputSchema.required || [], // Ensure required is an array
          },
        };
      });

      setTools(toolList);
      setMcpClient(client);
      setIsConnected(true);

      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: "Connected to MCP server. You can start chatting!",
              type: "text",
            },
          ],
        },
      ]);
    } catch (error) {
      console.error("Failed to connect:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: `Connection error: ${error.message}`, type: "text" }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !isConnected || !mcpClient || !aiClient) return;

    // Add user message to chat history
    const newMessage: Message = {
      role: "user",
      parts: [{ text: userInput, type: "text" }],
    };

    setChatHistory((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      await processUserInput(newMessage);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: `Error: ${errorMessage}`, type: "text" }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const processUserInput = async (userMessage: Message) => {
    const updatedHistory = [...chatHistory, userMessage];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: updatedHistory,
      config: {
        tools: [
          {
            functionDeclarations: tools,
          },
        ],
      },
    });

    const functionCall = response.candidates[0].content.parts[0].functionCall;
    const responseText = response.candidates[0].content.parts[0].text;

    if (functionCall) {
      await handleToolCall(functionCall as FunctionCall, updatedHistory);
    } else {
      const modelResponse: Message = {
        role: "model",
        parts: [{ text: responseText, type: "text" }],
      };
      setChatHistory((prev) => [...prev, modelResponse]);
    }
  };

  const handleToolCall = async (
    toolCall: FunctionCall,
    currentHistory: Message[]
  ) => {
    // Add tool call message
    const toolCallMessage: Message = {
      role: "model",
      parts: [{ text: `Calling tool: ${toolCall.name}`, type: "text" }],
    };

    setChatHistory((prev) => [...prev, toolCallMessage]);

    try {
      // Call the tool
      const toolResult = await mcpClient.callTool({
        name: toolCall.name,
        arguments: toolCall.args,
      });

      // Add tool result message
      const toolResultMessage: Message = {
        role: "user",
        parts: [
          { text: `Tool result: ${toolResult.content[0].text}`, type: "text" },
        ],
      };

      setChatHistory((prev) => [...prev, toolResultMessage]);

      // Continue the conversation with the tool result
      const updatedHistory = [
        ...currentHistory,
        toolCallMessage,
        toolResultMessage,
      ];

      const response = await aiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: updatedHistory,
        config: {
          tools: [
            {
              functionDeclarations: tools,
            },
          ],
        },
      });

      const newFunctionCall =
        response.candidates[0].content.parts[0].functionCall;
      const newResponseText = response.candidates[0].content.parts[0].text;

      if (newFunctionCall) {
        // Handle nested tool call recursively
        await handleToolCall(newFunctionCall as FunctionCall, updatedHistory);
      } else {
        // Add final model response
        const modelResponse: Message = {
          role: "model",
          parts: [{ text: newResponseText, type: "text" }],
        };
        setChatHistory((prev) => [...prev, modelResponse]);
      }
    } catch (error) {
      console.error("Tool call error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: `Tool call error: ${error.message}`, type: "text" }],
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Gemini + MCP Dashboard</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* API Key input */}
        {!isConnected ? (
          <div className="bg-white p-4 mb-4 rounded shadow">
            <div className="flex flex-col mb-4">
              <label className="mb-2 font-medium">Gemini API Key</label>
              <input
                type="password"
                className="border p-2 rounded"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={connectToMcp}
              disabled={isLoading || !apiKey.trim()}
            >
              {isLoading ? "Connecting..." : "Connect"}
            </button>
          </div>
        ) : null}

        {/* Chat area */}
        <div className="flex-1 bg-white rounded shadow flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded max-w-3xl ${
                  message.role === "user"
                    ? "bg-blue-100 ml-auto"
                    : "bg-gray-100 mr-auto"
                }`}
              >
                {message.parts[0].text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border p-2 rounded"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                disabled={!isConnected || isLoading}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSendMessage}
                disabled={!isConnected || isLoading || !userInput.trim()}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Tools */}
      {isConnected && (
        <div className="bg-white shadow p-4">
          <h2 className="font-medium mb-2">Available Tools: {tools.length}</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="bg-gray-100 px-3 py-1 rounded text-sm whitespace-nowrap"
              >
                {tool.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
