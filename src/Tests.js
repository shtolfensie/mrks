import React, { Component } from 'react'
import { List, } from 'semantic-ui-react'

import { db } from './firebase'

import TestAddForm from './TestAddForm'
import DeleteConfirmModal from './DeleteConfirmModal'
import AgendaSubMenu from './AgendaSubMenu'


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
      fromAgenda,
    } = this.props;

    return (
      <div>
        {/* <TestAddForm subjects={subjects} /> */}
        { fromAgenda !== true && <AgendaSubMenu subjects={subjects} /> }
        <List divided size='large' relaxed='very'>
          { tests.length !== 0 && tests.map((test, i) => <TestItem key={i} i={i} test={test} handleDelete={this.handleDelete} />) }
        </List>
      </div>
    )
  }
}


const TestItem = ({ test, i, handleDelete }) =>
  <List.Item key={i} >
    <List.Content floated='left'>
      <List.Header content={test.name}/>
      <List.Description content={test.subjectInitials}/>
      {new Date(test.dueDate).toDateString()}
    </List.Content>
    <List.Content floated='right'>
      <DeleteConfirmModal handleConfirm={() => handleDelete(test.key)} />
    </List.Content>
  </List.Item>

export default Tests;