// seeders/20240624070413-demo-banner.js
"use strict";

const fs = require("fs"); // 用於文件操作
const path = require("path"); // 用於處理文件路徑
const crypto = require("crypto"); // 用於生成 hash 值

const imagesDir = path.join(__dirname, "../migrations/images"); // 原始圖片位置
const targetDir = path.join(__dirname, "../public/images"); // 能被公開存取圖片位置

// 定義要插入的橫幅數據
const banners = [
  {
    imageUrl: "banner_01.jpg",
    linkUrl: "https://fakeimg.pl/",
    title: "給你家寶貝最好的營養",
    subtitle: "精選犬貓專用優質飼料，健康成長看得見",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    imageUrl: "banner_02.jpg",
    linkUrl: "https://color.adobe.com/zh/create/color-wheel",
    title: "寵物時尚新風潮",
    subtitle: "潮流寵物配件，讓你的寶貝與眾不同",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    imageUrl: "banner_03.jpg",
    linkUrl: "https://angular.tw/",
    title: "溫柔呵護，健康守護",
    subtitle: "專業寵物保健品，讓你的寶貝遠離疾病",
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
    for (const banner of banners) {
      // 檢查資料庫中是否已經存在這個橫幅
      const existingBanner = await queryInterface.rawSelect(
        "Banners",
        {
          where: { imageUrl: banner.imageUrl },
        },
        ["id"]
      );

      if (!existingBanner) {
        // Hash 處理文件名
        const hashedFileName = hashFileName(banner.imageUrl);
        const sourceImagePath = path.join(imagesDir, banner.imageUrl);
        const targetImagePath = path.join(targetDir, hashedFileName);

        // 檢查源圖片文件是否存在
        if (fs.existsSync(sourceImagePath)) {
          // 複製圖片到 public/images
          fs.copyFileSync(sourceImagePath, targetImagePath);
          banner.imageUrl =
            process.env.URL_BACKEND + "/images/" + hashedFileName;
        } else {
          continue;
        }

        // 如果橫幅不存在，插入新數據
        await queryInterface.bulkInsert("Banners", [banner], {});
      } else {
        // 如果橫幅已經存在，更新數據
        await queryInterface.bulkUpdate("Banners", banner, {
          imageUrl: banner.imageUrl,
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 從SQL讀取這些橫幅數據
    const imageUrls = banners.map((banner) => banner.imageUrl);
    const bannersToDelete = await queryInterface.select(null, "Banners", {
      where: {
        imageUrl: {
          [Sequelize.Op.in]: imageUrls,
        },
      },
    });

    // 刪除橫幅數據
    await queryInterface.bulkDelete(
      "Banners",
      {
        imageUrl: {
          [Sequelize.Op.in]: imageUrls,
        },
      },
      {}
    );

    // 刪除 public/images 中的圖片
    for (const banner of bannersToDelete) {
      const targetImagePath = path.join(targetDir, banner.imageUrl);
      if (fs.existsSync(targetImagePath)) {
        fs.unlinkSync(targetImagePath);
      }
    }
  },
};
