import { convertToJson } from './Utils.mjs';

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

/* Retrieve the value associated with the given key from local storage */
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

/* Set the JSON value and given key to local storage */
export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}