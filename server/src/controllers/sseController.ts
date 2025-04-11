import { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  createTransport,
  getTransportBySessionId,
} from "../transports/sseTransport";
import { z } from "zod";

const server = new McpServer({
  name: "example-server",
  version: "1.0.0",
});

server.tool(
  "addTwoNumbers",
  "Add two numbers",
  {
    a: z.number(),
    b: z.number(),
  },
  async (arg: any) => {
    const { a, b } = arg;
    return {
      content: [
        {
          type: "text",
          text: `The sum of ${a} and ${b} is ${a + b}`,
        },
      ],
    };
  }
);

export const handleSSE = async (_req: Request, res: Response) => {
  const transport = createTransport(res);
  await server.connect(transport);
};

export const handlePostMessage = async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = getTransportBySessionId(sessionId);
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No transport found for sessionId");
  }
};
