import { loadHeaderFooter } from '../classes/Utils.mjs';
import { getLocalStorage } from '../classes/DataSource.mjs';
import {
  loadAvailabilityToForm,
  generateAndSendAppointment,
} from '../classes/Appointments.mjs';

loadHeaderFooter();

// Check if there is already a signed-in user with an appointment
const currentUser = getLocalStorage('BCGamesCurrentUser');
if (currentUser) {
  const currentAppointment = getLocalStorage(`BCGamesSchedule - ${currentUser.username}`);

  if (currentAppointment) {
    showConfirmation(new Date());
  }
}
const section = document.getElementById('schedule');
loadAvailabilityToForm(section);

// Post the current local date and time
const current = document.getElementById('current-date-time-zone');
const now = new Date();
current.textContent = now;

/* Set up event listener for the form */
const form = document.getElementById('pick-a-game-night');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get the chosen schedule item
  const scheduleID = document.getElementById('schedule').value;

  // Make sure the user is signed in. If not, redirect to sign-in page
  const user = getLocalStorage('BCGamesCurrentUser');
  if (user) {
    const senderName = user.name;
    const senderEmail = user.email;
    const username = user.username;

    generateAndSendAppointment(scheduleID, senderName, senderEmail, username);
  } else {
    window.location.href = '../account/index.html?refpage=schedule';
  }
});

/* Hide the scheduler and show appointment confirmation */
export function showConfirmation(startTime) {
  let determinedStartTime;
  // First check if current user has an appointment. If so, reuse it.
  const functionUser = getLocalStorage('BCGamesCurrentUser');
  if (functionUser) {
    const functionAppointment = getLocalStorage(`BCGamesSchedule - ${functionUser.username}`);
    if (functionAppointment) {
      determinedStartTime = new Date(functionAppointment.appStart);
    } else {
      determinedStartTime = new Date(startTime);
    }
  }
  const formElement = document.getElementById('pick-a-game-night');
  const confirmation = document.getElementById('confirmation');
  const startTimeElement = document.getElementById('start-time');
  formElement.classList.add('hide');
  confirmation.classList.remove('hide');
  startTimeElement.textContent = determinedStartTime;
}
