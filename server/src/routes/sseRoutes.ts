import { Router } from "express";
import { handleSSE, handlePostMessage } from "../controllers/sseController";

const router = Router();

router.get("/sse", handleSSE);
router.post("/messages", handlePostMessage);

// In your routes file
router.get("/test1", (req, res) => {
  res.send("Test endpoint working");
});

export default router;
