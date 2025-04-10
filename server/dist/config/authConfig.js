"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfig = void 0;
exports.authConfig = {
    jwtSecret: process.env.JWT_SECRET || "my-secret-key",
    jwtExpiresIn: 7,
    saltRounds: 10,
};
