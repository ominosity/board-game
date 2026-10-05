import { loadHeaderFooter } from '../classes/Utils.mjs';
import { buildGameTemplate } from '../classes/Games.mjs';

loadHeaderFooter();

const browseParent = document.getElementById('games');
const gameTemplate = document.getElementById('game-template');
buildGameTemplate(gameTemplate, browseParent);
