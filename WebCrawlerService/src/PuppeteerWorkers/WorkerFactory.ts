import { IWorker } from "./IWorker";
import { GetPremiumTopPicks } from "./GetPremiumTopPicks";

export function createWorker(workerType: 'premiumPicks' | 'dataExporter' | 'reportGenerator'): IWorker | null {
    switch (workerType) {
        case 'premiumPicks':
            return new GetPremiumTopPicks();
        default:
            console.warn(`Unknown worker type: ${workerType}`);
            return null;
    }
}

