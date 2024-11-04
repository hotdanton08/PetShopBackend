// routes/productDetails.js

const express = require("express");
const router = express.Router();
const productDetailController = require("../controllers/productDetailController");

// 定義產品相關的路由
router.get("/:id", productDetailController.getProductDetailById); // 根據ID獲取單個產品
router.get("/", productDetailController.getAllProductDetails); // 獲取所有產品

module.exports = router;
