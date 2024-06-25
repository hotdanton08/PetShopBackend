'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Banners', [
      {
        imageUrl: 'https://example.com/banner1.jpg',
        linkUrl: 'https://example.com/product1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        imageUrl: 'https://example.com/banner2.jpg',
        linkUrl: 'https://example.com/product2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Banners', null, {});
  }
};
