// utils/authMiddleware.js

const jwt = require("jsonwebtoken");

// 驗證 JWT 的中介層
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // 獲取 Authorization header 中的 token
  if (!token) {
    return res.status(401).json({ message: "請提供有效的token" }); // 如果沒有 token，返回 401
  }

  // 驗證 token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "令牌無效" }); // 如果 token 無效，返回 403
    }
    req.user = user; // 將解碼後的用戶信息存入 req.user
    next(); // 調用下一個中介層或路由處理器
  });
};

module.exports = authenticateJWT;
