import { Router } from "express";
import authRoutes from "./authRoutes";
import sseRoutes from "./sseRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/sse", sseRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default router;
