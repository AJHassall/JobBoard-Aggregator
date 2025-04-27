import { Locator, Page } from "puppeteer";
import { IWorker, OptionalJob } from "./IWorker";
import { Company, Job } from "../../utils/DataIngestionApi";

export class GetPremiumTopPicks implements IWorker {
  async *run(page: Page): AsyncGenerator<OptionalJob> {
    for await (const job of ScrapeTopPicks(page)) {
      if (job instanceof Error) {
        yield job;
        console.error("Error from ScrapeTopPicks:", job);
        continue;
      }
      yield job;
    }
  }
}

const ScrapeTopPicks = async function *(_page: Page): AsyncGenerator<OptionalJob> {

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

  {
    const targetPage = page;
    await targetPage.goto(
      "https://www.linkedin.com/jobs/collections/top-applicant"
    );
    const jobCardSelector = ".job-card-container--clickable";

    const jobCards = await page.$$(jobCardSelector);
    console.log(`Found ${jobCards.length} job cards.`);

    for (const jobCard of jobCards) {
      try {
        await jobCard.click();
        console.log("Clicked a job card.");
        const description = await page.$eval(
          ".scaffold-layout__detail .jobs-description__container p[dir=ltr]",
          (el) => el.innerHTML
        );

        description.trim();

        const jobTitleText = await page.$eval(
          ".scaffold-layout__detail  .job-details-jobs-unified-top-card__job-title",
          (el) => el.textContent
        );
        const companyElement = await page.$('.job-details-jobs-unified-top-card__company-name');
        const company = companyElement ? await companyElement.evaluate(el => el.textContent.trim()) : null;

        const Company: Company = {
          Name: company
        }


        const location = await page.$eval(
          " .job-details-jobs-unified-top-card__primary-description-container span:first-child span:first-child",
          (el) => el.textContent
        );

        const isEasyApply = await page.$eval(
          " .jobs-apply-button--top-card span",
          (el) => el.textContent.toLocaleLowerCase() === "easy apply"
        );


        const job: Job = {
          Title: jobTitleText?.trim() || null,
          Description: description?.trim() || null,
          Url: page.url(),
          Company: Company,
          Location: location,
          IsEasyApply: isEasyApply,
        };

        yield job;

        console.log(jobTitleText);
      } catch (error) {
        console.error("Error processing a job card:", error);
        yield error
      }
    }
  }


};
