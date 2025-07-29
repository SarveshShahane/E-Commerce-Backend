import express from "express";
const router = express.Router();
import {
  getAllOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authMiddleware, checkAdmin } from "../middlewares/auth.js";
router.get("/", authMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrder);
router.patch("/:id/cancel", authMiddleware, cancelOrder);
router.patch("/:id/status", authMiddleware, checkAdmin, updateOrderStatus);

export default router;
