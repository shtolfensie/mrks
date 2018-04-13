import moment from 'moment'
import 'moment/locale/cs'

moment.locale('cs');


export const getDuedate = (dateText) => {
  let d = new Date();
  d.setHours(0,0,0,0);
  if (dateText === 'today') return d.valueOf()
  else if (dateText === 'tomorrow') return  d.setDate(d.getDate() + 1)
  else if (dateText === 'nextWeek') return d.setDate(d.getDate() + 7)
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