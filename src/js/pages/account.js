import { getParam, loadHeaderFooter } from '../classes/Utils.mjs';
import Authenticator from '../classes/Authenticator.mjs';

loadHeaderFooter();

const authenticator = new Authenticator();
await authenticator.init();

if (!authenticator.isAuthenticated) {
  window.location.replace('./index.html');
}

const signInForm = document.getElementById('sign-in-form');
const editForm = document.getElementById('edit-form');
const signOutButton = document.getElementById('sign-out');
const registerForm = document.getElementById('register-form');

/* We've come to the index page */
if (signInForm) {
  // Check if the user is already authenticated. If so, take to account
  await authenticator.init();
  if (authenticator.isAuthenticated()) {
    window.location.replace('./edit.html');
  }

  // Reset validations when altering username field
  const usernameElement = document.getElementById('username');
  usernameElement.addEventListener('input', () => {
    usernameElement.setCustomValidity('');
    usernameElement.reportValidity();
  });

  // Reset username validations when altering password field
  const passwordElement = document.getElementById('password');
  passwordElement.addEventListener('input', () => {
    usernameElement.setCustomValidity('');
    usernameElement.reportValidity();
  });

  // Submit a sign-in request
  signInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userNameValidationElement = document.getElementById('username');
    const checkUsername = userNameValidationElement.value;
    const passwordValidationElement = document.getElementById('password');
    const checkPassword = passwordValidationElement.value;
    const accountText = document.getElementById('accountButton');

    try {
      const results = authenticator.login(
        checkUsername,
        checkPassword,
        userNameValidationElement,
        accountText,
      );
      if (results) {
        signInForm.classList.add('hide');
        document.getElementById('success').classList.remove('hide');
        const name = document.getElementById('personal-name');
        name.textContent = authenticator.getLoggedInName();

        // Handle redirects
        const refPage = getParam('refpage');
        if (refPage) {
          switch (refPage) {
            case 'schedule':
              window.location.replace('../schedule/index.html');
              break;
          }
        }
      }
    } catch (error) {
      // Eat the error
    }
  });
}

/* We've come to the account edit page */
if (editForm) {
  const usernameElement = document.getElementById('username');
  const passwordElement = document.getElementById('password');
  const confirmPasswordElement = document.getElementById('confirm-password');
  const nameElement = document.getElementById('name');
  const emailElement = document.getElementById('email');

  await authenticator.init();
  /* Shouldn't get here, but just in case... */
  if (!authenticator.isAuthenticated()) {
    window.location.replace('./index.html');
  }

  /* Preload form with user information */
  const users = authenticator.users;
  const loggedInUser = await authenticator.loginUsername();
  const thisUser = users.find((user) => user.username === loggedInUser);
  usernameElement.value = thisUser.username;
  nameElement.value = thisUser.name;
  emailElement.value = thisUser.email;

  // Reset validations on changes
  passwordElement.addEventListener('input', () => {
    passwordElement.setCustomValidity('');
    passwordElement.reportValidity();
  });
  /* Can't change the username here */
  usernameElement.readOnly = true;

  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (passwordElement.value !== confirmPasswordElement.value) {
      passwordElement.setCustomValidity(`Passwords don't match!`);
      passwordElement.reportValidity();
    } else {
      const username = authenticator.updateUser(
        usernameElement,
        passwordElement,
        confirmPasswordElement,
        nameElement,
        emailElement,
      );

      alert(`User ${username} successfully updated!`);
    }
  });

  signOutButton.addEventListener('click', (event) => {
    event.preventDefault();
    authenticator.logout();
  });
}

/* We've come to the new user sign up page */
if (registerForm) {
  // Clear validation errors on change
  const passwordElement = document.getElementById('new-password');
  passwordElement.addEventListener('input', () => {
    passwordElement.setCustomValidity('');
    passwordElement.reportValidity();
  });

  // Clear validation errors on change
  const usernameElement = document.getElementById('new-username');
  usernameElement.addEventListener('input', () => {
    usernameElement.setCustomValidity('');
    usernameElement.reportValidity();
  });

  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('new-username');
    const password = document.getElementById('new-password');
    const confirmPassword = document.getElementById('new-confirm-password');
    const name = document.getElementById('new-name');
    const email = document.getElementById('new-email');

    const result = authenticator.registerUser(
      username,
      password,
      confirmPassword,
      name,
      email,
    );

    if (result) {
      window.location.replace('./index.html');
    }
  });
}
