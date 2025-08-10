import express from "express";
import Joi from 'joi';
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
import { validate, validateParams, validateFileUpload, validateQuery } from "../middlewares/validation.js";
import { createProductSchema, updateProductSchema, productQuerySchema } from "../validation/product.validation.js";
import { mongoIdSchema } from "../validation/cart.validation.js";

// Create product ID parameter schema
const productIdParamSchema = Joi.object({
  id: mongoIdSchema
});

//add product
router.post(
  "/new",
  authMiddleware,
  checkSeller,
  upload.array("images"),
  validateFileUpload({ maxFiles: 5 }),
  validate(createProductSchema),
  createProduct
);

//get all products (public access)
router.get("/", validateQuery(productQuerySchema), getAllProducts);

//get specific product
router.get("/:id", validateParams(productIdParamSchema), getProduct);

//update product
router.put(
  "/:id",
  authMiddleware,
  checkSeller,
  validateParams(productIdParamSchema),
  upload.array("images"),
  validate(updateProductSchema),
  updateProduct
);

//delete product
router.delete("/:id", authMiddleware, checkSeller, validateParams(productIdParamSchema), deleteProduct);
export default router;
