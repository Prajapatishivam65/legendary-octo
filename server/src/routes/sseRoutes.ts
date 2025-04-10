import { Router } from "express";
import { handleSSE, handlePostMessage } from "../controllers/sseController.js";

const router = Router();

router.get("/sse", handleSSE);
router.post("/messages", handlePostMessage);

export default router;
