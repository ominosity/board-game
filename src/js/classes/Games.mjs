import DataSource from './DataSource.mjs';
import { downloadBGGCollection } from './ExternalSource';
import { getLocalStorage, setLocalStorage } from './DataSource.mjs';

/* A class to handle the entire games list and any functions
   on it (sort, filter, etc.) */
export default class Games {
  constructor() {
    this.gamesList = [];
  }

  /* Initialize this Games object to get the games from local storage or
     a combination of local storage and the BGG API */
  async init() {
    const localGamesList = getLocalStorage('BCGamesList');
    if (localGamesList !== "null" && localGamesList !== null && localGamesList !== undefined) {
      this.gamesList = localGamesList;
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
      setLocalStorage('BCGamesList', this.gamesList);
    }
  }

  /* Get the list of games as an array of game objects */
  async getGames() {
    return this.gamesList;
  }

  sortOrFilterGames(option) {
    switch (option) {
      case 'name-a-z': return this.gamesList.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-z-a': return this.gamesList.sort((a, b) => b.name.localeCompare(a.name));
      case 'time-asc': return this.gamesList.sort((a, b) => a.playingTime - b.playingTime);
      case 'time-desc': return this.gamesList.sort((a, b) => b.playingTime - a.playingTime);
      case 'min-asc': return this.gamesList.sort((a, b) => a.minPlayers - b.minPlayers);
      case 'min-desc': return this.gamesList.sort((a, b) => b.minPlayers - a.minPlayers);
      case 'max-asc': return this.gamesList.sort((a, b) => a.maxPlayers - b.maxPlayers);
      case 'max-desc': return this.gamesList.sort((a, b) => b.maxPlayers - a.maxPlayers);
      case 'living-room': return this.gamesList.filter(game => game.location === 'Living Room');
      case '1': return this.gamesList.filter(game => game.location === 'Basket 1');
      case '2': return this.gamesList.filter(game => game.location === 'Basket 2');
      case '3': return this.gamesList.filter(game => game.location === 'Basket 3');
      case '4': return this.gamesList.filter(game => game.location === 'Basket 4');
      case '5': return this.gamesList.filter(game => game.location === 'Basket 5');
      case '6': return this.gamesList.filter(game => game.location === 'Basket 6');
      case 'closet': return this.gamesList.filter(game => game.location === 'Closet Shelves');
    }
  }

  search(term) {
    const lowerTerm = term.toLowerCase();
    const results = this.gamesList.filter(game =>
      game.name.toLowerCase().includes(lowerTerm)
    );

    return results || [];
  }

