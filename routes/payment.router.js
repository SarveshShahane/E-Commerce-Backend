import express from "express";
import {
  createCustomer,
  attachPaymentMethod,
  createPaymentIntent,
  handleStripeWebhook
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-customer", authMiddleware, createCustomer);

router.post("/attach-payment-method", authMiddleware, attachPaymentMethod);

router.post("/create-payment-intent", authMiddleware, createPaymentIntent);


router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
export default router;
