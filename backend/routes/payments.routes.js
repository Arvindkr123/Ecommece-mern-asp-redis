import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.middlewares.js";
import { createCheckoutSessionControllers, createCheckoutPaymentSuccessControllers } from "../controllers/payments.controllers.js"
const router = Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSessionControllers);
router.post("/checkout-success", protectRoute, createCheckoutPaymentSuccessControllers);

export default router;