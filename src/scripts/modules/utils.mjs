/* Load the header and footer sections on all pages, along with the event listeners
   for the hamburger elements on small screens */
export async function LoadHeaderFooter() {
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
}

/* Load HTML templates from a given path (for partial HTML files) */
async function loadTemplate(path) {
    const response = await fetch(path);
    return await response.text();
}