"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransportBySessionId = exports.createTransport = void 0;
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const transports = {};
const createTransport = (res) => {
    const transport = new sse_js_1.SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;
    res.on("close", () => {
        delete transports[transport.sessionId];
    });
    return transport;
};
exports.createTransport = createTransport;
const getTransportBySessionId = (sessionId) => transports[sessionId];
exports.getTransportBySessionId = getTransportBySessionId;
