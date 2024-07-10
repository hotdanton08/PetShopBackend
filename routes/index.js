// routes/index.js

var express = require("express"); // 引入 Express 框架
var router = express.Router(); // 創建一個路由對象

// 引入各個子路由
const usersRouter = require("./users");
const productsRouter = require("./products");
const ordersRouter = require("./orders");
const cartsRouter = require("./carts");

// 定義根路由的 GET 請求處理器
router.get("/", function (req, res, next) {
  res.send("Welcome to the API Home Page"); // 返回一個簡單的歡迎消息
});

// 使用子路由
router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/carts", cartsRouter);

module.exports = router; // 導出路由對象，以便在 app.js 中使用
