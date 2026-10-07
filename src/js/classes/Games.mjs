import DataSource from './DataSource.mjs';
import { downloadBGGCollection } from './ExternalSource';
import { getLocalStorage, setLocalStorage } from './DataSource.mjs';

/* A class to handle the entire games list and any functions
   on it (sort, filter, etc.) */
export default class Games {
  constructor() {
    this.gamesList = [];
  }

  async init() {
    if (getLocalStorage('BCGamesList')) {
      this.gamesList = JSON.parse(getLocalStorage('BCGamesList'));
    } else {

      const dataSource = new DataSource('/json/games.json', 'Games');
      const results = await dataSource.init();
      this.gamesList = await results;

      let bggIds = [];
      this.gamesList.forEach(game => {
        if (game.bggId !== null) bggIds.push(game.bggId)
      });

      const bggData = await downloadBGGCollection(bggIds)
      const combinedData = await mergeLocalAndBggDatasets(this.gamesList, bggData);

      this.gamesList = combinedData;

      // Write to local storage so we're not hitting the API every query
      setLocalStorage('BCGamesList', JSON.stringify(this.gamesList));
    }
  }

  /* Get the list of games as an array of game objects */
  getGames() {
    return this.gamesList;
  }
}

/* Get a list of games from BGG in XML format and convert to JSON for processing */
export async function convertXmlGameToJSON(xmlGame, bggId) {
  const gameObject = {
    bggID: bggId,
    name: xmlGame.querySelector('name[type="primary"]').getAttribute('value'),
    year: null,
    image: null,
    thumbnail: null,
    description: null,
    minPlayers: null,
    maxPlayers: null,
    playingTime: null,
    minAge: null,
    category: null,
    rating: null
  };

  if (xmlGame.querySelector('yearpublished')) {
    gameObject.year = xmlGame.querySelector('yearpublished').getAttribute('value');
  };

  if (xmlGame.querySelector('image')) {
    gameObject.image = xmlGame.querySelector('image').textContent;
  };

  if (xmlGame.querySelector('thumbnail')) {
    gameObject.thumbnail = xmlGame.querySelector('thumbnail').textContent;
  };

  if (xmlGame.querySelector('description')) {
    gameObject.description = xmlGame.querySelector('description').textContent;
  };

  if (xmlGame.querySelector('minplayers')) {
    gameObject.minPlayers = xmlGame.querySelector('minplayers').getAttribute('value');
  };

  if (xmlGame.querySelector('maxplayers')) {
    gameObject.maxPlayers = xmlGame.querySelector('maxplayers').getAttribute('value');
  };

  if (xmlGame.querySelector('playingtime')) {
    gameObject.playingTime = xmlGame.querySelector('playingtime').getAttribute('value');
  };

  if (xmlGame.querySelector('minage')) {
    gameObject.minAge = xmlGame.querySelector('minage').getAttribute('value');
  };

  if (xmlGame.querySelector('link[type="boardgamecategory"]')) {
    gameObject.category = xmlGame.querySelector('link[type="boardgamecategory"]').getAttribute('value');
  };

  if (xmlGame.querySelector('statistics ratings average')) {
    gameObject.rating = xmlGame.querySelector('statistics ratings average').getAttribute('value');
  };

  return gameObject;
}


/* Take local game data and add additional information from available
BGG Data */
export async function mergeLocalAndBggDatasets(localData, bggData) {
  const mergedData = localData.map(game => {
    const match = bggData.find(item => Number(item.bggID) === game.bggId);
    if (match !== undefined) {

      if (match.year) {
        game.year = match.year;
      }

      if (match.image) {
        game.image = match.image;
      }

      if (match.thumbnail) {
        game.thumbnail = match.thumbnail;
      }

      if (match.description) {
        game.description = match.description;
      }

      if (match.minPlayers) {
        game.minPlayers = match.minPlayers;
      }

      if (match.maxPlayers) {
        game.maxPlayers = match.maxPlayers;
      }

      if (match.playingTime) {
        game.playingTime = match.playingTime;
      }

      if (match.minAge) {
        game.minAge = match.minAge;
      }

      if (match.category) {
        game.category = match.category;
      }

      if (match.rating) {
        game.rating = match.rating;
      }
    }
    return game;
  });
  return mergedData;
}

/* Apply games list to template */
export async function buildGameTemplate(template, parentElement) {
  // Get full games list from all sources by creating a Games object 
  // and initializing it
  const gameContainer = new Games();
  await gameContainer.init();

  // Apply games in list to the template and add to the DOM
  const gamesList = gameContainer.getGames();
  gamesList.forEach(game => {
    /* Create holders for the UI elements */
    const clone = template.content.cloneNode(true);
    const h3 = clone.querySelector('h3');
    const image = clone.querySelector('img');
    const year = clone.querySelector('.year');
    const board = clone.querySelector('.separate-board');
    const players = clone.querySelector('.players');
    const location = clone.querySelector('.location');
    const playingTime = clone.querySelector('.playtime');
    const minAge = clone.querySelector('.min-age')
    const category = clone.querySelector('.category');
    const rating = clone.querySelector('.rating');
    const description = clone.querySelector('.description');

    /* Fill out UI with full game data */
    if (game.name) h3.textContent = game.name;
    if (image) image.src = game.image;
    if (image) image.alt = game.name;
    if (year) year.textContent = game.year;
    if (board) board.textContent = game.separateBoard ? 'Yes' : 'No';
    if (players) players.textContent = `${game.minPlayers} to ${game.maxPlayers}`;
    if (location) location.textContent = game.location;
    if (playingTime) playingTime.textContent = `${game.playingTime} minutes (avg)`;
    if (minAge) minAge.textContent = `${game.minAge} years old`;
    if (category) category.textContent = game.category;
    if (rating) rating.textContent = game.rating;
    if (description) description.innerHTML = game.description;

    /* Hide BGG elements if no BGG data (lack of image is key) */
    if (game.image === null) {
      if (image) image.classList.add('hide');
      if (year) year.classList.add('hide');
      if (players) players.classList.add('hide');
      if (playingTime) playingTime.classList.add('hide');
      if (minAge) minAge.classList.add('hide');
      if (category) category.classList.add('hide');
      if (rating) rating.classList.add('hide');
      if (description) description.classList.add('hide');
      clone.querySelector('.bgg-link').classList.add('hide');
    }
    parentElement.appendChild(clone);
  });
}