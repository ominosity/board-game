import { loadHeaderFooter, applyTemplate } from '../classes/Utils.mjs';
import Authenticator from '../classes/Authenticator.mjs';

loadHeaderFooter();

const authenticator = new Authenticator();
authenticator.init();

const signInButton = document.getElementById('sign-in-button');
const updateButton = document.getElementById('update-button');
const registerButton = document.getElementById('register-button');

if (!authenticator.isAuthenticated()) {
  console.log('Not authenticated')
}

if (signInButton) {
  signInButton.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('sign in button clicked');
  });
}

if (updateButton) {
  updateButton.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('update button clicked');
  });
}

if (registerButton) {
  registerButton.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('register button clicked');
  });
}