"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePostMessage = exports.handleSSE = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const sseTransport_1 = require("../transports/sseTransport");
const zod_1 = require("zod");
const server = new mcp_js_1.McpServer({
    name: "example-server",
    version: "1.0.0",
});
server.tool("addTwoNumbers", "Add two numbers", {
    a: zod_1.z.number(),
    b: zod_1.z.number(),
}, async (arg) => {
    const { a, b } = arg;
    return {
        content: [
            {
                type: "text",
                text: `The sum of ${a} and ${b} is ${a + b}`,
            },
        ],
    };
});
const handleSSE = async (_req, res) => {
    const transport = (0, sseTransport_1.createTransport)(res);
    await server.connect(transport);
};
exports.handleSSE = handleSSE;
const handlePostMessage = async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = (0, sseTransport_1.getTransportBySessionId)(sessionId);
    if (transport) {
        await transport.handlePostMessage(req, res);
    }
    else {
        res.status(400).send("No transport found for sessionId");
    }
};
exports.handlePostMessage = handlePostMessage;
