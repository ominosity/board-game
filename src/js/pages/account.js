import { loadHeaderFooter } from '../classes/Utils.mjs';
import Authenticator from '../classes/Authenticator.mjs';

loadHeaderFooter();

const authenticator = new Authenticator();
authenticator.init();

if (!authenticator.isAuthenticated)
{
  window.location.replace('./index.html');
}

const signInForm = document.getElementById('sign-in-form');
const editForm = document.getElementById('edit-form');
const signOutButton = document.getElementById('sign-out');
const registerForm = document.getElementById('register-form');

// if (!authenticator.isAuthenticated()) {
//   console.log('Not authenticated')
// }

if (signInForm) {
  signInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userNameValidationElement = document.getElementById('username');
    const checkUsername = userNameValidationElement.value;
    const passwordValidationElement = document.getElementById('password');
    const checkPassword = passwordValidationElement.value;

    authenticator.init();

    try {
      const results = authenticator.login(checkUsername, checkPassword, userNameValidationElement);
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

if (editForm) {
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // console.log('update button clicked');
  });

  signOutButton.addEventListener('click', (event) => {
    event.preventDefault();
    authenticator.logout();
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
