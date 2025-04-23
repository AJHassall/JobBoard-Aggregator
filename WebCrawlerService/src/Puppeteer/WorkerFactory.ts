import { IWorker } from "./Workers/IWorker";
import { GetPremiumTopPicks } from "./Workers/GetPremiumTopPicks";
import { DotNet24hrs } from "./Workers/LinkedInScraper";

export async function createWorker(workerType: 'premiumPicks' | 'dotnet24hrs' | 'reportGenerator'): Promise<IWorker> {
    switch (workerType) {
        case 'premiumPicks':
            return new GetPremiumTopPicks();
        case 'dotnet24hrs':
            return new DotNet24hrs();
        default:
            console.warn(`Unknown worker type: ${workerType}`);
            return null;
    }
}

