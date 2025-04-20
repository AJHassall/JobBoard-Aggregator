import client, { Connection, Channel, ChannelModel } from "amqplib";
import mqConnection from "./RabbitMq"; 
import { runPuppeteer } from "./LinkedInScraper";

async function main() {
  try {
    await mqConnection.connect();

    await mqConnection.consume(async (message: string) => {
      console.log(`✉️ Received message: ${message}`);
      try {
        const url = message; // Assuming the message content is the URL

        if (typeof url === 'string' && url.trim() !== '') {
          console.log(`🚀 Starting Puppeteer for URL: ${url}`);
          await runPuppeteer();
          console.log(`✅ Puppeteer finished for URL: ${url}`, "working");
        } else {
          console.error(`⚠️ Invalid URL received: ${message}`);
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
