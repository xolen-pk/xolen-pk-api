import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    selectedFile: {
      type: [String],
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    brand: {
      type: String,
    },
    category: {
      type: [String],
    },
    size: {
      type: [Number],
    },
    shoeFor: {
      type: [String],
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Array,
      default: [],
    },
    discountedPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
