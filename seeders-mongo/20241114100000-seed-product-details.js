const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mysql = require("mysql2/promise");

module.exports = {
  async up(db, client) {
    const collectionName = "productDetails";

    // 連接 MySQL 並獲取產品數據
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    const [products] = await connection.execute("SELECT * FROM Products");

    // 插入資料
    for (const product of products) {
      const existingProduct = await db
        .collection(collectionName)
        .findOne({ productId: product.id });

      if (existingProduct) {
        console.log(
          `Product with productId ${product.id} already exists, skipping.`
        );
        continue;
      }

      const newProduct = {
        name: product.name,
        images: [product.image],
        price: product.price,
        sold: product.sold,
        description: "This is a generated product description.",
        options: [
          { name: "Default Option 1", stock: 100 },
          { name: "Default Option 2", stock: 50 },
        ],
        productId: product.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection(collectionName).insertOne(newProduct);
      console.log(`Inserted product with productId ${product.id}`);
    }
  },

  async down(db, client) {
    const collectionName = "productDetails";

    // 刪除 Seeder 插入的數據
    const deleteResult = await db.collection(collectionName).deleteMany({});
    console.log(
      `成功刪除 '${collectionName}' 集合中 ${deleteResult.deletedCount} 筆資料`
    );
  },
};
