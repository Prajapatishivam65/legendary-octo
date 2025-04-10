"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    logger_1.default.info(`Server is running on port ${PORT}`);
});
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    logger_1.default.error("Uncaught Exception:", error);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger_1.default.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});
