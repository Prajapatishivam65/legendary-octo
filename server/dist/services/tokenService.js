"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authConfig_1 = require("../config/authConfig");
const generateToken = (userId) => {
    const options = {
        expiresIn: `${authConfig_1.authConfig.jwtExpiresIn}`, // Change this to match your authConfig.jwtExpiresIn type
    };
    return jsonwebtoken_1.default.sign({ userId }, authConfig_1.authConfig.jwtSecret, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, authConfig_1.authConfig.jwtSecret);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
