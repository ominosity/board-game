import { xmlToXmlDoc } from './Utils.mjs';
import { convertXmlGameToJSON } from './Games.mjs';

export default class ExternalSource {
  constructor(apiPath, options, outType = 'json') {
    this.apiPath = apiPath;
    this.options = options;
    this.outType = outType;
  }

  async init() {
    try {
      const response = await fetch(this.apiPath, this.options);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      let result;
      if (this.outType === 'text') {
        result = await response.text();
      } else if (this.outType === 'xml') {
        result = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(result);
        result = xmlDoc;
      } else {
        // Default to JSON
        result = await response.json();
      }
      return result;
    } catch (error) {
      return error;
    }
  }
}

/* Takes an array of BGG Ids and downloads external data from BGG 
   Get information about all the games IDs in the parameter. 
   API limits to 20 games per query, so iterate accordingly. */
export async function downloadBGGCollection(bggIds) {
  const gameObjectList = [];
  const gameCount = bggIds.length;
  const iterations = (gameCount / 20) + 1;
  let currentSliceIndex = 0;

  // Prepare headers for all API calls
  const options = {
    headers: { 'Authorization': 'Bearer 098dcc7f-d31f-4e83-9beb-c564537921b7' }
  };

  // Iterate through batches of 20, getting the xml for each game and converting it to an object
  for (let i = 1; i < iterations; i++) {
    const tempArray = bggIds.slice(currentSliceIndex, currentSliceIndex + 20);
    const idList = tempArray.join(',');
    const apiURL = `https://boardgamegeek.com/xmlapi2/thing?id=${idList}&videos=1&stats=1`;
    const run = await fetch(apiURL, options);

    if (run.ok) {
      const response = await run.text();
      const responseXmlDoc = await xmlToXmlDoc(response);
      for (const bggId of tempArray) {
        const game = responseXmlDoc.querySelector(`item[id="${bggId}"]`);
        const gameObject = await convertXmlGameToJSON(game, bggId);
        gameObjectList.push(gameObject);
      };
    }
    currentSliceIndex += 20
  }
  console.log(gameObjectList);
}




  /* Get data from BGG for production */
  // const options = {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ credentials: { username, password } })
  // }

  // // 1. Login — cookie is stored by the browser automatically
  // const loginRes = await fetch('/bgg/login/api/v1', options);

  // if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);

  // // 2. Fetch collection — browser sends the session cookie automatically
  // const colRes = await fetch(
  //   `/bgg/xmlapi2/collection?username=${encodeURIComponent(username)}&showprivate=1`
  // );

  // if (!colRes.ok) throw new Error(`Collection request failed: ${colRes.status}`);

  // return colRes.text(); // XML string

  /* Get data from local file when testing and developing */
  // const localXML = await fetch('/json/bgg.xml');
  // if (localXML.ok) {
  //   const response = await localXML.text();
  //   return response;
  // }

