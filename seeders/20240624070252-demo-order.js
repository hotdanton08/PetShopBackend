// seeders/20240624070252-demo-order.js
'use strict';

// 數據看起來已經包含所有信息，但缺少 userId
const orders = [
  {
    email: 'johndoe@example.com', // 使用 email 來查找 userId
    total: 300.00,
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'janedoe@example.com', // 使用 email 來查找 userId
    total: 150.00,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先查找 userId
    const userMap = {};
    for (const order of orders) {
      const userId = await queryInterface.rawSelect('Users', {
        where: { email: order.email },
      }, ['id']);
      userMap[order.email] = userId;
    }

    // 構建包含 userId 的訂單數據並插入或更新
    for (const order of orders) {
      const orderData = {
        userId: userMap[order.email],
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };

      // 檢查訂單是否存在
      const existingOrder = await queryInterface.rawSelect('Orders', {
        where: { userId: orderData.userId, total: orderData.total, status: orderData.status },
      }, ['id']);

      if (!existingOrder) {
        // 訂單不存在，插入新數據
        await queryInterface.bulkInsert('Orders', [orderData], {});
      } else {
        // 訂單已存在，更新數據
        await queryInterface.bulkUpdate('Orders', orderData, { id: existingOrder });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const emails = orders.map(order => order.email);
    const userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email IN (${emails.map(email => `'${email}'`).join(',')})`
    );
    await queryInterface.bulkDelete('Orders', {
      userId: {
        [Sequelize.Op.in]: userIds[0].map(user => user.id)
      }
    }, {});
  }
};
