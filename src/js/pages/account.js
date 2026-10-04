import { loadHeaderFooter } from '../classes/Utils.mjs';
import Authenticator from '../classes/Authenticator.mjs';

loadHeaderFooter();

const authenticator = new Authenticator();
authenticator.init();

const signInForm = document.getElementById('sign-in-form');
const updateForm = document.getElementById('update-form');
const registerForm = document.getElementById('register-form');

// if (!authenticator.isAuthenticated()) {
//   console.log('Not authenticated')
// }

if (signInForm) {
  signInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const checkUsername = document.getElementById('username').value;
    const checkPassword = document.getElementById('password').value;

    authenticator.init();

    try {
      const results = authenticator.login(checkUsername, checkPassword);
      if (results) {
        signInForm.classList.add('hide');
        document.getElementById('success').classList.remove('hide');
        const name = document.getElementById('personal-name');
        name.textContent = authenticator.getLoggedInName();
      }
    } catch (error) {
      // console.error(error);
    }
  });
}

if (updateForm) {
  updateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // console.log('update button clicked');
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('new-username');
    const password = document.getElementById('new-password');
    const name = document.getElementById('new-name');
    const email = document.getElementById('new-email');

    authenticator.registerUser(
      username.value,
      password.value,
      name.value,
      email.value,
    );
    window.location.replace('./index.html');
  });
}
