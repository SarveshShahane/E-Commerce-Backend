import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category || !stock) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
  }

  if (images.length === 0) {
    res.status(400);
    throw new Error("At least one product image is required");
  }

  const sellerId = req.user._id;
  const newProduct = new Product({
    name,
    description,
    price,
    category,
    images,
    stock,
    sellerId,
  });

  await newProduct.save();
  res.status(201).json({
    message: "Product created successfully",
    product: newProduct,
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "users",
        localField: "sellerId",
        foreignField: "_id",
        as: "seller",
      },
    },
    { $unwind: "$seller" },
    {
      $project: {
        name: 1,
        description: 1,
        price: 1,
        category: 1,
        stock: 1,
        images: 1,
        seller: {
          name: "$seller.name",
          email: "$seller.email",
        },
      },
    },
  ]);
  res.status(200).json({ product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;
  if (!name || !description || !price || !category || !stock) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not authorized to update this product");
  }
  product.name = name;
  product.description = description;
  product.price = price;
  product.category = category;
  product.stock = stock;
  if (req.files && req.files.length > 0) {
    product.images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
  }
  await product.save();
  res.status(200).json({
    message: "Product updated successfully",
    product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not authorized to delete this product");
  }
  await Product.findByIdAndDelete(id);
  res.status(200).json({ message: "Product deleted successfully" });
});

export { createProduct, getProduct, updateProduct, deleteProduct };
