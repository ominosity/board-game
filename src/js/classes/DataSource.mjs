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

  const futureValues = results.filter(date => new Date(date.start) >= new Date());

  // For now, just iterate through the available dates and output to the parent element. We'll
  // work on the rest of the functionality later 
  futureValues.forEach(slot => {
    const option = document.createElement('option');
    // Parse out dates and times to display 
    const startDateTime = new Date(slot.start);
    const endDateTime = new Date(slot.end);

    let month = startDateTime.getMonth() + 1;
    month = month.toString().padStart(2, '0');
    const day = startDateTime.getDate().toString().padStart(2, '0');
    const year = startDateTime.getFullYear().toString().padStart(2, '0');
    
    let startHour = startDateTime.getHours();
    const startAmPm = startHour >= 12 ? 'pm' : 'am';
    startHour = `${startHour % 12 || 12}`;
    startHour = startHour.toString().padStart(2, '0');
    const startMinute = startDateTime.getMinutes().toString().padStart(2, '0');
    
    let endHour = endDateTime.getHours();
    const endAmPm = endHour > 12 ? 'pm' : 'am';
    endHour = `${endHour % 12 || 12}`;
    endHour = endHour.toString().padStart(2, '0');
    const endMinute = endDateTime.getMinutes().toString().padStart(2, '0');

    // Put it all together
    const formattedValue = `${month}/${day}/${year} - ${startHour}:${startMinute}${startAmPm} to ${endHour}:${endMinute}${endAmPm}`;

    option.textContent = formattedValue;
    option.value = slot.id;

    parentElement.appendChild(option);
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