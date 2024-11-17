const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  async up(db, client) {
    const collectionName = "productDetails";

    // 檢查集合是否存在
    const collections = await db
      .listCollections({ name: collectionName })
      .toArray();

    if (collections.length === 0) {
      // 如果集合不存在，創建集合並設置驗證
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
                description: "must be a number",
              },
              name: { bsonType: "string", description: "must be a string" },
              images: {
                bsonType: "array",
                items: { bsonType: "string", description: "must be URLs" },
              },
              price: { bsonType: "number", description: "must be a number" },
              sold: { bsonType: "number", description: "must be a number" },
              description: {
                bsonType: "string",
                description: "must be a string",
              },
              options: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["name", "stock"],
                  properties: {
                    name: { bsonType: "string" },
                    stock: { bsonType: "number" },
                  },
                },
              },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
            },
          },
        },
      });
      console.log(`Collection '${collectionName}' 已創建並設置驗證`);
    } else {
      console.log(`Collection '${collectionName}' 已存在`);
    }
  },

  async down(db, client) {
    const collectionName = "productDetails";

    // 刪除集合（如果存在）
    const collections = await db
      .listCollections({ name: collectionName })
      .toArray();

    if (collections.length > 0) {
      await db.collection(collectionName).drop();
      console.log(`Collection '${collectionName}' 已刪除`);
    } else {
      console.log(`Collection '${collectionName}' 不存在，無需刪除`);
    }
  },
};
