import DataSource from "./DataSource.mjs";
import { convertToJson } from "./Utils.mjs";

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

/* Get a JSON array of all games in data source */
export async function getGamesList() {
  const dataSource = new DataSource('/json/games.json', 'Games');
  const results = await dataSource.init();
  return await convertToJson(results);
}