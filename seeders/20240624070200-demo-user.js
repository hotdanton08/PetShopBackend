// seeders/20240624070200-demo-user.js
"use strict";

const bcrypt = require("bcrypt");
const saltRounds = 10;

// 數據已經包含所有需要的信息
const users = [
  {
    username: "JohnDoe",
    password: "password123",
    email: "johndoe@example.com",
    role: "admin",
    gender: "男",
    birthday: new Date(),
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: "JaneDoe",
    password: "password456",
    email: "janedoe@example.com",
    role: "user",
    gender: "女",
    birthday: new Date(),
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (const user of users) {
      // 加密密碼
      user.password = await bcrypt.hash(user.password, saltRounds);
      // 檢查用戶是否存在
      const existingUser = await queryInterface.rawSelect(
        "Users",
        {
          where: { email: user.email },
        },
        ["id"]
      );

      if (!existingUser) {
        // 用戶不存在，插入新數據
        await queryInterface.bulkInsert("Users", [user], {});
      } else {
        // 用戶存在，更新數據
        await queryInterface.bulkUpdate("Users", user, { email: user.email });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const emails = users.map((user) => user.email);
    await queryInterface.bulkDelete(
      "Users",
      {
        email: {
          [Sequelize.Op.in]: emails,
        },
      },
      {}
    );
  },
};
