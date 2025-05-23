"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const sseRoutes_1 = __importDefault(require("./sseRoutes"));
const router = (0, express_1.Router)();
router.use("/auth", authRoutes_1.default);
router.use("/test", sseRoutes_1.default);
// Health check route
router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
exports.default = router;
