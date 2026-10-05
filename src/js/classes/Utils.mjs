import ExternalSource from './ExternalSource';
import Authenticator from './Authenticator.mjs';

/* Load the header and footer sections on all pages, along with the event listeners
   for the hamburger elements on small screens */
export async function loadHeaderFooter() {
  const headerElement = document.querySelector('header');
  const footerElement = document.querySelector('footer');

  const header = await loadTemplate('/partials/header.html');
  const footer = await loadTemplate('/partials/footer.html');

  headerElement.innerHTML = header;
  footerElement.innerHTML = footer;

  const hamburger = document.getElementById('hamburger');
  const circleX = document.getElementById('circle-x')
  const nav = document.querySelector('nav');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('show');
    hamburger.classList.toggle('show');
    circleX.classList.toggle('show');
  });

  circleX.addEventListener('click', () => {
    nav.classList.toggle('show');
    hamburger.classList.toggle('show');
    circleX.classList.toggle('show');
  });

  /* Get a joke and output it to the console */
  const options = {
    headers: {
      "Accept": "application/json"
    }
  };
  const jokeFactory = new ExternalSource('https://icanhazdadjoke.com/', options);
  const joke = await jokeFactory.init();
  const jokeElement = document.getElementById('jokeBox');
  jokeElement.innerText = joke['joke'];

  /* Check if the user is signed in. If not, change Account button to Login */
  const authenticator = new Authenticator();
  authenticator.init();
  const accountText = document.getElementById('accountButton');
  if (!authenticator.isAuthenticated) {
    accountText.textContent = 'Login';
  } else {
    accountText.textContent = 'Account';
    accountText.setAttribute('href', '/account/edit.html');
  }
}

/* Load HTML templates from a given path (for partial HTML files) */
async function loadTemplate(path) {
  const response = await fetch(path);
  return await response.text();
}

/* Convert a given respons to JSON format, if possible */
export async function convertToJson(response) {
  if (response.ok) {
    return response.json();
  }
  const errorResponse = await response.json().catch(() => ({ error: 'Bad Response' }));
  throw { name: 'servicesError', message: errorResponse };
}

/* Add the given template as child to the parent element */
export function applyTemplate(parentElement, template, clear = true) {
  if (!parentElement || !template) {
    return;
  } else {
    const clone = template.content.cloneNode(true);

    if (clear) {
      parentElement.innerHTML = '';
    }
    parentElement.appendChild(clone);
  }
}

export async function xmlToXmlDoc(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');

  return xmlDoc;
}