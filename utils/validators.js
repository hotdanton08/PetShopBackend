// utils/validators.js

const { body } = require('express-validator');

// 用戶驗證規則
const userValidationRules = [
  body('password').isLength({ max: 12 }).withMessage('密碼最多12個字'),
  body('email').isEmail().withMessage('請輸入有效的電子郵件地址')
];

module.exports = {
  userValidationRules
};
