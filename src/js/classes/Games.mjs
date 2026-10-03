import DataSource from "./DataSource.mjs";

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

export async function getGamesList() {
  const dataSource = new DataSource('/json/games.json', 'Games');
  const results = await dataSource.init();
  return results;
}