// migrations/20240623152903-create-user.js

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING(20),
      },
      password: {
        type: Sequelize.STRING(60), // bcrypt 哈希密碼的輸出長度固定為 60 個字符
      },
      email: {
        type: Sequelize.STRING(50),
      },
      role: {
        type: Sequelize.STRING(20),
        defaultValue: "guest",
      },
      gender: {
        type: Sequelize.ENUM("男", "女", "其他"), // 使用 ENUM 類型
        allowNull: false,
      },
      birthday: {
        type: Sequelize.DATE,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
