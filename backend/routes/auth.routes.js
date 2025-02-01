import { Router } from "express";
import { loginController, logoutController, refreshTokenController, signupController } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/signup", signupController)
router.post("/login", loginController)
router.get("/logout", logoutController)
router.get("/refresh-token", refreshTokenController)


export default router;