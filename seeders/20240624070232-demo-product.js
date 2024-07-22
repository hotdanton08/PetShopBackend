// seeders/20240624070232-demo-product.js
const fs = require("fs"); // 用於文件操作
const path = require("path"); // 用於處理文件路徑
const crypto = require("crypto"); // 用於生成 hash 值

const imagesDir = path.join(__dirname, "../migrations/images"); // 原始圖片位置
const targetDir = path.join(__dirname, "../public/images"); // 能被公開存取圖片位置

// 定義要插入的產品數據
const products = [
  {
    name: "犬用超級營養糧-成犬配方 5kg",
    image: "product_01.jpg",
    price: 100,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "貓咪護理潔耳液 120ml 專業版",
    image: "product_02.jpg",
    price: 200,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "活力兔專用高纖維飼料 3kg",
    image: "product_03.jpg",
    price: 200,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "貓咪保健零食-海洋魚油配方 150g 滋補毛髮",
    image: "product_04.jpg",
    price: 100,
    sold: 80,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "高級皮革狗項圈 加厚防斷裂 45cm",
    image: "product_05.jpg",
    price: 100,
    sold: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "安全型寵物電子識別晶片",
    image: "product_06.jpg",
    price: 200,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "水族專用活性碳過濾器 200L 淨化水質",
    image: "product_07.jpg",
    price: 200,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "鳥類綜合礦物石 250g 提升羽毛亮度",
    image: "product_08.jpg",
    price: 200,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "無穀物全犬種洗毛精 500ml 植物香氛",
    image: "product_09.jpg",
    price: 200,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "CeraVe適樂膚 全效亮眼修護精萃 14ml 改善眼周困擾組 官方旗艦店",
    image: "product_10.jpg",
    price: 200,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "產品aa",
    image: "product_11.jpg",
    price: 200,
    sold: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 將文件名和時間戳拼接後生成一個 hash 值，並保留副檔名
function hashFileName(originalName) {
  const timestamp = Date.now();
  const hash = crypto
    .createHash("md5")
    .update(originalName + timestamp)
    .digest("hex");
  const ext = path.extname(originalName);
  return `${hash}${ext}`;
}

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
        // Hash 處理文件名
        const hashedFileName = hashFileName(product.image);
        const sourceImagePath = path.join(imagesDir, product.image);
        const targetImagePath = path.join(targetDir, hashedFileName);

        // 檢查源圖片文件是否存在
        if (fs.existsSync(sourceImagePath)) {
          // 複製圖片到 public/images
          fs.copyFileSync(sourceImagePath, targetImagePath);
          product.image = hashedFileName;
        } else {
          continue;
        }

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
    // 刪除所有產品數據
    await queryInterface.bulkDelete("Products", null, {});

    // 刪除 public/images 中的所有圖片
    fs.readdir(targetDir, (err, files) => {
      if (err) {
        console.error(`無法讀取目錄: ${err}`);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(targetDir, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`無法刪除文件: ${filePath}`);
          }
        });
      });
    });
  },
};
