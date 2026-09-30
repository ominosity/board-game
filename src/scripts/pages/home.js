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

