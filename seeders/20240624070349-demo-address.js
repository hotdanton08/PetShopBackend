// seeders/20240624070349-demo-address.js
'use strict';

// 定義要插入的地址數據
const addresses = [
  {
    userEmail: 'johndoe@example.com', // 使用 email 來查找 userId
    address: '123 Main St',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userEmail: 'janedoe@example.com', // 使用 email 來查找 userId
    address: '456 Oak St',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userMap = {};

    // 查找所有使用者的 ID
    for (const address of addresses) {
      if (!userMap[address.userEmail]) {
        const userId = await queryInterface.rawSelect('Users', {
          where: { email: address.userEmail },
        }, ['id']);
        userMap[address.userEmail] = userId;
      }

      // 構建包含 userId 的地址數據
      const addressData = {
        userId: userMap[address.userEmail],
        address: address.address,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt
      };

      // 檢查資料庫中是否已經存在這個地址
      const existingAddress = await queryInterface.rawSelect('Addresses', {
        where: { userId: addressData.userId, address: addressData.address },
      }, ['id']);

      if (!existingAddress) {
        // 如果地址不存在，插入新數據
        await queryInterface.bulkInsert('Addresses', [addressData], {});
      } else {
        // 如果地址已經存在，更新數據
        await queryInterface.bulkUpdate('Addresses', addressData, { id: existingAddress });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 刪除這些地址數據
    const userEmails = addresses.map(address => address.userEmail);
    const userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email IN (${userEmails.map(email => `'${email}'`).join(',')})`
    );

    await queryInterface.bulkDelete('Addresses', {
      userId: {
        [Sequelize.Op.in]: userIds[0].map(user => user.id)
      }
    }, {});
  }
};
