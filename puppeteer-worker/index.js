const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/Main_Page');

  const title = await page.evaluate(() => document.title);
  console.log(`Page title: ${title}`);

  // Example: Extracting a specific section of the page
  const featuredArticle = await page.evaluate(() => {
    const featured = document.querySelector('#mp-tfa');
    return featured ? featured.innerText : null;
  });

  console.log('Featured Article:', featuredArticle);

  await browser.close();
})();