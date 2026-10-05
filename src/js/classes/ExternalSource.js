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

/* Code from BGG */
export async function downloadBGGCollection(username, password) {
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
  const localXML = await fetch('/json/bgg.xml');
  if (localXML.ok) {
    const response = await localXML.text();
    return response;
  }
}
