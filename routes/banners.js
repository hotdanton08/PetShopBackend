const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");

// 定義 Banner 路徑
router.get("/", bannerController.getAllBanners);

module.exports = router;
