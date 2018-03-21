import React, { Component } from 'react'
import { List, Header, Segment, } from 'semantic-ui-react'

import { db } from './firebase'

import _ from 'lodash'

import TestAddForm from './TestAddForm'
import DeleteConfirmModal from './DeleteConfirmModal'
import AgendaSubMenu from './AgendaSubMenu'


class Tests extends Component {

  constructor(props) {
    super(props);

    this.state = {
      groupedTests: [],
      groupBy: 'dueDate',
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tests !== this.props.tests || prevState.groupBy !== this.state.groupBy) {
      this.getGroupedTests(this.state.groupBy)
    }
  }

  handleDelete = (id) => {
    db.ref(`marks-app/tests/${id}`).remove();
  }

  getGroupedTests = (groupBy) => {
    this.setState({
      groupedTests: _.groupBy(this.props.tests, groupBy)
    })
  }

  render() {

    const {
      groupedTests,
    } = this.state;

    const {
      subjects,
      tests,
      fromAgenda,
    } = this.props;

    return (
      <div>
        {/* <TestAddForm subjects={subjects} /> */}
        <AgendaSubMenu subjects={subjects} />
        <Segment attached='bottom'>
          {/* { fromAgenda !== true && <AgendaSubMenu subjects={subjects} /> } */}
          { Object.keys(groupedTests).map((testGroup, i) => {
            return (
              <div key={i}>
                <Header size='medium' color='red' >{ new Date(Number(testGroup)).toDateString()}</Header>
                <List divided size='large' relaxed='very'>
                  { tests.length !== 0 && groupedTests[testGroup].map((test, i) => <TestItem key={i} i={i} test={test} handleDelete={this.handleDelete} />) }
                </List>
              </div>
            )
          }) }
        </Segment>

      </div>
    )
  }
}

{/* <List divided size='large' relaxed='very'>
  { tests.length !== 0 && tests.map((test, i) => <TestItem key={i} i={i} test={test} handleDelete={this.handleDelete} />) }
</List> */}


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