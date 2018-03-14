import React, { Component } from 'react'
import { List, } from 'semantic-ui-react'

import { db } from './firebase'

import TestAddForm from './TestAddForm'
import DeleteConfirmModal from './DeleteConfirmModal'


class Tests extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  handleDelete = (id) => {
    db.ref(`marks-app/tests/${id}`).remove();
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
          { tests.length !== 0 && tests.map((test, i) => <List.Item key={i} ><List.Content><List.Header content={test.name}/><List.Description content={test.subjectInitials}/>{test.dueDate}<DeleteConfirmModal handleConfirm={() => this.handleDelete(test.key)} /> </List.Content></List.Item>) }
        </List>
      </div>
    )
  }
}

export default Tests;