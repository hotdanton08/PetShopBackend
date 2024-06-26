const express = require('express');
const { body } = require('express-validator'); // 引入 body 來定義驗證規則
const router = express.Router();
const userController = require('../controllers/userController');

// 定義驗證規則
const userValidationRules = [
    body('password').isLength({ max: 12 }).withMessage('密碼最多12個字'),
    body('email').isEmail().withMessage('請輸入有效的電子郵件地址')
];

// 定義用戶相關的路由
router.get('/', userController.getAllUsers); // 獲取所有用戶
router.get('/:id', userController.getUserById); // 根據ID獲取單個用戶
router.post('/', userValidationRules, userController.createUser); // 創建新用戶
router.put('/:id', userController.updateUser); // 更新用戶
router.delete('/:id', userController.deleteUser); // 刪除用戶

module.exports = router;
