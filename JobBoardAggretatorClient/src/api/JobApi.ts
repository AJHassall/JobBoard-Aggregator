import { Job } from "../models/models";

const URL = "localhost:5001/job";

export async function GetJobs(): Promise<Job[] | null> {
  try {
    const res = await fetch(URL, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }
    return await res.json() as Job[];

  } catch (error) {
    console.error(error);
    return null;
  }
}
