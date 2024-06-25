'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Addresses', [
      {
        userId: 1,
        address: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        address: '456 Oak St',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Addresses', null, {});
  }
};
