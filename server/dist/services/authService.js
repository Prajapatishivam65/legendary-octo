"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.validateUser = exports.createUser = exports.AuthError = void 0;
const client_1 = require("@prisma/client");
const passwords_1 = require("../utils/passwords");
const prisma = new client_1.PrismaClient();
class AuthError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AuthError";
    }
}
exports.AuthError = AuthError;
const createUser = async (email, password, avatarUrl) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AuthError("User with this email already exists", 400);
    }
    const hashedPassword = await (0, passwords_1.hashPassword)(password);
    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            avatarUrl,
        },
    });
};
exports.createUser = createUser;
const validateUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AuthError("Invalid email or password", 401);
    }
    const isPasswordValid = await (0, passwords_1.comparePasswords)(password, user.password);
    if (!isPasswordValid) {
        throw new AuthError("Invalid email or password", 401);
    }
    return user;
};
exports.validateUser = validateUser;
const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AuthError("User not found", 404);
    }
    return user;
};
exports.getUserById = getUserById;
