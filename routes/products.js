const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 定義產品相關的路由
router.get('/', productController.getAllProducts); // 獲取所有產品
router.get('/:id', productController.getProductById); // 根據ID獲取單個產品
router.post('/', productController.createProduct); // 創建新產品
router.put('/:id', productController.updateProduct); // 更新產品
router.delete('/:id', productController.deleteProduct); // 刪除產品

module.exports = router;
