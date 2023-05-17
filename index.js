const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  const pageTitle = await page.title();
  console.log(pageTitle);
  await browser.close();
})();