import { xmlToXmlDoc } from './Utils.mjs';
import { convertXmlGameToJSON } from './Games.mjs';

/* Class to manage External Data Sources. */
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
   API limits to 20 games per query, so iterate accordingly. 
   Use the Games.convertXmlGameToJSON to return a JSON object */
export async function downloadBGGCollection(bggIds) {
  const gameObjectList = [];
  const gameCount = bggIds.length;
  const iterations = gameCount / 20 + 1;
  let currentSliceIndex = 0;

  // Prepare headers for all API calls
  const options = {
    headers: { Authorization: 'Bearer 098dcc7f-d31f-4e83-9beb-c564537921b7' },
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
      }
    }
    currentSliceIndex += 20;
  }
  return gameObjectList;
}
