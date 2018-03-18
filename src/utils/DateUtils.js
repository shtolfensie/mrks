


export const getDuedate = (dateText) => {
  let d = new Date();
  d.setHours(0,0,0,0);
  if (dateText === 'today') return d.valueOf()
  else if (dateText === 'tomorrow') return  d.setDate(d.getDate() + 1)
  else if (dateText === 'nextWeek') return d.setDate(d.getDate() + 7)
}