// seeders/20240624070322-demo-cart.js
'use strict';

// 定義要插入的購物車數據
const carts = [
  {
    userEmail: 'johndoe@example.com', // 使用 email 來查找 userId
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userEmail: 'janedoe@example.com', // 使用 email 來查找 userId
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userMap = {};

    // 查找所有使用者的 ID
    for (const cart of carts) {
      if (!userMap[cart.userEmail]) {
        const userId = await queryInterface.rawSelect('Users', {
          where: { email: cart.userEmail },
        }, ['id']);
        userMap[cart.userEmail] = userId;
      }

      // 構建包含 userId 的購物車數據
      const cartData = {
        userId: userMap[cart.userEmail],
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      };

      // 檢查資料庫中是否已經存在這個購物車
      const existingCart = await queryInterface.rawSelect('Carts', {
        where: { userId: cartData.userId },
      }, ['id']);

      if (!existingCart) {
        // 如果購物車不存在，插入新數據
        await queryInterface.bulkInsert('Carts', [cartData], {});
      } else {
        // 如果購物車已經存在，更新數據
        await queryInterface.bulkUpdate('Carts', cartData, { id: existingCart });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 刪除這些購物車數據
    const userEmails = carts.map(cart => cart.userEmail);
    const userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email IN (${userEmails.map(email => `'${email}'`).join(',')})`
    );

    await queryInterface.bulkDelete('Carts', {
      userId: {
        [Sequelize.Op.in]: userIds[0].map(user => user.id)
      }
    }, {});
  }
};
