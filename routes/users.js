const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 定義用戶相關的路由
router.get('/', userController.getAllUsers); // 獲取所有用戶
router.get('/:id', userController.getUserById); // 根據ID獲取單個用戶
router.post('/', userController.createUser); // 創建新用戶
router.put('/:id', userController.updateUser); // 更新用戶
router.delete('/:id', userController.deleteUser); // 刪除用戶

module.exports = router;
