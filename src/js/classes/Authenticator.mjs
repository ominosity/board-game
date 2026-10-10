import { getLocalStorage, setLocalStorage } from "./DataSource.mjs";

export default class Authenticator {
  constructor() {
    this.users = [];
    this.username;
    this.password;
    this.loggedInUser;
    this.loggedIn = false;
    this.email;
    this.name;
  }

  async init() {
    this.users = await getLocalStorage('BCGamesUsers') || [];
    this.loggedInUser = await getLocalStorage('BCGamesCurrentUser');

    /* No usernames or passwords on file */
    if (!this.users || this.users.length === 0) {
      this.loggedIn = false;
    }

    if (this.loggedInUser !== false && this.loggedInUser !== null) {
      this.loggedIn = true;
      const user = this.users.find(lUser => lUser.username === this.loggedInUser);
      this.username = user.username;
      this.password = user.password;
      this.email = user.email;
      this.name = user.name;
    }
  }

  isAuthenticated() {
    return this.loggedIn;
  }

  loginUsername() {
    return this.loggedInUser;
  }

  /* Register a new user in local storage 
     Receive containing elements for validation */
  registerUser(usernameElement, passwordElement, confirmPasswordElement, nameElement, emailElement) {
    // Make sure the passwords match
    if (passwordElement.value !== confirmPasswordElement.value) {
      passwordElement.setCustomValidity('Passwords don\'t match!');
      passwordElement.reportValidity();
      return false;
    }

    // Make sure the username doesn't already exist
    if (this.users) {
      const match = this.users.find(user => user.username === usernameElement.value);
      if (match) {
        usernameElement.setCustomValidity('Username not available, please try again');
        usernameElement.reportValidity();
        return false;
      }
    }

    // Create the new user
    const newUser = {
      username: usernameElement.value,
      password: passwordElement.value,
      name: nameElement.value,
      email: emailElement.value
    }


    // if (!this.users) {
    //   this.users = [];
    // }

    // Add the new user and store to local storage
    this.users.push(newUser);
    setLocalStorage('BCGamesUsers', this.users);
    return true;
  }

  updateUser(usernameElement, passwordElement, confirmPasswordElement, nameElement, emailElement) {
    // Make sure the passwords match
    if (passwordElement.value !== confirmPasswordElement.value) {
      passwordElement.setCustomValidity('Passwords don\'t match!');
      passwordElement.reportValidity();
      return false;
    }

    const thisUser = this.users.find(user => user.username === usernameElement.value);
    thisUser.password = passwordElement.value;
    thisUser.name = nameElement.value;
    thisUser.email = emailElement.value;
    setLocalStorage('BCGamesUsers', this.users);
    return thisUser.username;
  }

  /* Attempt to log in with the given username and password */
  login(username, password, passwordValidationElement, loginElement) {
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
      loginElement.textContent = 'Account';
      loginElement.setAttribute('href', '/account/edit.html');
      setLocalStorage('BCGamesCurrentUser', this.loggedInUser);
      return true;
    } else {
      passwordValidationElement.setCustomValidity('Invalid username or password');
      passwordValidationElement.reportValidity();
      loginElement.textContent = 'Login';
      loginElement.setAttribute('href', '/account/index.html');

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