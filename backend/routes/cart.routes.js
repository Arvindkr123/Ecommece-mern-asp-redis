import { Router } from "express";
import { adminRoute, protectRoute } from "../middlewares/protectRoute.middlewares.js";
import { addToCartController, getCartProductsController, removeAllFromCartOneProductController, updateCartQuantityProductController } from "../controllers/cart.controllers.js"

const router = router();

router.get('/', protectRoute, getCartProductsController)
router.post('/', protectRoute, addToCartController);
router.delete("/", protectRoute, removeAllFromCartOneProductController);
router.put("/:id", protectRoute, updateCartQuantityProductController);

export default router;