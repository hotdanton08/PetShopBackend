// controllers/userController.js

const { User } = require('../models'); // 引入User模型
const { validationResult } = require('express-validator'); // 引入 validationResult 來處理驗證結果
const { successResponse, errorResponse } = require('../utils/responseHandler'); // 引入統一處理 response 的 function
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 獲取所有用戶，支援分頁、篩選和排序
exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 獲取當前頁數，預設為1
  const limit = parseInt(req.query.limit) || 10; // 獲取每頁顯示的記錄數，預設為10
  const offset = (page - 1) * limit; // 計算偏移量

  const { username, email, sortBy, sortOrder } = req.query; // 獲取篩選和排序參數
  const where = {}; // 初始化篩選條件
  const order = []; // 初始化排序條件

  // 篩選條件
  if (username) {
    where.username = username;
  }

  if (email) {
    where.email = email;
  }

  // 排序條件
  if (sortBy && sortOrder) {
    order.push([sortBy, sortOrder]);
  }

  try {
    // 查詢並計數
    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'username', 'email'], // 指定返回的欄位
      where,
      offset,
      limit,
      order
    });
    res.json({
      total: count, // 總記錄數
      pages: Math.ceil(count / limit), // 總頁數
      currentPage: page, // 當前頁數
      data: rows // 返回的用戶數據
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 根據ID獲取單個用戶
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id); // 根據主鍵查詢用戶
    if (user) {
      res.json(user); // 返回用戶數據
    } else {
      res.status(404).json({ error: 'User not found' }); // 用戶不存在
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 創建新用戶
exports.registerUser = async (req, res) => {
  const errors = validationResult(req); // 獲取驗證結果
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array(), 422); // 如果有驗證錯誤，返回 422 狀態碼和錯誤
  }

  try {
    const { username, password, email } = req.body; // 獲取請求體中的數據
    const hashedPassword = await bcrypt.hash(password, 10); // 密碼加密
    const user = await User.create({ username, password: hashedPassword, email }); // 創建新用戶
    return successResponse(res, user, 201); // 返回創建的用戶數據
  } catch (error) {
    return errorResponse(res, error.message, 500); // 返回錯誤信息
  }
};

// 用戶登入
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } }); // 查找用戶
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse(res, 'Email或密碼不正確', 401); // 驗證失敗
    }

    // 生成 JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return successResponse(res, { token }); // 返回 token
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// 更新用戶數據
exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array(), 422);
  }

  try {
    const { username, password, email } = req.body; // 獲取請求體中的數據
    const user = await User.findByPk(req.params.id); // 根據主鍵查詢用戶
    if (user) {
      // 更新用戶數據
      user.username = username;
      user.password = await bcrypt.hash(password, 10);
      user.email = email;
      await user.save(); // 保存更改
      return successResponse(res, user); // 返回更新後的用戶數據
    } else {
      return errorResponse(res, 'User not found', 404); // 用戶不存在
    }
  } catch (error) {
    return errorResponse(res, error.message, 500); // 返回錯誤信息
  }
};

// 刪除用戶
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id); // 根據主鍵查詢用戶
    if (user) {
      await user.destroy(); // 刪除用戶
      return successResponse(res, 'User deleted'); // 返回成功消息
    } else {
      return errorResponse(res, 'User not found', 404); // 用戶不存在
    }
  } catch (error) {
    return errorResponse(res, error.message, 500); // 返回錯誤信息
  }
};
