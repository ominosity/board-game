import { setLocalStorage } from './DataSource.mjs';
import DataSource from './DataSource.mjs';
import { showConfirmation } from '../pages/schedule';

/* Gets availability data from local data source and loads it to the given parent element */
export async function loadAvailabilityToForm(parentElement) {
  const dataSource = new DataSource('/json/availability.json', 'Availability');
  const results = await dataSource.init();

  // Limit appointments to the next 3 weeks of available dates 
  const futureValues = results.filter(date => new Date(date.start) >= new Date() && new Date(date.start) <= new Date().setDate(new Date().getDate() + 22));

  // For now, just iterate through the available dates and output to the parent element. We'll
  // work on the rest of the functionality later 
  futureValues.forEach(slot => {
    const option = document.createElement('option');
    // Parse out dates and times to display 
    const startDateTime = new Date(slot.start);
    const endDateTime = new Date(slot.end);

    let month = startDateTime.getMonth() + 1;
    month = month.toString().padStart(2, '0');
    const day = startDateTime.getDate().toString().padStart(2, '0');
    const year = startDateTime.getFullYear().toString().padStart(2, '0');

    let startHour = startDateTime.getHours();
    const startAmPm = startHour >= 12 ? 'pm' : 'am';
    startHour = `${startHour % 12 || 12}`;
    startHour = startHour.toString().padStart(2, '0');
    const startMinute = startDateTime.getMinutes().toString().padStart(2, '0');

    let endHour = endDateTime.getHours();
    const endAmPm = endHour > 12 ? 'pm' : 'am';
    endHour = `${endHour % 12 || 12}`;
    endHour = endHour.toString().padStart(2, '0');
    const endMinute = endDateTime.getMinutes().toString().padStart(2, '0');

    // Put it all together
    const formattedValue = `${slot.available ? '' : 'x '}${month}/${day}/${year} - ${startHour}:${startMinute}${startAmPm} to ${endHour}:${endMinute}${endAmPm} ${slot.available ? '' : 'x'}`;

    option.innerHTML = formattedValue;
    option.value = slot.id;

    if (!slot.available) {
      option.disabled = true;
    }

    parentElement.appendChild(option);
  })
}

/* Gets details about an available date from the availability data source */
export async function generateAndSendAppointment(id, name, email, username) {
  const dataSource = new DataSource('/json/availability.json', 'Availability');
  const results = await dataSource.init();
  const appointment = results.find(app => Number(app.id) === Number(id));

  // Convert UTC start time to local date and time
  const startDate = new Date(appointment.start);
  const startTime = startDate.toLocaleString("en-US",
    {
      timeZone: "America/Los_Angeles",
      timeZoneName: "short"
    }
  );

  // Convert UTC end time to local date and time
  const endDate = new Date(appointment.end);
  const endTime = endDate.toLocaleString("en-US",
    {
      timeZone: "America/Los_Angeles",
      timeZoneName: "short"
    }
  );

  // Store appointment in local storage 
  const key = `BCGamesSchedule - ${username}`;
  const value = {
    appStart: startDate,
    appEnd: endDate
  }
  setLocalStorage(key, JSON.stringify(value));

  // Generate email for user to send
  const subject = encodeURIComponent('Game Night Reservation');
  const body = `Dear Burgener Chalet,
      
      We are very interested in reserving a game night for:
           ${startTime} to ${endTime}
      
      We will see you then!
      
      Yours Truly,
      ${name}
      ${email}`;

  const encodedBody = encodeURIComponent(body);
  const mailLink = `mailto:ominosity@msn.com?subject=${subject}&body=${encodedBody}`

  // Update page with confirmation before handing off to email
  showConfirmation(startDate);

  // Fire off the user's default mail client with the details
  window.location.href = mailLink;
}