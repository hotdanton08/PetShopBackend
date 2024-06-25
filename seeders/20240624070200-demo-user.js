'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'JohnDoe',
        password: 'password123',
        email: 'johndoe@example.com',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'JaneDoe',
        password: 'password456',
        email: 'janedoe@example.com',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
