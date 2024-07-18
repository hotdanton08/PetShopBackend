// seeders/20240624070232-demo-product.js
"use strict";

// 定義要插入的產品數據
const products = [
  {
    name: "犬用超級營養糧-成犬配方 5kg",
    image: "assets/images/product_a.jpg",
    price: 100,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "貓咪護理潔耳液 120ml 專業版",
    image: "assets/images/product_b.jpg",
    price: 200,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (const product of products) {
      // 檢查資料庫中是否已經存在這個產品
      const existingProduct = await queryInterface.rawSelect(
        "Products",
        {
          where: { name: product.name },
        },
        ["id"]
      );

      if (!existingProduct) {
        // 如果產品不存在，插入新數據
        await queryInterface.bulkInsert("Products", [product], {});
      } else {
        // 如果產品已經存在，更新數據
        await queryInterface.bulkUpdate("Products", product, {
          name: product.name,
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 刪除這些產品數據
    const names = products.map((product) => product.name);
    await queryInterface.bulkDelete(
      "Products",
      {
        name: {
          [Sequelize.Op.in]: names,
        },
      },
      {}
    );
  },
};
