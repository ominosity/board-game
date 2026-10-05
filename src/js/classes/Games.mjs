import DataSource from './DataSource.mjs';
import { convertToJson, xmlToXmlDoc } from './Utils.mjs';
import { downloadBGGCollection } from './ExternalSource';

/* A class to handle the entire games list and any functions
   on it (sort, filter, etc.) */
export default class Games {
  constructor() {
    this.gamesList = [];
  }

  async init() {
    this.gamesList = await getGamesList()
  }

  showGames() {
    console.log(this.gamesList);
  }
}

/* Get a JSON array of all games in local data source */
export async function getGamesList() {
  const dataSource = new DataSource('/json/games.json', 'Games');
  const results = await dataSource.init();
  return await results;
}

/* Get a list of games from BGG in XML format and convert to JSON for processing */
export async function getAndConvertXmlGamesToJSON() {
  const bggCollection = await downloadBGGCollection('ominosity', 'Unwrapped7-Chef-Sandpit');
  const bggJSON = await xmlToXmlDoc(bggCollection);

  const itemList = bggJSON.querySelectorAll('item');

  /* Build a JSON object by iterating through the xml document */
  // let jsonBuilder = '';
  let gamesList = [];
  itemList.forEach((item, index, array) => {
    const gameObject = {
      id: '',
      bggID: item.getAttribute('objectid'),
      name: item.querySelector('name').textContent,
      year: '',
      image: '',
      thumbnail: '',
      location: '',
      separateBoard: false,
      minPlayers: '',
      maxPlayers: ''
    };

    if (item.querySelector('yearpublished')) {
      gameObject.year = item.querySelector('yearpublished').textContent;
    };

    if (item.querySelector('image')) {
      gameObject.image = item.querySelector('image').textContent;
    }

    if (item.querySelector('thumbnail')) {
      gameObject.thumbnail = item.querySelector('thumbnail').textContent;
    }

    gamesList.push(gameObject);
  });

  return JSON.stringify(gamesList);
}

export async function buildGameTemplate(template, parentElement) {
  const bggData = await getAndConvertXmlGamesToJSON();
  const data = await addBGGDataToLocalGameData(bggData);

  //const data = JSON.parse(json);
  data.forEach(game => {
    const clone = template.content.cloneNode(true);
    const h3 = clone.querySelector('h3');
    const image = clone.querySelector('img');
    const year = clone.querySelector('.year');
    const board = clone.querySelector('.separate-board');
    const minPlayers = clone.querySelector('.min-players');
    const maxPlayers = clone.querySelector('.max-players');
    const location = clone.querySelector('.location');

    h3.textContent = game.name;
    image.src = game.thumbnail;
    image.alt = game.name;
    year.textContent = game.year;
    board.textContent = game.separateBoard ? 'Yes' : 'No';
    minPlayers.textContent = game.minPlayers;
    maxPlayers.textContent = game.maxPlayers;
    location.textContent = game.location;

    parentElement.appendChild(clone);
  });
}

export async function addBGGDataToLocalGameData(json) {
  const parsedJson = await JSON.parse(json);
  const localData = await getGamesList();

  const mergedData = localData.map(game => {
    const match = parsedJson.find(item => Number(item.bggID) === game.bggId);
    if (match !== undefined) {

      if (match.minPlayers) {
        game.minPlayers = match.minPlayers;
      }

      if (match.maxPlayers) {
        game.maxPlayers = match.maxPlayers;
      }

      if (match.year) {
        game.year = match.year;
      }

      if (match.image) {
        game.image = match.image;
      }

      if (match.thumbnail) {
        game.thumbnail = match.thumbnail;
      }
    }
    return game;
  });
  console.log(mergedData);
  return mergedData;
}