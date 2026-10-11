import { loadHeaderFooter } from '../classes/Utils.mjs';
import { getAvailability } from '../classes/DataSource.mjs';

loadHeaderFooter();

const section = document.getElementById('schedule');
getAvailability(section);

const current = document.getElementById('current-date-time-zone');

const now = new Date();
current.textContent = now;