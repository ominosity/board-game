import { loadHeaderFooter, getParam } from '../classes/Utils.mjs';
import { getGameDetails } from '../classes/Games.mjs';

loadHeaderFooter();

const gameID = getParam('gameID');
const gameElement = document.getElementById('game');
getGameDetails(gameID, gameElement);
