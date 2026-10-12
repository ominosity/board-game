import { loadHeaderFooter } from '../classes/Utils.mjs';
import { loadFavoriteGamesToParent } from '../classes/Games.mjs';

loadHeaderFooter();

const gamesParent = document.getElementById('games');
const gameTemplate = document.getElementById('game-template');
loadFavoriteGamesToParent(gameTemplate, gamesParent);