  getGameByID(ID) {
    return this.gamesList.find(game => Number(game.id) === Number(ID));
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

/* Apply all games list to template */
export async function loadAllGamesToParent(template, parentElement) {
  // Get full games list from all sources by creating a Games object 
  // and initializing it
  const gameContainer = new Games();
  await gameContainer.init();

  // Apply games in list to the template and add to the DOM
  const gamesList = await gameContainer.getGames();
  await applyGamesTemplate(gamesList, template, parentElement);
}

/* Apply favorite games list to template */
export async function loadFavoriteGamesToParent(template, parentElement) {
  // Get favorites list from localStorage
  const favorites = getLocalStorage('BCGamesFavorites') || [];
  if (favorites.length !== 0) await applyGamesTemplate(favorites, template, parentElement);
}

/* Load games, sort or filter them, and output them to the template */
export async function sortOrFilterGamesToTemplateAndParent(template, parentElement, option) {
  // Clear parent
  parentElement.replaceChildren();
  // Get full games list from all sources by creating a Games object 
  // and initializing it
  const gameContainer = new Games();
  await gameContainer.init();

  // Sort or filter games according to selected option
  const newList = gameContainer.sortOrFilterGames(option);

  // Apply games in list to the template and add to the DOM
  await applyGamesTemplate(newList, template, parentElement);
}

/* Apply given data to games template and output to parent element */
export async function applyGamesTemplate(data, template, parentElement) {
  // Get a copy of favorited games to populate the favorite icons appropriately
  const favorites = getLocalStorage('BCGamesFavorites') || [];

  data.forEach(game => {
    // Create holders for the UI elements 
    const clone = template.content.cloneNode(true);
    const h3 = clone.querySelector('h3');
    const image = clone.querySelector('.game-pic');
    const bigImage = clone.querySelector('.detail-game-pic');
    const year = clone.querySelector('.year');
    const board = clone.querySelector('.separate-board');
    const players = clone.querySelector('.players');
    const location = clone.querySelector('.location');
    const playingTime = clone.querySelector('.playtime');
    const minAge = clone.querySelector('.min-age')
    const category = clone.querySelector('.category');
    const rating = clone.querySelector('.rating');
    const description = clone.querySelector('.description');
    const links = clone.querySelectorAll('.details');
    const favoriteButton = clone.querySelector('.favorite');
    const favoriteIcon = clone.querySelector('.favorite img');

    // Fill out UI with full game data 
    if (game.name) h3.textContent = game.name;
    if (image) {
      image.src = game.thumbnail;
      image.alt = game.name;
      image.loading = 'lazy';
    };
    if (bigImage) {
      bigImage.src = game.image;
      bigImage.alt = game.name;
      bigImage.loading = 'lazy';
    };
    if (year) year.textContent = game.year;
    if (board) board.textContent = game.separateBoard ? 'Yes' : 'No';
    if (players) players.textContent = `${game.minPlayers} to ${game.maxPlayers}`;
    if (location) location.textContent = game.location;
    if (playingTime && game.playingTime > 0) playingTime.textContent = `${game.playingTime} minutes`;
    if (minAge) minAge.textContent = `${game.minAge} years old`;
    if (category) category.textContent = game.category;
    if (rating) rating.textContent = game.rating;
    if (description) description.innerHTML = game.description;
    if (links) links.forEach(link => link.href = `../details/index.html?gameID=${game.id}`);
    if (favoriteButton) {
      favoriteButton.dataset.gameId = game.id;
      favoriteButton.addEventListener('click', (event) => {
        event.preventDefault();
        toggleFavorite(game.id, parentElement);
      });
    }
    if (favoriteIcon) {
      const foundGame = favorites.find(compareGame => Number(compareGame.id) === Number(game.id));
      if (foundGame) {
        favoriteIcon.src = '/images/favorite.svg';
        favoriteIcon.alt = `Unfavorite ${game.name}`;
      } else {
        favoriteIcon.src = '/images/unfavorite.svg';
        favoriteIcon.alt = `Favorite ${game.name}`;
      };
    };
  
    /* Hide BGG elements if no BGG data (lack of image is key) */
    if (game.image === null) {
      if (image) image.classList.add('hide');
      if (year) year.classList.add('hide');
      if (players) players.classList.add('hide');
      if (clone.querySelector('.li-players')) clone.querySelector('.li-players').classList.add('hide');
      if (playingTime) playingTime.classList.add('hide');
      if (clone.querySelector('.li-playtime')) clone.querySelector('.li-playtime').classList.add('hide');
      if (minAge) minAge.classList.add('hide');
      if (category) category.classList.add('hide');
      if (clone.querySelector('.li-category')) clone.querySelector('.li-category').classList.add('hide');
      if (rating) rating.classList.add('hide');
      if (description) description.classList.add('hide');
      if (links) links.forEach(link => {
        link.style.pointerEvents = 'none';
        link.style.cursor = 'default';
      });
      clone.querySelector('.bgg-link a figure').classList.add('hide');
    }
    parentElement.appendChild(clone);
  });
}

export async function searchGames(term, template, parentElement) {
  // Clear parent
  parentElement.replaceChildren();
  // Get full games list from all sources by creating a Games object 
  // and initializing it
  const gameContainer = new Games();
  await gameContainer.init();

  // Search games according to submitted term
  const newList = gameContainer.search(term);

  if (newList.length === 0) {
    parentElement.innerHTML = `<div class="panel"><h3> No games found </h3> <br><p>We're sorry, but no games match the search term "<strong>${term}</strong>."</p><p>Please try another sort, filter, or search.</p></div>`
  } else {
    // Apply games in list to the template and add to the DOM
    await applyGamesTemplate(newList, template, parentElement);
  }
}

// Given its ID, get the details of a game and apply them as children to the parent element
export async function getGameDetailsAndApplyTemplate(gameID, parentElement) {
  const gameContainer = new Games();
  await gameContainer.init();

  // Create a single-value array, so we can reuse the mass template builder
  const singleArray = [];
  
  // Find the game that matches the ID
  const game = await gameContainer.getGameByID(gameID);
  singleArray.push(game);

  // parentElement.innerHTML = `<h1>Game ID: ${game.id} </h1>`;
  const template = document.getElementById('game-template');
  await applyGamesTemplate(singleArray, template, parentElement);
}

// Toggle a game in/out of favorites
function toggleFavorite(gameId, parentElement) {
  const chosenGame = getLocalStorage('BCGamesList').find(game => Number(game.id) === Number(gameId));
  const gameElementFavoriteImage = parentElement.querySelector(`[data-game-id="${gameId}"] img`);

  let favorites = getLocalStorage('BCGamesFavorites') || [];
  const foundGame = favorites.find(game => Number(game.id) === Number(gameId));
  if (foundGame) {
    favorites = favorites.filter(game => game !== foundGame);
    gameElementFavoriteImage.src = "/images/unfavorite.svg";
    gameElementFavoriteImage.alt = `Favorite ${foundGame.name}`;
  } else {
    favorites.push(chosenGame);
    gameElementFavoriteImage.src = "/images/favorite.svg";
    gameElementFavoriteImage.alt = `Unfavorite ${chosenGame.name}`;
  }
  
  setLocalStorage('BCGamesFavorites', favorites);
}