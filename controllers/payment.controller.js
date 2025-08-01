import asyncHandler from "express-async-handler";
import Stripe from "../config/stripe.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { orderConfirmation, paymentStatus } from "../utils/mails.utils.js";
import User from "../models/user.model.js";
const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Stripe.customers.create({
    name: req.user.name,
    email: req.user.email,
  });
  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    customer,
  });
});

const attachPaymentMethod = asyncHandler(async (req, res) => {
  const { customer_id, payment_method_id } = req.body;

  const paymentMethod = await Stripe.paymentMethods.attach(payment_method_id, {
    customer: customer_id,
  });

  await Stripe.customers.update(customer_id, {
    invoice_settings: {
      default_payment_method: paymentMethod.id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Card attached and set as default successfully.",
    paymentMethod,
  });
});
const calculateOrderAmount = async (items) => {
  if (!items || items.length === 0) {
    throw new Error("No items in the cart.");
  }

  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.id);
    if (!product) {
      throw new Error(`Product with ID ${item.id} not found.`);
    }
    totalAmount += product.price * item.quantity;
  }

  return totalAmount;
};
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { items, currency = "inr", customer_id } = req.body;

  if (!items || !customer_id) {
    res.status(400);
    throw new Error("Cart items and customer ID are required.");
  }

  for (const item of items) {
    const product = await Product.findById(item.id);
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(
        `Not enough stock for ${product.name}. Only ${product.stock} left.`
      );
    }
  }

  const amount = await calculateOrderAmount(items);

  const paymentIntent = await Stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency,
    customer: customer_id,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      userId: req.user._id.toString(),
      items: JSON.stringify(items),
    },
  });

  res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    calculatedAmount: amount,
  });
});

const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      console.log(
        "✅ PaymentIntent was successful!",
        paymentIntentSucceeded.id
      );

      const { userId, items } = paymentIntentSucceeded.metadata;
      const parsedItems = JSON.parse(items);
      var user = await User.findById(userId).select("email");
      try {
        const newOrder = await Order.create({
          user: userId,
          products: parsedItems.map((item) => ({
            product: item.id,
            quantity: item.quantity,
          })),
          totalAmount: paymentIntentSucceeded.amount / 100,
          stripePaymentIntentId: paymentIntentSucceeded.id,
          status: "Paid",
          shippingAddress: paymentIntentSucceeded.shipping || {},
        });
        await paymentStatus(user.email, paymentIntentSucceeded.amount/100, true);
        const bulkStockUpdate = parsedItems.map((item) => ({
          updateOne: {
            filter: { _id: item.id },
            update: { $inc: { stock: -item.quantity } },
          },
        }));
        await Product.bulkWrite(bulkStockUpdate);
        console.log(`Order ${newOrder._id} created and stock updated.`);
        await orderConfirmation(user.email, newOrder);
      } catch (error) {
        console.error("Error fulfilling order:", error);
        return res.status(500).json({ error: "Failed to fulfill order." });
      }
      break;

    case "payment_intent.payment_failed":
      const paymentIntentFailed = event.data.object;
      console.log(
        "❌ Payment failed:",
        paymentIntentFailed.id,
        paymentIntentFailed.last_payment_error?.message
      );
      var user = await User.findById(
        paymentIntentFailed.metadata.userId
      ).select("email");
      await paymentStatus(user.email, paymentIntentFailed.amount, false);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
});

export {
  createCustomer,
  attachPaymentMethod,
  createPaymentIntent,
  handleStripeWebhook,
};
