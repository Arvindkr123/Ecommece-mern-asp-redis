import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.middlewares.js";
import { getAllCuponController, validateCupon } from "../controllers/cupons.controllers.js"

const router = Router();

router.get("/", protectRoute, getAllCuponController);
router.get("/validate", protectRoute, getAllCuponController);

export default router;