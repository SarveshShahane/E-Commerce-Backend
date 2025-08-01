import asyncHandler from 'express-async-handler';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user._id;
  
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }
  
  let cart = await Cart.findOne({ user: userId });
  
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }
  
  const existingItem = cart.items.find(item => 
    item.product.toString() === productId
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  
  await cart.save();
  await cart.populate('items.product', 'name price images stock');
  
  res.status(200).json({
    success: true,
    message: 'Product added to cart',
    cart
  });
});

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const cart = await Cart.findOne({ user: userId })
    .populate('items.product', 'name price images stock sellerId');
    
  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { items: [] },
      total: 0
    });
  }
  
  const total = cart.items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );
  
  res.status(200).json({
    success: true,
    cart,
    total
  });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  cart.items = cart.items.filter(item => 
    item.product.toString() !== productId
  );
  
  await cart.save();
  await cart.populate('items.product', 'name price images stock');
  
  res.status(200).json({
    success: true,
    message: 'Product removed from cart',
    cart
  });
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  await Cart.findOneAndUpdate(
    { user: userId },
    { items: [] },
    { new: true }
  );
  
  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully'
  });
});

export { addToCart, getCart, removeFromCart, clearCart };