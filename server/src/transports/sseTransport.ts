import { Response } from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const transports: { [sessionId: string]: SSEServerTransport } = {};

export const createTransport = (res: Response): SSEServerTransport => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;

  res.on("close", () => {
    delete transports[transport.sessionId];
  });

  return transport;
};

export const getTransportBySessionId = (sessionId: string) =>
  transports[sessionId];
