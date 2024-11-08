// models/productDetails.js

const mongoose = require("mongoose");

const productDetailSchema = new mongoose.Schema({
  productId: { type: Number, unique: true, required: true },
  name: { type: String, required: true }, // 商品名稱
  images: [{ type: String }], // 圖片列表，存儲多個圖片的 URL
  price: { type: Number, required: true }, // 價格
  sold: { type: Number, default: 0 }, // 已售出數量
  description: { type: String, required: true }, // 商品描述
  options: [
    {
      name: String, // 選項名稱（例如顏色、尺寸等）
      stock: Number, // 選項的庫存量
    },
  ], // 商品選項
  createdAt: { type: Date, default: Date.now }, // 創建時間
  updatedAt: { type: Date, default: Date.now }, // 更新時間
});

const ProductDetails = mongoose.model(
  "productDetails",
  productDetailSchema,
  "productDetails"
);

module.exports = ProductDetails;
