import React, { Component } from 'react';
import ReactCalendar from 'react-calendar';

import './Calendar.css'

class Calendar extends Component {
  state = {
    date: new Date(),
  }

  onChange = date => this.setState({ date })

  render() {
    return (
      <ReactCalendar
        onChange={this.onChange}
        value={this.state.date}
        // tileContent={({ date, view }) => view === 'month' && date.getDay() === 0 ? <p>It's Sunday!</p> : null}
        tileClassName={({ date, view }) => view === 'month' && date.valueOf() === new Date().setHours(0,0,0,0) ? 'currentDay' : null}
      />
    );
  }
}

export default Calendar;