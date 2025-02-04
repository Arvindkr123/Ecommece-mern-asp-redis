import { Router } from "express";
import { getAllProductControllers, deleteProductController, getFeaturedProductControllers, createProductControllers, getRecommendationsProductControllers, getProductByCategoryControllers, toggleProductFeatureController } from "../controllers/product.controllers.js"
import { adminRoute, protectRoute } from "../middlewares/protectRoute.middlewares.js";

const router = Router();


router.post("/", protectRoute, adminRoute, createProductControllers);
router.get("/", protectRoute, adminRoute, getAllProductControllers);
router.get("/featured", getFeaturedProductControllers);
router.get("/category/:category", getProductByCategoryControllers);
router.get('/recommendation', getRecommendationsProductControllers)

router.patch("/:id", protectRoute, adminRoute, toggleProductFeatureController)
router.delete("/:id", protectRoute, adminRoute, deleteProductController)


export default router;