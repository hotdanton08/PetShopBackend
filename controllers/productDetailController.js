// controller/productDetailController.js
const mongoose = require("mongoose");

const ProductDetails = require("../models/productDetails");

// 獲取特定產品
exports.getProductDetailById = async (req, res) => {
  try {
    console.log("111111");
    const productDetail = await ProductDetails.findById(req.params.id);
    console.log("222222");
    if (!productDetail)
      return res.status(404).json({ message: "ProductDetail not found" });
    res.json(productDetail);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 獲取所有產品
exports.getAllProductDetails = async (req, res) => {
  try {
    const productDetails = await ProductDetails.find(); // 查詢所有產品
    res.json(productDetails); // 回傳所有產品的資料
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
