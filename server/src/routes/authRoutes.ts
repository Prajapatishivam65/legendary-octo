import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/authenticate";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/validateInput";

const router = Router();

router.post("/register", validateRegisterInput, authController.register);
router.post("/login", validateLoginInput, authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.getMe);

export default router;
