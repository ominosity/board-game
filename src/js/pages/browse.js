import { loadHeaderFooter } from '../classes/Utils.mjs';
import { loadAllGamesToParent, sortOrFilterGamesToTemplateAndParent, searchGames } from '../classes/Games.mjs';

loadHeaderFooter();

const browseParent = document.getElementById('games');
const gameTemplate = document.getElementById('game-template');
loadAllGamesToParent(gameTemplate, browseParent);

const sortOrFilterElement = document.getElementById('sort-or-filter');
sortOrFilterElement.addEventListener('change', () => {
  sortOrFilterGamesToTemplateAndParent(gameTemplate, browseParent, sortOrFilterElement.value);
});


const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', (event) => {
  event.preventDefault();
  const searchTermElement = document.getElementById('search');
  // Only allow searches if at least 2 characters are included
  if (searchTermElement.value.length < 3) {
    searchTermElement.setCustomValidity('Please include 3 or more characters');
    searchTermElement.reportValidity();
  } else {
    searchGames(searchTermElement.value, gameTemplate, browseParent);
  }
});

const searchTermElement = document.getElementById('search');
searchTermElement.addEventListener('input', (event) => {
  event.currentTarget.setCustomValidity('');
  event.currentTarget.reportValidity();
})

