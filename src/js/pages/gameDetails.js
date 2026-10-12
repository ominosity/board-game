import { loadHeaderFooter, getParam } from '../classes/Utils.mjs';
import { getGameDetailsAndApplyTemplate } from '../classes/Games.mjs';

loadHeaderFooter();

const gameID = getParam('gameID');
const gameElement = document.getElementById('game');
getGameDetailsAndApplyTemplate(gameID, gameElement);
