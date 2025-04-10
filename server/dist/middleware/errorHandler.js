"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    logger_1.default.error(`Error: ${err.message}`);
    // Don't expose internal server errors to client in production
    const message = statusCode === 500 && process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message;
    res.status(statusCode).json({
        error: {
            message,
        },
    });
};
exports.errorHandler = errorHandler;
