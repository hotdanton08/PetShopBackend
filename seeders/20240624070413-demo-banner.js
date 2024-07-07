// seeders/20240624070413-demo-banner.js
'use strict';

// 定義要插入的橫幅數據
const banners = [
  {
    imageUrl: 'https://example.com/banner1.jpg',
    linkUrl: 'https://example.com/product1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    imageUrl: 'https://example.com/banner2.jpg',
    linkUrl: 'https://example.com/product2',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (const banner of banners) {
      // 檢查資料庫中是否已經存在這個橫幅
      const existingBanner = await queryInterface.rawSelect('Banners', {
        where: { imageUrl: banner.imageUrl },
      }, ['id']);

      if (!existingBanner) {
        // 如果橫幅不存在，插入新數據
        await queryInterface.bulkInsert('Banners', [banner], {});
      } else {
        // 如果橫幅已經存在，更新數據
        await queryInterface.bulkUpdate('Banners', banner, { imageUrl: banner.imageUrl });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 刪除這些橫幅數據
    const imageUrls = banners.map(banner => banner.imageUrl);
    await queryInterface.bulkDelete('Banners', {
      imageUrl: {
        [Sequelize.Op.in]: imageUrls
      }
    }, {});
  }
};
