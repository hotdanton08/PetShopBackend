// 引入所需模組
var createError = require('http-errors'); // 用於創建錯誤對象的模組
var express = require('express'); // Express 框架
var path = require('path'); // 處理和轉換文件路徑的模組
var cookieParser = require('cookie-parser'); // 解析 Cookie 的中間件
var logger = require('morgan'); // HTTP 請求日誌中間件
var cors = require('cors'); // 處理跨域資源共享 (CORS) 的中間件

// 引入路由文件
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders'); // 新增訂單路由
var cartsRouter = require('./routes/carts'); // 新增購物車路由

var app = express(); // 創建一個 Express 應用程序

// 設置視圖引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // 使用 Jade 模板引擎

app.use(cors()); // 啟用 CORS 支持
app.use(logger('dev')); // 使用 Morgan 記錄 HTTP 請求日誌
app.use(express.json()); // 解析 JSON 格式的請求體
app.use(express.urlencoded({ extended: false })); // 解析 URL 編碼的請求體
app.use(cookieParser()); // 解析 Cookie
app.use(express.static(path.join(__dirname, 'public'))); // 設置靜態文件目錄

// 設置路由
app.use('/', indexRouter); // 根路由
app.use('/users', usersRouter); // 用戶路由
app.use('/products', productsRouter); // 產品路由
app.use('/orders', ordersRouter); // 訂單路由
app.use('/carts', cartsRouter); // 購物車路由

// 捕獲 404 並轉發到錯誤處理器
app.use(function(req, res, next) {
  next(createError(404));
});

// 錯誤處理器
app.use(function(err, req, res, next) {
  // 設置本地變量，只在開發環境中提供錯誤信息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染錯誤頁面
  res.status(err.status || 500);
  res.render('error');
});

// 設置服務器端口
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // 導出 app 以便其他模組使用
