// src/scraper.ts
import puppeteer from 'puppeteer';
import { PostToIngestionApi, Job } from "./utils/DataIngestionApi";

async function runPuppeteer() {
  const url = "https://www.linkedin.com/jobs/search?keywords=Dotnet%2BDeveloper&location=United%2BKingdom&geoId=101165590&f_TPR=r86400&position=1&pageNum=0";
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: null,
      slowMo: 100
    });
    const page = await browser.newPage();
    await page.goto(url);

    const title = await page.evaluate(() => document.title);
    console.log(`Puppeteer: Page title for ${url}: ${title}`);

    let job: Job = {
      Company: "",
      Description: "",
      Location: "",
      Title: "",
      Url: "",
    }

    await page.waitForSelector('.jobs-search__results-list');

    const jobs = await extractJobDetails(page);

    for await (const job of jobs) {
      PostToIngestionApi(job);
    }
    console.log(jobs);
    console.log("Number of job listings:", jobs);





    await browser.close();

    //return { url, title, featuredArticle }; // Return the extracted data with the URL

  } catch (error) {
    console.error(`Puppeteer Error for ${url}:`, error);
    return { url, error: `Failed to scrape data from ${url}` };
  }
}
async function* extractJobDetails(page: any): AsyncGenerator<Job, void, unknown> {
  await page.waitForSelector('.jobs-search__results-list > li .base-search-card__info');
  const jobCardInfos = await page.$$('.jobs-search__results-list > li .base-search-card__info');

  for (const cardInfo of jobCardInfos) {
    try {
      const titleElement = await cardInfo.$('.base-search-card__title');
      const companyElement = await cardInfo.$('.base-search-card__subtitle a');
      const locationElement = await cardInfo.$('.job-search-card__location');

      const title = titleElement ? await titleElement.evaluate(el => el.textContent.trim()) : null;
      const company = companyElement ? await companyElement.evaluate(el => el.textContent.trim()) : null;
      const location = locationElement ? await locationElement.evaluate(el => el.textContent.trim()) : null;

      const clickableElement = await cardInfo.evaluateHandle(el => {
        const link = el.closest('li')?.querySelector('a.base-card__full-link'); // Example: find the closest li and then a full link
        return link;
      });

      if (clickableElement) {
        await clickableElement.click();
        await page.waitForSelector('.two-pane-serp-page__detail-view .show-more-less-html__markup', { timeout: 5000 }); // Wait for the description to load

        const description = await page.$eval('.two-pane-serp-page__detail-view .show-more-less-html__markup', el => el.innerHTML);
        const url = await page.url(); // Get the URL of the detail view

        yield { Title: title, Company: company, Location: location, Description: description, Url: url };

        // Optionally navigate back or close the detail view
        //await page.goBack(); // Or a more specific close action
        await page.waitForSelector('.jobs-search__results-list > li .base-search-card__info', { timeout: 5000 }); // Wait for the list to reappear
      } else {
        console.warn('Could not find clickable element for job card.');
        yield { Title: title, Company: company, Location: location, Description: null, Url: null };
      }
    } catch (error) {
      console.error('Error processing job card:', error);
      yield { Title: null, Company: null, Location: null, Description: null, Url: null };
    }
  }
}

export { runPuppeteer };
