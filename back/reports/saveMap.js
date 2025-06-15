// saveMap.js
const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const filePath = path.resolve(__dirname, "temp_map.html");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${filePath}`);
  await page.setViewport({ width: 800, height: 600 });
  await page.screenshot({ path: "map.png" });
  await browser.close();
  console.log("✅ Скриншот карты сохранен как map.png");
})();
