import { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  createTransport,
  getTransportBySessionId,
} from "../transports/sseTransport.js";

const server = new McpServer({
  name: "example-server",
  version: "1.0.0",
});

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
