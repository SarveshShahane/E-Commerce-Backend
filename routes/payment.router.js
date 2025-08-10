import express from "express";
import {
  createCustomer,
  attachPaymentMethod,
  createPaymentIntent,
  handleStripeWebhook
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validation.js";
import { createPaymentIntentSchema, attachPaymentMethodSchema } from "../validation/payment.validation.js";

const router = express.Router();

router.post("/create-customer", authMiddleware, createCustomer);

router.post("/attach-payment-method", authMiddleware, validate(attachPaymentMethodSchema), attachPaymentMethod);

router.post("/create-payment-intent", authMiddleware, validate(createPaymentIntentSchema), createPaymentIntent);


router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
export default router;
