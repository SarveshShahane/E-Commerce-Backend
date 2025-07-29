import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  const totalPrice = product.price * quantity;
  const cart = await Cart.findOne({ userId: req.user._id });
  if (cart) {
    const existingProduct = cart.products.find(
      (p) => p.productId.toString() === productId
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
    cart.totalPrice += totalPrice;
    await cart.save();
  } else {
    const newCart = await Cart.create({
      userId: req.user._id,
      products: [{ productId, quantity }],
      totalPrice: totalPrice,
    });
    await newCart.save();
  }
  res.status(200).json({ message: "Product added to cart successfully" });
});

const updateCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const productIndex = cart.products.findIndex(
    (p) => p.productId.toString() === productId
  );
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  const productDoc = await Product.findById(productId);
  if (!productDoc) {
    return res.status(404).json({ message: "Product not found" });
  }

  cart.products[productIndex].quantity = quantity;

  // Recalculate totalPrice safely
  let total = 0;
  for (const item of cart.products) {
    const prod = await Product.findById(item.productId);
    total += item.quantity * prod.price;
  }
  cart.totalPrice = total;

  await cart.save();

  res.status(200).json({ message: "Cart updated successfully", cart });
});


// const clearCart = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const cart = await Cart.findById(id);
//   if (!cart) {
//     return res.status(404).json({ message: "Cart not found" });
//   }
//   const user = await User.findById(req.user._id);
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   if (user._id.toString() !== cart.userId.toString()) {
//     return res.status(403).json({ message: "Access denied" });
//   }
//   await Cart.deleteOne({ userId: req.user._id });
//   res.status(200).json({ message: "Cart cleared successfully" });
// });

export { addToCart };
