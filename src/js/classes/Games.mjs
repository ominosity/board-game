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
    if (getLocalStorage('BCGamesList'))
    {
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
  const gameContainer = new Games();
  gameContainer.init();
  //const bggData = await getAndConvertXmlGamesToJSON();
  // const data = await addBGGDataToLocalGameData(bggData);

  // //const data = JSON.parse(json);
  // data.forEach(game => {
  //   const clone = template.content.cloneNode(true);
  //   const h3 = clone.querySelector('h3');
  //   const image = clone.querySelector('img');
  //   const year = clone.querySelector('.year');
  //   const board = clone.querySelector('.separate-board');
  //   const minPlayers = clone.querySelector('.min-players');
  //   const maxPlayers = clone.querySelector('.max-players');
  //   const location = clone.querySelector('.location');

  //   h3.textContent = game.name;
  //   image.src = game.thumbnail;
  //   image.alt = game.name;
  //   year.textContent = game.year;
  //   board.textContent = game.separateBoard ? 'Yes' : 'No';
  //   minPlayers.textContent = game.minPlayers;
  //   maxPlayers.textContent = game.maxPlayers;
  //   location.textContent = game.location;

  //   parentElement.appendChild(clone);
  // });
}