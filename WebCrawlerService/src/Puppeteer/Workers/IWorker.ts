import { Page } from "puppeteer";
import { Job } from "../../utils/DataIngestionApi";

export type OptionalJob = Job | Error

export interface IWorker {
    run(page: Page ) : AsyncGenerator<OptionalJob>
}
