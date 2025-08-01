import express from "express";
const router = express.Router();
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/product.controller.js";
import upload from "../config/multer.js";
import { authMiddleware, checkSeller } from "../middlewares/auth.js";

//add product
router.post(
  "/new",
  authMiddleware,
  checkSeller,
  upload.array("images"),
  createProduct
);

//get all products
router.get("/", authMiddleware, getAllProducts);

//get specific product
router.get("/:id", getProduct);

//update product
router.put(
  "/:id",
  authMiddleware,
  checkSeller,
  upload.array("images"),
  updateProduct
);

//delete product
router.delete("/:id", authMiddleware, checkSeller, deleteProduct);
export default router;
