// src/scraper.ts
import puppeteer from 'puppeteer';
import { PostToIngestionApi, Job } from "./utils/DataIngestionApi";
import { error } from 'console';

async function runPuppeteer() {
  const url = "https://www.linkedin.com/jobs/search?keywords=Dotnet%2BDeveloper&location=United%2BKingdom&geoId=101165590&f_TPR=r86400&position=1&pageNum=0";
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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

    const featuredArticle= await page.evaluate(async () => {
      const jobListElements = Array.from(document.querySelectorAll(".jobs-search__results-list .job-search-card__location"));
    
      if (!jobListElements || jobListElements.length === 0) {
        console.error("job list selector found no jobs");
        throw new Error("job list selector found no jobs");
      }
    
      const locations = jobListElements.map(element => element.textContent.trim());
    
      return locations;
    });

    PostToIngestionApi(job);

    console.log(`Puppeteer: Featured Article for ${url}:`, featuredArticle);



    await browser.close();

    return { url, title, featuredArticle }; // Return the extracted data with the URL

  } catch (error) {
    console.error(`Puppeteer Error for ${url}:`, error);
    return { url, error: `Failed to scrape data from ${url}` };
  }
}

export { runPuppeteer };
