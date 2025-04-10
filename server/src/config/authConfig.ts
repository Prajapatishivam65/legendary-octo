export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "my-secret-key",
  jwtExpiresIn: 7,
  saltRounds: 10,
};
