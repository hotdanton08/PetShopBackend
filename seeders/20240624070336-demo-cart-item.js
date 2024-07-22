// seeders/20240624070336-demo-cart-item.js
"use strict";

// 定義要插入的購物車項目數據
const cartItems = [
  {
    cartUserEmail: "johndoe@example.com", // 使用 email 來查找 userId
    productName: "犬用超級營養糧-成犬配方 5kg", // 使用名稱來查找 productId
    quantity: 2,
    price: 100.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    cartUserEmail: "janedoe@example.com", // 使用 email 來查找 userId
    productName: "貓咪護理潔耳液 120ml 專業版", // 使用名稱來查找 productId
    quantity: 1,
    price: 150.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userMap = {};
    const productMap = {};
    const cartMap = {};

    // 查找所有使用者和產品的 ID
    for (const cartItem of cartItems) {
      if (!userMap[cartItem.cartUserEmail]) {
        const userId = await queryInterface.rawSelect(
          "Users",
          {
            where: { email: cartItem.cartUserEmail },
          },
          ["id"]
        );
        userMap[cartItem.cartUserEmail] = userId;
      }

      if (!productMap[cartItem.productName]) {
        const productId = await queryInterface.rawSelect(
          "Products",
          {
            where: { name: cartItem.productName },
          },
          ["id"]
        );
        productMap[cartItem.productName] = productId;
      }
    }

    // 查找購物車的 ID
    for (const email in userMap) {
      const userId = userMap[email];
      const cartId = await queryInterface.rawSelect(
        "Carts",
        {
          where: { userId: userId },
        },
        ["id"]
      );
      cartMap[email] = cartId;
    }

    for (const cartItem of cartItems) {
      // 構建包含 cartId 和 productId 的購物車項目數據
      const cartItemData = {
        cartId: cartMap[cartItem.cartUserEmail],
        productId: productMap[cartItem.productName],
        quantity: cartItem.quantity,
        price: cartItem.price,
        createdAt: cartItem.createdAt,
        updatedAt: cartItem.updatedAt,
      };

      // 檢查資料庫中是否已經存在這個購物車項目
      const existingCartItem = await queryInterface.rawSelect(
        "CartItems",
        {
          where: {
            cartId: cartItemData.cartId,
            productId: cartItemData.productId,
          },
        },
        ["id"]
      );

      if (!existingCartItem) {
        // 如果購物車項目不存在，插入新數據
        await queryInterface.bulkInsert("CartItems", [cartItemData], {});
      } else {
        // 如果購物車項目已經存在，更新數據
        await queryInterface.bulkUpdate("CartItems", cartItemData, {
          id: existingCartItem,
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 刪除這些購物車項目數據
    const cartUserEmails = cartItems.map((item) => item.cartUserEmail);
    const productNames = cartItems.map((item) => item.productName);

    const userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email IN (${cartUserEmails.map((email) => `'${email}'`).join(",")})`
    );

    const productIds = await queryInterface.sequelize.query(
      `SELECT id FROM Products WHERE name IN (${productNames.map((name) => `'${name}'`).join(",")})`
    );

    const cartIds = await queryInterface.sequelize.query(
      `SELECT id FROM Carts WHERE userId IN (${userIds[0].map((user) => user.id).join(",")})`
    );

    await queryInterface.bulkDelete(
      "CartItems",
      {
        cartId: {
          [Sequelize.Op.in]: cartIds[0].map((cart) => cart.id),
        },
        productId: {
          [Sequelize.Op.in]: productIds[0].map((product) => product.id),
        },
      },
      {}
    );
  },
};
