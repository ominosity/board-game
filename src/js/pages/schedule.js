import { loadHeaderFooter } from '../classes/Utils.mjs';
import { getAvailability, generateAndSendAppointment } from '../classes/DataSource.mjs';

loadHeaderFooter();

const section = document.getElementById('schedule');
getAvailability(section);

const current = document.getElementById('current-date-time-zone');
const now = new Date();
current.textContent = now;

const form = document.getElementById('pick-a-game-night');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Get the chosen value
  const scheduleID = document.getElementById('schedule').value;

  const sender = '';
  const senderEmail = '';

  generateAndSendAppointment(scheduleID, sender, senderEmail);
});