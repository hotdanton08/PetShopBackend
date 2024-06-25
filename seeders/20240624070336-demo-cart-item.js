'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('CartItems', [
      {
        cartId: 1,
        productId: 1,
        quantity: 2,
        price: 100.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cartId: 2,
        productId: 2,
        quantity: 1,
        price: 150.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CartItems', null, {});
  }
};
