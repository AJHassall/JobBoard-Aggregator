import * as dotenv from "dotenv";

import { createWorker } from "./Puppeteer/WorkerFactory";
import puppeteer from "puppeteer";
import { WorkManager } from "./Puppeteer/WorkManager";
import mqConnection from "./RabbitMq";

async function main() {
  dotenv.config();



  let workManager = new WorkManager();

  try {
    await mqConnection.connect();

    await mqConnection.consume(async (message: string) => {
      console.log(`✉️ Received message: ${message}`);
      try {
        const messageContent = message;

        const worker = await createWorker(messageContent as 'premiumPicks' | 'dotnet24hrs');
        if (worker) {
          console.log(`🚀 Starting Puppeteer for worker type: ${messageContent}`);
          const result = await workManager.DoWork(worker);
          console.log(`✅ Puppeteer finished for worker type: ${messageContent}`, result ? "successfully" : "busy");

          return true;
        } else {
          console.error(`🔥  No worker created for message: ${messageContent}`);
          return false;
        }

      } catch (error) {
        console.error(`🔥 Error processing message: ${message}`, error);
      }
    });

    // Keep the process running to continue listening for messages
    console.log("Waiting for messages...");

  } catch (error) {
    console.error("🔴 Error in main:", error);
  }
}

main().catch(console.error);
