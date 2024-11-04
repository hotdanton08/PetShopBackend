// app.js

// 引入所需模組
require("dotenv").config();
var createError = require("http-errors"); // 用於創建錯誤對象的模組
var express = require("express"); // Express 框架
var path = require("path"); // 處理和轉換文件路徑的模組
var cookieParser = require("cookie-parser"); // 解析 Cookie 的中間件
var logger = require("morgan"); // HTTP 請求日誌中間件
var cors = require("cors"); // 處理跨域資源共享 (CORS) 的中間件

// 引入 Mongoose 模組
var mongoose = require("mongoose"); // 用於與 MongoDB 互動的 ODM（對象文檔映射器）
// 設置 MongoDB 連接 URI
var mongoDB = process.env.MONGODB_URI;

// 連接到 MongoDB
mongoose.connect(mongoDB, {});

// 獲取 MongoDB 的默認連接
var mongoDBConnection = mongoose.connection;

// 綁定連接到錯誤事件（以獲取連接錯誤的通知）
mongoDBConnection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

// 綁定成功連接事件
mongoDBConnection.once("open", function () {
  console.log("Connected to MongoDB");
});

// 引入路由文件
var indexRouter = require("./routes/index");

var app = express(); // 創建一個 Express 應用程序

// 設置視圖引擎
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade"); // 使用 Jade 模板引擎

app.use(cors()); // 啟用 CORS 支持
app.use(logger("dev")); // 使用 Morgan 記錄 HTTP 請求日誌
app.use(express.json()); // 解析 JSON 格式的請求體
app.use(express.urlencoded({ extended: false })); // 解析 URL 編碼的請求體
app.use(cookieParser()); // 解析 Cookie
app.use(express.static(path.join(__dirname, "public"))); // 設置靜態文件目錄

// 設置路由
app.use("/", indexRouter); // 根路由

// 捕獲 404 並轉發到錯誤處理器
app.use(function (req, res, next) {
  next(createError(404));
});

// 錯誤處理器
app.use(function (err, req, res, next) {
  // 設置本地變量，只在開發環境中提供錯誤信息
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // 渲染錯誤頁面
  res.status(err.status || 500);
  res.render("error");
});

// 設置服務器端口
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // 導出 app 以便其他模組使用
