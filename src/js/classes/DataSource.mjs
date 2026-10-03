import { convertToJson } from './utils.mjs';

export default class DataSource {
  constructor(path, outputType, sourceType = 'json') {
    this.path = path;
    this.outputType = outputType;
    this.sourceType = sourceType;
    this.results;
  }

  async init() {
    try {
      const response = await fetch(this.path);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      switch (this.sourceType) {
        case 'json':
          return await convertToJson(response);
        default:
          throw new Error(`Unsupported data type: ${this.sourceType}`);
      }

    } catch (error) {
      return error
    }
  }
}

export function getAvailability() {
  const dataSource = new DataSource('/json/availability.json', 'Availability');
  const results = dataSource.init();
  return results;
}