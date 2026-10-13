import { loadHeaderFooter } from '../classes/Utils.mjs';
import {
  loadAllGamesToParent,
  sortOrFilterGamesToTemplateAndParent,
  searchGames,
} from '../classes/Games.mjs';

loadHeaderFooter();

const gamesParent = document.getElementById('games');
const gameTemplate = document.getElementById('game-template');
loadAllGamesToParent(gameTemplate, gamesParent);

const sortOrFilterElement = document.getElementById('sort-or-filter');
sortOrFilterElement.addEventListener('change', () => {
  sortOrFilterGamesToTemplateAndParent(
    gameTemplate,
    gamesParent,
    sortOrFilterElement.value,
  );
});

// Clear validation errors on changes
const searchTermElement = document.getElementById('search');
searchTermElement.addEventListener('input', (event) => {
  event.currentTarget.setCustomValidity('');
  event.currentTarget.reportValidity();
});

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', (event) => {
  event.preventDefault();
  // Only allow searches if at least 2 characters are included
  if (searchTermElement.value.length < 3) {
    searchTermElement.setCustomValidity('Please include 3 or more characters');
    searchTermElement.reportValidity();
  } else {
    searchGames(searchTermElement.value, gameTemplate, gamesParent);
  }
});

const sortToggle = document.getElementById('sort-toggle');
const sortDiv = document.getElementById('sort-div');
const searchToggle = document.getElementById('search-toggle');
const searchDiv = document.getElementById('search-div');

searchToggle.addEventListener('click', (event) => {
  event.preventDefault();
  searchDiv.classList.toggle('minimize');
  sortDiv.classList.add('minimize');
  searchToggle.classList.toggle('selected');
  sortToggle.classList.remove('selected');
});

sortToggle.addEventListener('click', (event) => {
  event.preventDefault();
  sortDiv.classList.toggle('minimize');
  searchDiv.classList.add('minimize');
  sortToggle.classList.toggle('selected');
  searchToggle.classList.remove('selected');
});
