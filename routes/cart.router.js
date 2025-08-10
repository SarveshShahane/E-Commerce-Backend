import express from "express";
const router = express.Router();
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { authMiddleware, checkBuyer } from "../middlewares/auth.js";
import { validate, validateParams } from "../middlewares/validation.js";
import { addToCartSchema, productIdParamSchema } from "../validation/cart.validation.js";
router.post("/add", authMiddleware, validate(addToCartSchema), addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/remove/:productId", authMiddleware, validateParams(productIdParamSchema), removeFromCart);
router.delete("/clear", authMiddleware, clearCart);
export default router;
