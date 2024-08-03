// routes/users.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { userValidationRules } = require("../utils/validators"); // 引入驗證規則
const authenticateJWT = require("../utils/authMiddleware"); // 引入 JWT 驗證中介層
const checkRole = require("../utils/checkRole"); // 引入權限檢查中介層

// 定義用戶相關的路由
router.get(
  "/",
  authenticateJWT,
  checkRole(["admin"]),
  userController.getAllUsers
); // 僅限 admin 訪問
router.get(
  "/:id",
  authenticateJWT,
  checkRole(["admin", "user"]),
  userController.getUserById
); // admin 和 user 訪問
router.post("/", userValidationRules, userController.registerUser); // 註冊不需要權限
router.post("/login", userController.loginUser); // 登入不需要權限
router.put(
  "/changePassword",
  authenticateJWT,
  checkRole(["admin", "user"]),
  userController.changePassword
);
router.put(
  "/:id",
  authenticateJWT,
  checkRole(["admin", "user"]),
  userValidationRules,
  userController.updateUser
); // admin 和 user 訪問
router.delete(
  "/:id",
  authenticateJWT,
  checkRole(["admin"]),
  userController.deleteUser
); // 僅限 admin 訪問

module.exports = router;
