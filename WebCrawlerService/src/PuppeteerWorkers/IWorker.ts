import { Job } from "../utils/DataIngestionApi";

export interface IWorker {
    run() : Promise<Job[]>
}
