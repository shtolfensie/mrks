import React, { Component } from 'react'

import TestAddForm from './TestAddForm'


class Tests extends Component {

  render() {

    const {
      subjects,
    } = this.props;

    return (
      <div>
        <TestAddForm subjects={subjects} />
      </div>
    )
  }
}

export default Tests;