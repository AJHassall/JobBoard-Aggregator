
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const url = "http://job_api:8080";

export interface Job{
 Title? : string | null,
 Company?: string | null,
 Location? : string| null,
 Description? : string| null,
 Url? : string | null
}


export async function PostToIngestionApi(content: Job) {
  try {
    const response = await fetch(url + '/Job', { // You'll need to define 'url'
      method: "POST",
      body: JSON.stringify(content),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 500, 400)
      const errorText = await response.text(); // Get error message
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const responseData = await response.json(); // Parse JSON response
    console.log('Ingestion API response:', responseData); // Log success



  } catch (error) {
    // Handle network errors, JSON parsing errors, etc.
    console.error("Error posting to Ingestion API:", error);
    //  throw error; //rethrow
  }
}
