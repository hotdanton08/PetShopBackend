'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('FAQs', [
      {
        question: 'What is this service?',
        answer: 'This service provides...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: 'How to use it?',
        answer: 'To use this service...',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('FAQs', null, {});
  }
};
