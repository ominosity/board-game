export default class ExternalSource {
  constructor(apiPath, options) {
    this.apiPath = apiPath;
    this.options = options;
  }

  async init() {
    try {
      const response = await fetch(this.apiPath, this.options);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return error;
    }
  }
}
