const { Banner } = require("../models");

// 獲取所有 Banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
