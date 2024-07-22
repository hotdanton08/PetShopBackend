const { Cart, CartItem } = require("../models"); // 引入Cart和CartItem模型

// 獲取所有購物車，支援分頁、篩選和排序
exports.getAllCarts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 獲取當前頁數，預設為1
  const limit = parseInt(req.query.limit) || 10; // 獲取每頁顯示的記錄數，預設為10
  const offset = (page - 1) * limit; // 計算偏移量

  const { userId, sortBy, sortOrder } = req.query; // 獲取篩選和排序參數
  const where = {}; // 初始化篩選條件
  const order = []; // 初始化排序條件

  // 篩選條件
  if (userId) {
    where.userId = userId;
  }

  // 排序條件
  if (sortBy && sortOrder) {
    order.push([sortBy, sortOrder]);
  }

  try {
    // 查詢並計數
    const { count, rows } = await Cart.findAndCountAll({
      where,
      include: ["cartItems"], // 包含購物車項目
      offset,
      limit,
      order,
    });
    res.json({
      total: count, // 總記錄數
      pages: Math.ceil(count / limit), // 總頁數
      currentPage: page, // 當前頁數
      data: rows, // 返回的購物車數據
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 根據ID獲取單個購物車
exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id, { include: ["cartItems"] }); // 根據主鍵查詢購物車，並包含購物車項目
    if (cart) {
      res.json(cart); // 返回購物車數據
    } else {
      res.status(404).json({ error: "Cart not found" }); // 購物車不存在
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 創建新購物車
exports.createCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body; // 獲取請求體中的數據
    const cart = await Cart.create({ userId }); // 創建新購物車
    if (cartItems && cartItems.length > 0) {
      for (const item of cartItems) {
        // 創建購物車項目
        await CartItem.create({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      }
    }
    const newCart = await Cart.findByPk(cart.id, { include: ["cartItems"] }); // 查詢並返回新購物車
    res.status(201).json(newCart); // 返回創建的購物車數據
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 更新購物車數據
exports.updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body; // 獲取請求體中的數據
    const cart = await Cart.findByPk(req.params.id); // 根據主鍵查詢購物車
    if (cart) {
      // 更新購物車數據
      cart.userId = userId;
      await cart.save(); // 保存更改
      await CartItem.destroy({ where: { cartId: cart.id } }); // 刪除舊的購物車項目
      for (const item of cartItems) {
        // 創建新的購物車項目
        await CartItem.create({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      }
      const updatedCart = await Cart.findByPk(cart.id, {
        include: ["cartItems"],
      }); // 查詢並返回更新後的購物車
      res.json(updatedCart); // 返回更新後的購物車數據
    } else {
      res.status(404).json({ error: "Cart not found" }); // 購物車不存在
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};

// 刪除購物車
exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id); // 根據主鍵查詢購物車
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } }); // 刪除購物車項目
      await cart.destroy(); // 刪除購物車
      res.json({ message: "Cart deleted" }); // 返回成功消息
    } else {
      res.status(404).json({ error: "Cart not found" }); // 購物車不存在
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // 返回錯誤信息
  }
};
