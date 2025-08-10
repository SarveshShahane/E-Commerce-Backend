import express from "express";
import Joi from 'joi';
const router = express.Router();
import {
  getAllOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authMiddleware, checkAdmin } from "../middlewares/auth.js";
import { validate, validateParams, validateQuery } from "../middlewares/validation.js";
import { updateOrderStatusSchema, orderQuerySchema } from "../validation/order.validation.js";
import { mongoIdSchema } from "../validation/cart.validation.js";

const orderIdParamSchema = Joi.object({
  id: mongoIdSchema
});
router.get("/", authMiddleware, validateQuery(orderQuerySchema), getAllOrders);
router.get("/:id", authMiddleware, validateParams(orderIdParamSchema), getOrder);
router.patch("/:id/cancel", authMiddleware, validateParams(orderIdParamSchema), cancelOrder);
router.patch("/:id/status", authMiddleware, checkAdmin, validateParams(orderIdParamSchema), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
