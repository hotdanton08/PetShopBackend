const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoUri = process.env.MONGO_URL;
const mongoDbName = process.env.MONGO_DATABASE;
const seedersDir = path.resolve(__dirname); // 修正路徑，指向當前資料夾

async function runSeeders(action) {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(mongoDbName);

    // 讀取所有 Seeder 檔案
    const seeders = fs
      .readdirSync(seedersDir) // 讀取當前目錄的 Seeder 檔案
      .filter((file) => file.endsWith(".js"));

    for (const seeder of seeders) {
      const seederPath = path.join(seedersDir, seeder);
      const { up, down } = require(seederPath);

      if (action === "up" && typeof up === "function") {
        console.log(`Running Seeder: ${seeder}`);
        await up(db, client);
        console.log(`Seeder ${seeder} 插入成功`);
      } else if (action === "down" && typeof down === "function") {
        console.log(`Reverting Seeder: ${seeder}`);
        await down(db, client);
        console.log(`Seeder ${seeder} 刪除成功`);
      }
    }
  } catch (err) {
    console.error("Error running seeders:", err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

const action = process.argv[2];
if (!["up", "down"].includes(action)) {
  console.error("Usage: node run-seeders.js [up|down]");
  process.exit(1);
}

runSeeders(action);
