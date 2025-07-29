import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: [{
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  }], 
  stock: {
    type: Number,
    required: true,
    default: 1,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema);
export default Product;