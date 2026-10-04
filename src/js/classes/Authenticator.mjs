import { getLocalStorage, setLocalStorage } from "./DataSource.mjs";

export default class Authenticator {
  constructor() {
    this.username;
    this.password;
    this.loggedInUser;
    this.loggedIn = false;
  }

  init() {
    this.username = getLocalStorage('BCGamesUsers');

    /* No usernames or passwords on file */
    if (!this.username) {
      this.loggedIn = false;
    }
  }

  isAuthenticated() {
    return this.loggedIn;
  }
}