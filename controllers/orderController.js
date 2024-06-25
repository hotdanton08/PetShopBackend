const { Order, OrderItem } = require('../models'); // 引入Order和OrderItem模型

// 獲取所有訂單，支援分頁、篩選和排序
exports.getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 獲取當前頁數，預設為1
  const limit = parseInt(req.query.limit) || 10; // 獲取每頁顯示的記錄數，預設為10
  const offset = (page - 1) * limit; // 計算偏移量

  const { userId, status, sortBy, sortOrder } = req.query; // 獲取篩選和排序參數
  const where = {}; // 初始化篩選條件
  const order = []; // 初始化排序條件

  // 篩選條件
  if (userId) {
    where.userId = userId;
  }

  if (status) {
    where.status = status;
  }

  // 排序條件
  if (sortBy && sortOrder) {
    order.push([sortBy, sortOrder]);
  }

  try {
    // 查詢並計數
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: ['orderItems'], // 包含訂單項目
      offset,
      limit,
      order
    });
    res.json({
      total: count, // 總記錄數
      pages: Math.ceil(count / limit), // 總頁數
      currentPage: page, // 當前頁數
      data: rows // 返回的訂單數據
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 根據ID獲取單個訂單
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: ['orderItems'] }); // 根據主鍵查詢訂單，並包含訂單項目
    if (order) {
      res.json(order); // 返回訂單數據
    } else {
      res.status(404).json({ error: 'Order not found' }); // 訂單不存在
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 創建新訂單
exports.createOrder = async (req, res) => {
  try {
    const { userId, total, status, orderItems } = req.body; // 獲取請求體中的數據
    const order = await Order.create({ userId, total, status }); // 創建新訂單
    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        // 創建訂單項目
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }
    }
    const newOrder = await Order.findByPk(order.id, { include: ['orderItems'] }); // 查詢並返回新訂單
    res.status(201).json(newOrder); // 返回創建的訂單數據
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 更新訂單數據
exports.updateOrder = async (req, res) => {
  try {
    const { userId, total, status } = req.body; // 獲取請求體中的數據
    const order = await Order.findByPk(req.params.id); // 根據主鍵查詢訂單
    if (order) {
      // 更新訂單數據
      order.userId = userId;
      order.total = total;
      order.status = status;
      await order.save(); // 保存更改
      res.json(order); // 返回更新後的訂單數據
    } else {
      res.status(404).json({ error: 'Order not found' }); // 訂單不存在
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 刪除訂單
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id); // 根據主鍵查詢訂單
    if (order) {
      await order.destroy(); // 刪除訂單
      res.json({ message: 'Order deleted' }); // 返回成功消息
    } else {
      res.status(404).json({ error: 'Order not found' }); // 訂單不存在
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};
