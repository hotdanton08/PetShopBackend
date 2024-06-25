'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('PaymentMethods', [
      {
        userId: 1,
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
        userId: 2,
        type: 'cash_on_delivery',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PaymentMethods', null, {});
  }
};
