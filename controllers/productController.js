const { Product } = require("../models"); // 引入Product模型

// 獲取所有產品，支援分頁、篩選和排序
exports.getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 獲取當前頁數，預設為1
  const limit = parseInt(req.query.limit) || 10; // 獲取每頁顯示的記錄數，預設為10
  const offset = (page - 1) * limit; // 計算偏移量

  const { name, sortBy, sortOrder } = req.query; // 獲取篩選和排序參數
  const where = {}; // 初始化篩選條件
  const order = []; // 初始化排序條件

  // 篩選條件
  if (name) {
    where.name = name;
  }

  // 排序條件
  if (sortBy && sortOrder) {
    order.push([sortBy, sortOrder]);
  }

  try {
    // 查詢並計數
    const { count, rows } = await Product.findAndCountAll({
      attributes: ["id", "name", "description", "price"], // 指定返回的欄位
      where,
      offset,
      limit,
      order,
    });
    res.json({
      total: count, // 總記錄數
      pages: Math.ceil(count / limit), // 總頁數
      currentPage: page, // 當前頁數
      data: rows, // 返回的產品數據
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 根據ID獲取單個產品
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id); // 根據主鍵查詢產品
    if (product) {
      res.json(product); // 返回產品數據
    } else {
      res.status(404).json({ error: "Product not found" }); // 產品不存在
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 創建新產品
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body; // 獲取請求體中的數據
    const product = await Product.create({ name, description, price }); // 創建新產品
    res.status(201).json(product); // 返回創建的產品數據
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 更新產品數據
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body; // 獲取請求體中的數據
    const product = await Product.findByPk(req.params.id); // 根據主鍵查詢產品
    if (product) {
      // 更新產品數據
      product.name = name;
      product.description = description;
      product.price = price;
      await product.save(); // 保存更改
      res.json(product); // 返回更新後的產品數據
    } else {
      res.status(404).json({ error: "Product not found" }); // 產品不存在
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 刪除產品
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id); // 根據主鍵查詢產品
    if (product) {
      await product.destroy(); // 刪除產品
      res.json({ message: "Product deleted" }); // 返回成功消息
    } else {
      res.status(404).json({ error: "Product not found" }); // 產品不存在
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};
