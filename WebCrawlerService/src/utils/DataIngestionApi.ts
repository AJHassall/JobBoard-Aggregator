
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const url = "https://localhost:5001";

export interface Job{
 Title? : string | null,
 Company?: string | null,
 Location? : string| null,
 Description? : string| null,
 Url? : string | null
}

export async function PostToIngestionApi(content: Job){

    await fetch(url + '/Job', {
        method: "POST",
        body: JSON.stringify(content),
        headers: {
         'Content-Type': 'application/json'
        }
      })
}
