import React, { Component } from 'react'
import { List, } from 'semantic-ui-react'

import { db } from './firebase'

import TestAddForm from './TestAddForm'


class Tests extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {

    const {
      subjects,
      tests,
    } = this.props;

    return (
      <div>
        <TestAddForm subjects={subjects} />
        <List divided size='large' relaxed='very'>
          { tests.length !== 0 && tests.map((test, i) => <List.Item key={i} ><List.Content><List.Header content={test.name}/><List.Description content={test.subjectInitials}/>{test.dueDate}</List.Content></List.Item>) }
        </List>
      </div>
    )
  }
}

export default Tests;