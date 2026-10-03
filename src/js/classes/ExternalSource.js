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
