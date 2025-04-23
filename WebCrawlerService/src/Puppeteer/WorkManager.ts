import puppeteer, { Browser } from "puppeteer";
import { IWorker } from "./Workers/IWorker";
import { PostToIngestionApi } from "../utils/DataIngestionApi";

export class WorkManager {
  busy: boolean;
  browser: Browser;
  initialised = false;

  constructor() {
    this.busy = false;
  }

  async DoWork(worker: IWorker): Promise<boolean> {
    if (this.busy) {
      return false;
    }

    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: null,
      });
    }

    this.busy = true;

    let page = await this.browser.newPage();

    const UA =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";

    await page.setUserAgent(UA);
    let jobs = await worker.run(page);

    for await (const job of jobs) {
      if (job instanceof Error) {
        console.error(worker.constructor.name);
        continue;
      }

      try {
        await PostToIngestionApi(job);
      } catch (error) {
        console.error("Error posting to Ingestion API:", error);
        throw error;
      }
    }

    await page.close();
    await this.browser.close();
    this.browser = null;
    this.busy = false;

    return true;
  }
}
