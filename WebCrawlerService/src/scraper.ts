// src/scraper.ts
import puppeteer from 'puppeteer';

async function runPuppeteer(url: string) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Keep these args
    });
    const page = await browser.newPage();
    await page.goto(url);

    const title = await page.evaluate(() => document.title);
    console.log(`Puppeteer: Page title for ${url}: ${title}`);

    // Example: Extracting a specific section of the page (adjust selector as needed)
    const featuredArticle = await page.evaluate(() => {
      const featured = document.querySelector('#mp-tfa');
      return featured ? featured.textContent : null;
    });

    console.log(`Puppeteer: Featured Article for ${url}:`, featuredArticle);

    await browser.close();

    return { url, title, featuredArticle }; // Return the extracted data with the URL

  } catch (error) {
    console.error(`Puppeteer Error for ${url}:`, error);
    return { url, error: `Failed to scrape data from ${url}` };
  }
}

export { runPuppeteer };
