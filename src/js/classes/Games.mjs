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
    const dataSource = new DataSource('/json/games.json', 'Games');
    const results = await dataSource.init();
    this.gamesList = await results;

    let bggIds = [];
    this.gamesList.forEach(game => {
      if (game.bggId !== null) bggIds.push(game.bggId)
    });

    const bggDataXml = await downloadBGGCollection(bggIds)
  }

  showGames() {
    console.log(this.gamesList);
  }
}

/* Get a list of games from BGG in XML format and convert to JSON for processing */
export async function convertXmlGameToJSON(xmlGame, bggId) {
    const gameObject = {
      bggID: bggId,
      thumbnail: xmlGame.querySelector('thumbnail').textContent,
      name: xmlGame.querySelector('name[type="primary"]').getAttribute('value'),
      description: xmlGame.querySelector('description').textContent,
      minPlayers: xmlGame.querySelector('minplayers').getAttribute('value'),
      maxPlayers: xmlGame.querySelector('maxplayers').getAttribute('value')
    };

  if (xmlGame.querySelector('yearpublished')) {
      gameObject.year = xmlGame.querySelector('yearpublished').getAttribute('value');
    };

  if (xmlGame.querySelector('image')) {
    gameObject.image = xmlGame.querySelector('image').textContent;
  };

  return gameObject;
}

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