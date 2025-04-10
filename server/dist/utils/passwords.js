"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const authConfig_1 = require("../config/authConfig");
const hashPassword = async (password) => {
    return bcrypt_1.default.hash(password, authConfig_1.authConfig.saltRounds);
};
exports.hashPassword = hashPassword;
const comparePasswords = async (plainPassword, hashedPassword) => {
    return bcrypt_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePasswords = comparePasswords;
