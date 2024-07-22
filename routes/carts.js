const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// 定義購物車相關的路由
router.get("/", cartController.getAllCarts); // 獲取所有購物車
router.get("/:id", cartController.getCartById); // 根據ID獲取單個購物車
router.post("/", cartController.createCart); // 創建新購物車
router.put("/:id", cartController.updateCart); // 更新購物車
router.delete("/:id", cartController.deleteCart); // 刪除購物車

module.exports = router;
