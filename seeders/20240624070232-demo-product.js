'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Product A',
        description: 'Description for Product A',
        price: 100.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Product B',
        description: 'Description for Product B',
        price: 200.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
