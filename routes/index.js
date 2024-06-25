var express = require('express'); // 引入 Express 框架
var router = express.Router(); // 創建一個路由對象

// 定義根路由的 GET 請求處理器
router.get('/', function(req, res, next) {
  res.send('Welcome to the API Home Page'); // 返回一個簡單的歡迎消息
});

module.exports = router; // 導出路由對象，以便在 app.js 中使用
