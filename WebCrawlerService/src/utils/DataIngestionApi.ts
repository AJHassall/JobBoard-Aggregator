const url = "";

export interface Job{
 Title : string,
 Company: string
 Location : string,
 Description : string,
 Url : string
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
