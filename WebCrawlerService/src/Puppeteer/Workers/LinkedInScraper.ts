import { Page } from 'puppeteer';
import { IWorker, OptionalJob } from './IWorker';

export class DotNet24hrs implements IWorker {
  async *run(page: Page): AsyncGenerator<OptionalJob> {
    for await (const job of ScrapeDotnetJobsLast24Hrs(page)) {
      if (job instanceof Error) {
        yield job;
        console.error("Error from ScrapeTopPicks:", job);
        continue;
      }
      yield job;
    }
  }
}

async function* ScrapeDotnetJobsLast24Hrs(page: Page): AsyncGenerator<OptionalJob> {
  const url = "https://www.linkedin.com/jobs/search?keywords=Dotnet%2BDeveloper&location=United%2BKingdom&geoId=101165590&f_TPR=r86400&position=1&pageNum=0";
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' }); 
    await page.waitForSelector('.jobs-search__results-list', { timeout: 10000 });

    const jobs = await extractJobDetails(page);

    for await (const job of jobs) {
      yield job;
    }
    console.log(jobs);
  } catch (error) {
    console.error(`Puppeteer Error for ${url}:`, error);
    yield error;
  }
}
async function* extractJobDetails(page: any): AsyncGenerator<OptionalJob> {
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

        yield { Title: title, Company: company, Location: location, Description: description, Url: url ,IsEasyApply: false};

        await page.waitForSelector('.jobs-search__results-list > li .base-search-card__info', { timeout: 5000 }); // Wait for the list to reappear
      } else {
        console.warn('Could not find clickable element for job card.');
        yield { Title: title, Company: company, Location: location, Description: null, Url: null, IsEasyApply: false };
      }
    } catch (error) {
      console.error('Error processing job card:', error);
      yield error;
    }
  }
}
