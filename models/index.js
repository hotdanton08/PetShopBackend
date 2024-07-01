// models/index.js

'use strict';

// 引入所需模組
const fs = require('fs'); // 用於文件系統操作的模組
const path = require('path'); // 處理和轉換文件路徑的模組
const Sequelize = require('sequelize'); // Sequelize ORM
const process = require('process'); // 用於進程相關操作的模組
const basename = path.basename(__filename); // 獲取當前文件的文件名
const env = process.env.NODE_ENV || 'development'; // 獲取運行環境，如果未設置則默認為 'development'
const config = require(__dirname + '/../config/config.js')[env]; // 加載配置文件
const db = {}; // 創建一個空對象來存放所有模型

let sequelize;
// 根據配置文件中的設置創建 Sequelize 實例
if (config.use_env_variable) {
  // 如果配置文件中設置了使用環境變量來存儲數據庫連接字符串，則使用環境變量來創建 Sequelize 實例
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // 否則，使用配置文件中的數據庫信息來創建 Sequelize 實例
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 讀取當前目錄下的所有文件，並過濾出模型文件
fs
  .readdirSync(__dirname) // 讀取當前目錄下的所有文件
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // 排除隱藏文件
      file !== basename && // 排除當前文件
      file.slice(-3) === '.js' && // 僅包含 .js 文件
      file.indexOf('.test.js') === -1 // 排除測試文件
    );
  })
  .forEach(file => {
    // 對於每個模型文件，將其引入並初始化
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model; // 將模型添加到 db 對象中
  });

// 如果模型具有關聯方法，則調用關聯方法來設置模型之間的關聯
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 將 Sequelize 實例和 Sequelize 類添加到 db 對象中，以便在其他地方使用
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; // 導出 db 對象
