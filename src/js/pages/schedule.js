import { loadHeaderFooter } from '../classes/Utils.mjs';
import { getAvailability } from '../classes/DataSource.mjs';

loadHeaderFooter();

const section = document.getElementById('schedule');
getAvailability(section);
