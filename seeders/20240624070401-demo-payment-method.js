// seeders/20240624070401-demo-payment-method.js
'use strict';

// 定義要插入的支付方式數據
const paymentMethods = [
  {
    userEmail: 'johndoe@example.com', // 使用 email 來查找 userId
    type: 'credit_card',
    cardNumber: '4111111111111111',
    cardExpiry: '1225',
    cardCVV: '123',
    cardHolderName: 'John Doe',
    billingAddress: '123 Main St',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userEmail: 'janedoe@example.com', // 使用 email 來查找 userId
    type: 'cash_on_delivery',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userMap = {};

    // 查找所有使用者的 ID
    for (const paymentMethod of paymentMethods) {
      if (!userMap[paymentMethod.userEmail]) {
        const userId = await queryInterface.rawSelect('Users', {
          where: { email: paymentMethod.userEmail },
        }, ['id']);
        userMap[paymentMethod.userEmail] = userId;
      }

      // 構建包含 userId 的支付方式數據
      const paymentMethodData = {
        userId: userMap[paymentMethod.userEmail],
        type: paymentMethod.type,
        cardNumber: paymentMethod.cardNumber,
        cardExpiry: paymentMethod.cardExpiry,
        cardCVV: paymentMethod.cardCVV,
        cardHolderName: paymentMethod.cardHolderName,
        billingAddress: paymentMethod.billingAddress,
        createdAt: paymentMethod.createdAt,
        updatedAt: paymentMethod.updatedAt
      };

      // 檢查資料庫中是否已經存在這個支付方式
      const existingPaymentMethod = await queryInterface.rawSelect('PaymentMethods', {
        where: { userId: paymentMethodData.userId, type: paymentMethodData.type },
      }, ['id']);

      if (!existingPaymentMethod) {
        // 如果支付方式不存在，插入新數據
        await queryInterface.bulkInsert('PaymentMethods', [paymentMethodData], {});
      } else {
        // 如果支付方式已經存在，更新數據
        await queryInterface.bulkUpdate('PaymentMethods', paymentMethodData, { id: existingPaymentMethod });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 刪除這些支付方式數據
    const userEmails = paymentMethods.map(payment => payment.userEmail);
    const userIds = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email IN (${userEmails.map(email => `'${email}'`).join(',')})`
    );

    await queryInterface.bulkDelete('PaymentMethods', {
      userId: {
        [Sequelize.Op.in]: userIds[0].map(user => user.id)
      }
    }, {});
  }
};
