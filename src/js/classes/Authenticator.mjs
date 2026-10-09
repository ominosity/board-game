import { getLocalStorage, setLocalStorage } from "./DataSource.mjs";

export default class Authenticator {
  constructor() {
    this.users = [];
    this.username;
    this.password;
    this.loggedInUser;
    this.loggedIn = false;
  }

  async init() {
    this.users = await getLocalStorage('BCGamesUsers');
    this.loggedInUser = await getLocalStorage('BCGamesCurrentUser');

    /* No usernames or passwords on file */
    if (!this.users || this.users.length === 0) {
      this.loggedIn = false;
    }

    if (this.loggedInUser !== false) {
      this.loggedIn = true;
    }
  }

  isAuthenticated() {
    return this.loggedIn;
  }

  /* Register a new user in local storage */
  registerUser(username, password, name, email) {
    const newUser = {
      username: username,
      password: password,
      name: name,
      email: email
    }
    if (!this.users) {
      this.users = [];
    }
    this.users.push(newUser);
    setLocalStorage('BCGamesUsers', this.users);
  }

  /* Attempt to log in with the given username and password */
  login(username, password, passwordValidationElement) {
    // Reset logged in status and user
    this.loggedInUser = null;
    this.loggedIn = false;

    // Check if there are any local accounts logged
    if (!this.users || this.users.length === 0) {
      passwordValidationElement.setCustomValidity('No accounts on file. Please create an account');
      passwordValidationElement.reportValidity();
      return false;
    }

    // Search local storage for matching user and password
    const user = this.users.find(user => user.username === username && user.password === password);
    if (user) {
      this.loggedInUser = user.username;
      this.loggedIn = true;

      setLocalStorage('BCGamesCurrentUser', this.loggedInUser);
      return true;
    } else {
      passwordValidationElement.setCustomValidity('Invalid username or password');
      passwordValidationElement.reportValidity();
      return false;
    }
  }

  getLoggedInName() {
    if (this.loggedInUser != null) {
      const userObject = this.users.find(user =>
        user.username === this.loggedInUser
      );
      return userObject['name'];
    }
  }

  logout() {
    setLocalStorage('BCGamesCurrentUser', null);
    window.location.replace('./index.html');
  }
}