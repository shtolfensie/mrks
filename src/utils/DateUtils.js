import moment from 'moment'
import 'moment/locale/cs'
import { toASCII } from 'punycode';

moment.locale('en'); // this changes the date local for the entire app


export const getDuedate = (dateText) => {
  let d = new Date();
  d.setHours(0,0,0,0);
  if (dateText === 'today') return d.valueOf()
  else if (dateText === 'tomorrow') return  d.setDate(d.getDate() + 1)
  else if (dateText === 'nextWeek') return d.setDate(d.getDate() + 7)
}

export const getDateDelta = (dueDate) => {
  let d = moment(Number(dueDate));
  let today = moment().format('MM-DD-YYYY');
  let diff = d.diff(today, 'days');

  return diff;
}

export const getDayDelta = (dueDate) => {
  let d = moment(Number(dueDate));
  let today = moment().format('MM-DD-YYYY');
  let diff = d.diff(today, 'days');

  if (diff === 0) return 'Today';
  else if (diff === 1) return 'Tomorrow';
  else if (diff === 7) return 'Next Week'
  else if (diff === -1) return `${Math.abs(diff)} day ago`;
  else if (diff < 0) return `${Math.abs(diff)} days ago`;
  else return `Due in ${diff} days`
}

export const getFormatedDate = (date) => {
  // console.log( moment.locale() );
  
  return moment(Number(date)).format('dddd, D. M. YYYY')
}

export const isInRange = (ob, range) => {
  let d = moment(Number(ob.dueDate));
  let today = moment().format('MM-DD-YYYY');
  
  if (range === 'today' && d.diff(today, 'days') === 0) return true;
  else if (range === 'tomorrow' && d.diff(today, 'days') === 1) return true;
  else if (range === 'week' && d.diff(today, 'weeks') === 0) return true;
  else if (range === 'month' && d.diff(today, 'months') === 0) return true;
  else if (range === 'upcoming' && d.diff(today, 'days') >= 0 && (d.diff(today, 'days') !== 0 || moment().hour() < 17 || ob.type !== 'test')) return true; // don't display today's test in upcoming if it's 5pm or later
  else if (range === 'previous2weeks' && d.diff(today, 'days') <= 0 && d.diff(today, 'days') >= -14) return true;
  else return false; 
}

export const getDayDeltaName = (dueDate) => {
  let d = moment(Number(dueDate));
  let today = moment().format('MM-DD-YYYY');
  let diff = d.diff(today, 'days');

  if (diff <= 5 && diff >= 0) return d.format('dddd')
  else return getFormatedDate(d)
}


// long form version of upcoming filter
// else if (range === 'upcoming' && d.diff(today, 'days') >= 0) {
//   if (d.diff(today, 'days') === 0 && moment().hour() > 12) return false;
//   else return true;
//  }