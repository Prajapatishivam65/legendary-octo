import { Router } from "express";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/auth", authRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default router;
