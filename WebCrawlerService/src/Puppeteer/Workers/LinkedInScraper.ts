import { Locator, Page } from 'puppeteer';
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

async function* ScrapeDotnetJobsLast24Hrs(_page: Page): AsyncGenerator<OptionalJob> {

    const page = _page;
  
    let timeout = 0;
    page.setDefaultTimeout(timeout);
  
    {
      const targetPage = page;
      await targetPage.setViewport({
        width: 3280,
        height: 1542,
      });
    }
    {
      const targetPage = page;
      const promises = [];
      const startWaitingForEvents = () => {
        promises.push(targetPage.waitForNavigation());
      };
      startWaitingForEvents();
      await targetPage.goto("https://www.linkedin.com/");
      await Promise.all(promises);
    }
    {
      const targetPage = page;
      const promises = [];
      const startWaitingForEvents = () => {
        promises.push(targetPage.waitForNavigation());
      };
      await Locator.race([
        targetPage.locator("::-p-aria(Sign in)"),
        targetPage.locator("a.nav__button-secondary"),
        targetPage.locator("::-p-xpath(/html/body/nav/div/a[2])"),
        targetPage.locator(":scope >>> a.nav__button-secondary"),
      ])
        .setTimeout(timeout)
        .on("action", () => startWaitingForEvents())
        .click({
          offset: {
            x: 51.3125,
            y: 34,
          },
        });
      await Promise.all(promises);
    }
    {
      const targetPage = page;
      await Locator.race([
        targetPage.locator("::-p-aria(Email or phone)"),
        targetPage.locator("#username"),
        targetPage.locator('::-p-xpath(//*[@id=\\"username\\"])'),
        targetPage.locator(":scope >>> #username"),
      ])
      .fill(process.env.LinkedInEmail);
    }
    {
      const targetPage = page;
      await targetPage.keyboard.down("Tab");
    }
    {
      const targetPage = page;
      await targetPage.keyboard.up("Tab");
    }
    {
      const targetPage = page;
      await Locator.race([
        targetPage.locator("::-p-aria(Password)"),
        targetPage.locator("#password"),
        targetPage.locator('::-p-xpath(//*[@id=\\"password\\"])'),
        targetPage.locator(":scope >>> #password"),
      ])
        .setTimeout(timeout)
        .fill(process.env.LinkedInPass);
    }
    {
      const targetPage = page;
      await Locator.race([
        targetPage.locator("div.remember_me__opt_in > label"),
        targetPage.locator(
          '::-p-xpath(//*[@id=\\"organic-div\\"]/form/div[3]/label)'
        ),
        targetPage.locator(":scope >>> div.remember_me__opt_in > label"),
        targetPage.locator("::-p-text(Keep me logged)"),
      ])
        .setTimeout(timeout)
        .click({
          offset: {
            x: 12,
            y: 7.515625,
          },
        });
    }
  
    {
      const targetPage = page;
      const promises = [];
      const startWaitingForEvents = () => {
        promises.push(targetPage.waitForNavigation());
      };
      await Locator.race([
        targetPage.locator('::-p-aria(Sign in[role=\\"button\\"])'),
        targetPage.locator("form button"),
        targetPage.locator(
          '::-p-xpath(//*[@id=\\"organic-div\\"]/form/div[4]/button)'
        ),
        targetPage.locator(":scope >>> form button"),
      ])
        .setTimeout(timeout)
        .on("action", () => startWaitingForEvents())
        .click({
          offset: {
            x: 162.5,
            y: 9.515625,
          },
        });
      await Promise.all(promises);
    }
    {
      const targetPage = page;
      await Locator.race([
        targetPage.locator(
          '::-p-aria(Jobs) >>>> ::-p-aria([role=\\"graphics-symbol\\"])'
        ),
        targetPage.locator("li:nth-of-type(3) path"),
        targetPage.locator(
          '::-p-xpath(//*[@id=\\"global-nav\\"]/div/nav/ul/li[3]/a/div/div/li-icon/svg/path)'
        ),
        targetPage.locator(":scope >>> li:nth-of-type(3) path"),
      ])
        .setTimeout(timeout)
        .click({
          offset: {
            x: 11.984375,
            y: 17,
          },
        });
    }
  
  const url = "https://www.linkedin.com/jobs/search/geoId=90009496&keywords=Dotnet%2BDeveloper";
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' }); 

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
        await Promise.all([
          await clickableElement.click(),
          page.waitForNavigation({waitUntil: 'networkidle2'})
      ]);


        const isEasyApply = await page.$eval(
          " .jobs-apply-button--top-card span",
          (el) => el.textContent.toLocaleLowerCase().includes("easy apply")
        );


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
