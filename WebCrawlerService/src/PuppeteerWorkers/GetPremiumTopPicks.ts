import puppeteer, { Locator } from 'puppeteer';
import { IWorker } from "./IWorker";
import { Job } from '../utils/DataIngestionApi';
import * as dotenv from 'dotenv'

export class GetPremiumTopPicks implements IWorker{
    run(): Promise<Job[]> {
        return Run
    }

}

const Run = (async ()  => {
    dotenv.config();
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: null,

      });

      const customUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
      const page = await browser.newPage();
      await page.setUserAgent(customUA);

    let timeout = 0;0
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 3280,
            height: 1542
        })
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        }
        startWaitingForEvents();
        await targetPage.goto('https://www.linkedin.com/');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        }
        await Locator.race([
            targetPage.locator('::-p-aria(Sign in)'),
            targetPage.locator('a.nav__button-secondary'),
            targetPage.locator('::-p-xpath(/html/body/nav/div/a[2])'),
            targetPage.locator(':scope >>> a.nav__button-secondary')
        ])
            .setTimeout(timeout)
            .on('action', () => startWaitingForEvents())
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
            targetPage.locator('::-p-aria(Email or phone)'),
            targetPage.locator('#username'),
            targetPage.locator('::-p-xpath(//*[@id=\\"username\\"])'),
            targetPage.locator(':scope >>> #username')
        ])

            .fill(process.env.LinkedInEmail);
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down('Tab');
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up('Tab');
    }
    {
        const targetPage = page;
        await Locator.race([
            targetPage.locator('::-p-aria(Password)'),
            targetPage.locator('#password'),
            targetPage.locator('::-p-xpath(//*[@id=\\"password\\"])'),
            targetPage.locator(':scope >>> #password')
        ])
            .setTimeout(timeout)
            .fill(process.env.LinkedInPass)
    }
    {
        const targetPage = page;
        await Locator.race([
            targetPage.locator('div.remember_me__opt_in > label'),
            targetPage.locator('::-p-xpath(//*[@id=\\"organic-div\\"]/form/div[3]/label)'),
            targetPage.locator(':scope >>> div.remember_me__opt_in > label'),
            targetPage.locator('::-p-text(Keep me logged)')
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
        }
        await Locator.race([
            targetPage.locator('::-p-aria(Sign in[role=\\"button\\"])'),
            targetPage.locator('form button'),
            targetPage.locator('::-p-xpath(//*[@id=\\"organic-div\\"]/form/div[4]/button)'),
            targetPage.locator(':scope >>> form button')
        ])
            .setTimeout(timeout)
            .on('action', () => startWaitingForEvents())
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
            targetPage.locator('::-p-aria(Jobs) >>>> ::-p-aria([role=\\"graphics-symbol\\"])'),
            targetPage.locator('li:nth-of-type(3) path'),
            targetPage.locator('::-p-xpath(//*[@id=\\"global-nav\\"]/div/nav/ul/li[3]/a/div/div/li-icon/svg/path)'),
            targetPage.locator(':scope >>> li:nth-of-type(3) path')
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
        await targetPage.goto("https://www.linkedin.com/jobs/collections/top-applicant")
        const jobCardSelector = '.job-card-container--clickable';

        const jobCards = await page.$$(jobCardSelector);
        console.log(`Found ${jobCards.length} job cards.`);

        for (const jobCard of jobCards) {
            try {
                // Click the job card
                await jobCard.click();
                console.log('Clicked a job card.');
                const description = await page.$eval('.scaffold-layout__detail .jobs-description__container p[dir=ltr]', el => el.innerHTML);


                description.trim();

                const jobTitleText = await page.$eval('.scaffold-layout__detail  .job-details-jobs-unified-top-card__job-title', (el)=> el.textContent); 
                
                console.log(jobTitleText)


    
            } catch (error) {
                console.error('Error processing a job card:', error);
            }
        }
    
    
    }
    

    timeout = 0;



    await browser.close();

    let jobs: Job[]; 
    return jobs

})()
