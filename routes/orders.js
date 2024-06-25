const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// 定義訂單相關的路由
router.get('/', orderController.getAllOrders); // 獲取所有訂單
router.get('/:id', orderController.getOrderById); // 根據ID獲取單個訂單
router.post('/', orderController.createOrder); // 創建新訂單
router.put('/:id', orderController.updateOrder); // 更新訂單
router.delete('/:id', orderController.deleteOrder); // 刪除訂單

module.exports = router;
