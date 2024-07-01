// routes/users.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { userValidationRules } = require('../utils/validators'); // 引入驗證規則
const authenticateJWT = require('../utils/authMiddleware'); // 引入 JWT 中介層

// 定義用戶相關的路由
router.get('/', authenticateJWT, userController.getAllUsers); // 獲取所有用戶
router.get('/:id', authenticateJWT, userController.getUserById); // 根據ID獲取單個用戶
router.post('/register', userValidationRules, userController.registerUser); // 註冊新用戶
router.post('/login', userController.loginUser); // 用戶登入
router.put('/:id', authenticateJWT, userValidationRules, userController.updateUser); // 更新用戶
router.delete('/:id', authenticateJWT, userController.deleteUser); // 刪除用戶

module.exports = router;