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

/* Gets availability data from local data source and loads it to the given parent element */
export async function getAvailability(parentElement) {
  const dataSource = new DataSource('/json/availability.json', 'Availability');
  const results = await dataSource.init();

  /* For now, just iterate through the available dates and output to the parent element. We'll
     work on the rest of the functionality later */
  results.forEach(slot => {
    const listItem = document.createElement('li');
    listItem.textContent = `Start: ${slot.start}; End: ${slot.end}; Seats ${slot.seats}; Comments ${slot.comment}; Available?: ${slot.available ? 'Yes': 'No'}`
    parentElement.appendChild(listItem);
  })
}

/* Retrieve the value associated with the given key from local storage */
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

/* Set the JSON value and given key to local storage */
export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}