'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Orders', [
      {
        userId: 1,
        total: 300.00,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        total: 150.00,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
