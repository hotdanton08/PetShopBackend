const { sequelize } = require('./models');
const { QueryTypes } = require('sequelize');

async function fetchProducts() {
  console.time("fetchProducts");
  const results = await sequelize.query("SELECT * FROM products", { type: QueryTypes.SELECT });
  console.log(JSON.stringify(results, null, 2));
  console.timeEnd("fetchProducts");
}

fetchProducts();
