import React, { useEffect, useState } from "react";
import { Client } from "@modelcontextprotocol/sdk/client";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/transports/sse";

type Props = {};

const ModelContext: React.FC<Props> = (props) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const mcpClient = new Client({
      name: "ModelContext",
      version: "1.0.0",
    });

    mcpClient
      .connect(new SSEClientTransport(new URL("http://localhost:3000/sse")))
      .then(async () => {
        console.log("Connected to ModelContext Protocol server!");
        setIsConnected(true);
        console.log("connected To the Server");

        const tools = (await mcpClient.listTools.tools()).map((tool: any) => {
          return {
            name: tool.name,
            description: tool.description,
            parameters: {
              type: tool.inputSchema.type,
              properties: tool.inputSchema.properties,
            },
          };
        });
        console.log("Available tools:", tools);
      })
      .catch((error: any) => {
        console.error(
          "Failed to connect to ModelContext Protocol server:",
          error
        );
      });

    // Clean up the connection when component unmounts
    return () => {
      // Add disconnect logic here if the SDK supports it
      // mcpClient.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>ModelContext</h2>
      <p>Status: {isConnected ? "Connected" : "Disconnecting..."}</p>
    </div>
  );
};

export default ModelContext;
