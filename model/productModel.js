const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product Name must be provided"],
    },
    productDescription: {
      type: String,
      required: [true, "Product description must be provided"],
    },
    productStockQty: {
      type: Number,
      required: [true, "Product Stock Quantity must be provided"],
    },
    productPrice: {
      type: Number,
      required: [true, "Product price must be provided"],
    },
    productStatus: {
      type: String,
      enum: ["available", "unavailable"],
    },
    productImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
