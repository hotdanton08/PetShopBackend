require("dotenv").config({ path: "../.env" });

module.exports = {
  async up(db, client) {
    const collectionName = "productDetails";

    // 檢查集合是否存在
    const collections = await db
      .listCollections({ name: collectionName })
      .toArray();

    if (collections.length === 0) {
      // 集合不存在，創建集合並設置驗證
      await db.createCollection(collectionName, {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: [
              "name",
              "images",
              "price",
              "sold",
              "description",
              "options",
              "productId",
            ],
            properties: {
              productId: {
                bsonType: "number",
                description: "must be a number and is required",
              },
              name: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              images: {
                bsonType: "array",
                items: {
                  bsonType: "string",
                  description: "must be an array of string URLs",
                },
                description: "must be an array and is required",
              },
              price: {
                bsonType: "number",
                description: "must be a number and is required",
              },
              sold: {
                bsonType: "number",
                description: "must be a number and is required",
              },
              description: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              options: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["name", "stock"],
                  properties: {
                    name: {
                      bsonType: "string",
                      description: "must be a string and is required",
                    },
                    stock: {
                      bsonType: "number",
                      description: "must be a number and is required",
                    },
                  },
                },
                description: "must be an array of objects and is required",
              },
              createdAt: {
                bsonType: "date",
                description: "must be a date and is required",
              },
              updatedAt: {
                bsonType: "date",
                description: "must be a date and is required",
              },
            },
          },
        },
      });
      console.log(`Collection '${collectionName}' 已創建並設置驗證`);
    } else {
      console.log(`Collection '${collectionName}' 已存在`);
    }

    // 連接 MySQL
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // 查詢 MySQL 中的 `products` 表
    const [products] = await connection.execute("SELECT * FROM Products");

    for (const product of products) {
      const existingProduct = await db
        .collection(collectionName)
        .findOne({ productId: product.id });

      if (existingProduct) {
        console.log(
          `Product with productId ${product.id} already exists, skipping.`
        );
        continue; // 如果資料已存在，跳過
      }

      // 新建資料
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

    console.log("資料處理完成");
  },

  async down(db, client) {
    const collectionName = "productDetails";
    const collections = await db
      .listCollections({ name: collectionName })
      .toArray();

    if (collections.length === 0) {
      console.log(`Collection '${collectionName}' 不存在，無需清理`);
      return;
    }

    // 刪除所有資料
    const deleteResult = await db.collection(collectionName).deleteMany({});
    console.log(
      `成功刪除 '${collectionName}' 集合中 ${deleteResult.deletedCount} 筆資料`
    );

    // 如果集合已空，刪除集合
    const remainingDocs = await db.collection(collectionName).countDocuments();
    if (remainingDocs === 0) {
      await db.collection(collectionName).drop();
      console.log(`Collection '${collectionName}' 已空，成功刪除`);
    } else {
      console.log(
        `Collection '${collectionName}' 還有 ${remainingDocs} 筆資料，未刪除集合`
      );
    }
  },
};
