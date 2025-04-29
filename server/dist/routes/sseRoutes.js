"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sseController_1 = require("../controllers/sseController");
const router = (0, express_1.Router)();
router.get("/sse", sseController_1.handleSSE);
router.post("/messages", sseController_1.handlePostMessage);
// In your routes file
router.get("/test1", (req, res) => {
    res.send("Test endpoint working");
});
exports.default = router;
