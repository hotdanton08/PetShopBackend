// seeders/20240624070307-demo-order-item.js
"use strict";

// 定義要插入的訂單項目數據
const orderItems = [
  {
    orderUserEmail: "johndoe@example.com", // 使用 email 來查找 userId
    productName: "Product A", // 使用名稱來查找 productId
    quantity: 2,
    price: 100.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    orderUserEmail: "janedoe@example.com", // 使用 email 來查找 userId
    productName: "Product B", // 使用名稱來查找 productId
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
    const orderMap = {};

    // 查找所有使用者和產品的 ID
    for (const orderItem of orderItems) {
      if (!userMap[orderItem.orderUserEmail]) {
        const userId = await queryInterface.rawSelect(
          "Users",
          {
            where: { email: orderItem.orderUserEmail },
          },
          ["id"],
        );
        userMap[orderItem.orderUserEmail] = userId;
      }

      if (!productMap[orderItem.productName]) {
        const productId = await queryInterface.rawSelect(
          "Products",
          {
            where: { name: orderItem.productName },
          },
          ["id"],
        );
        productMap[orderItem.productName] = productId;
      }
    }

    // 查找訂單的 ID
    for (const email in userMap) {
      const userId = userMap[email];
      const orderId = await queryInterface.rawSelect(
        "Orders",
        {
          where: { userId: userId },
        },
        ["id"],
      );
      orderMap[email] = orderId;
    }

    for (const orderItem of orderItems) {
      // 構建包含 orderId 和 productId 的訂單項目數據
      const orderItemData = {
        orderId: orderMap[orderItem.orderUserEmail],
        productId: productMap[orderItem.productName],
        quantity: orderItem.quantity,
        price: orderItem.price,
        createdAt: orderItem.createdAt,
        updatedAt: orderItem.updatedAt,
      };

      // 檢查資料庫中是否已經存在這個訂單項目
      const existingOrderItem = await queryInterface.rawSelect(
        "OrderItems",
        {
          where: {
            orderId: orderItemData.orderId,
            productId: orderItemData.productId,
          },
        },
        ["id"],
      );

      if (!existingOrderItem) {
        // 如果訂單項目不存在，插入新數據
        await queryInterface.bulkInsert("OrderItems", [orderItemData], {});
      } else {
        // 如果訂單項目已經存在，更新數據
        await queryInterface.bulkUpdate("OrderItems", orderItemData, {
          id: existingOrderItem,
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 刪除這些訂單項目數據
    const orderUserEmails = orderItems.map((item) => item.orderUserEmail);
    const productNames = orderItems.map((item) => item.productName);

    const userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email IN (${orderUserEmails.map((email) => `'${email}'`).join(",")})`,
    );

    const productIds = await queryInterface.sequelize.query(
      `SELECT id FROM Products WHERE name IN (${productNames.map((name) => `'${name}'`).join(",")})`,
    );

    const orderIds = await queryInterface.sequelize.query(
      `SELECT id FROM Orders WHERE userId IN (${userIds[0].map((user) => user.id).join(",")})`,
    );

    await queryInterface.bulkDelete(
      "OrderItems",
      {
        orderId: {
          [Sequelize.Op.in]: orderIds[0].map((order) => order.id),
        },
        productId: {
          [Sequelize.Op.in]: productIds[0].map((product) => product.id),
        },
      },
      {},
    );
  },
};
