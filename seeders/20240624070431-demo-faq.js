// seeders/20240624070431-demo-faq.js
"use strict";

// 定義要插入的常見問題數據
const faqs = [
  {
    question: "What is this service?",
    answer: "This service provides...",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    question: "How to use it?",
    answer: "To use this service...",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (const faq of faqs) {
      // 檢查資料庫中是否已經存在這個常見問題
      const existingFaq = await queryInterface.rawSelect(
        "FAQs",
        {
          where: { question: faq.question },
        },
        ["id"],
      );

      if (!existingFaq) {
        // 如果常見問題不存在，插入新數據
        await queryInterface.bulkInsert("FAQs", [faq], {});
      } else {
        // 如果常見問題已經存在，更新數據
        await queryInterface.bulkUpdate("FAQs", faq, {
          question: faq.question,
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 刪除這些常見問題數據
    const questions = faqs.map((faq) => faq.question);
    await queryInterface.bulkDelete(
      "FAQs",
      {
        question: {
          [Sequelize.Op.in]: questions,
        },
      },
      {},
    );
  },
};
