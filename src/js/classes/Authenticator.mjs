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

    if (this.loggedInUser) {
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
    this.users.push(newUser);
    setLocalStorage('BCGamesUsers', this.users);
  }

  /* Attempt to log in with the given username and password */
  login(username, password) {
    // Reset logged in status and user
    this.loggedInUser = null;
    this.loggedIn = false;

    // Search local storage for matching user and password
    const user = this.users.find(user => user.username === username && user.password === password);
    if (user) {
      this.loggedInUser = user.username;
      this.loggedIn = true;

      setLocalStorage('BCGamesCurrentUser', this.loggedInUser);
    }

    // this.users.forEach(element => {
    //   if (element.username === username && element.password === password) {
    //     this.loggedInUser = element.username;
    //     this.loggedIn = true;
    //   };
    // });

    // Throw an exception if authentication unsuccessful
    if (this.loggedInUser === null) {
      throw new Error('User not found');
    }

    // Otherwise let the caller know authentication was successful
    return true;
  }

  getLoggedInName() {
    if (this.loggedInUser != null) {
      const userObject = this.users.find(user =>
        user.username === this.loggedInUser
      );
      return userObject['name'];
    }
  }
}