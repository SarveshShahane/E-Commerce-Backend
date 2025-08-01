import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import asyncHandler from "express-async-handler";
import stripe from "../config/stripe.js";
import {
  orderCancel,
  orderDelivered,
  orderShipped,
} from "../utils/mails.utils.js";

const getAllOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const orders = await Order.find({ user: userId })
    .populate("products.product", "name price images category")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!userId) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const order = await Order.findById(id)
    .populate("products.product", "name price images category")
    .populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("You are not authorized to view this order");
  }

  res.status(200).json({
    success: true,
    order,
  });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!userId) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const order = await Order.findById(id)
    .populate("products.product")
    .populate("user", "email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("You are not authorized to cancel this order");
  }

  if (order.status === "Cancelled") {
    res.status(400);
    throw new Error("Order is already cancelled");
  }

  if (order.status === "Shipped" || order.status === "Delivered") {
    res.status(400);
    throw new Error("Cannot cancel shipped or delivered orders");
  }

  const orderAge = Date.now() - order.createdAt.getTime();
  const maxCancellationTime = 24 * 60 * 60 * 1000;

  if (orderAge > maxCancellationTime) {
    res.status(400);
    throw new Error(
      "Orders can only be cancelled within 24 hours of placement"
    );
  }

  let refundProcessed = false;

  try {
    if (order.status === "Paid" && order.stripePaymentIntentId) {
      await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
        reason: "requested_by_customer",
      });
      refundProcessed = true;
      console.log(`Refund processed for order ${order._id}`);
    }

    const stockUpdates = order.products.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { stock: item.quantity } },
      },
    }));

    await Product.bulkWrite(stockUpdates);
    console.log(`Stock restored for order ${order._id}`);

    order.status = "Cancelled";
    try {
      await orderCancel(order.user.email, order.products);
    } catch (error) {
      console.error("Error sending cancellation email:", error);
    }
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled and refund processed successfully",
      refundProcessed,
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);

    if (!refundProcessed && order.status === "Paid") {
      res.status(500);
      throw new Error("Failed to process refund. Order cancellation aborted.");
    }

    res.status(500);
    throw new Error(`Failed to cancel order: ${error.message}`);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  const user = await User.findById({ _id: order.user }).select("email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const validStatuses = [
    "Pending",
    "Paid",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  order.status = status;
  if (status === "Shipped") {
    await orderShipped(email, order.products);
    order.shippedAt = new Date();
  } else if (status === "Delivered") {
    await orderDelivered(email, order.products);
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});

export { getAllOrders, getOrder, cancelOrder, updateOrderStatus };
