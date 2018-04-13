import React, { Component } from 'react'
import { List, Header, Segment, Loader, } from 'semantic-ui-react'

import { db } from './firebase'

import _ from 'lodash'

import * as DateUtils from './utils/DateUtils'

import TestAddForm from './TestAddForm'
import DeleteConfirmModal from './DeleteConfirmModal'
import AgendaSubMenu from './AgendaSubMenu'


class Tests extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      groupedTests: {},
      groupBy: 'dueDate',
      filterBy: (o) => { return !o.markValue },
      showGraded: false,
    }
  }

  componentDidMount() {
    this.getFilteredTests(this.state.filterBy);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filteredTests !== this.state.filteredTests || prevState.groupBy !== this.state.groupBy) {
      this.getGroupedTests(this.state.groupBy);
    }
    if (prevState.filterBy !== this.state.filterBy || prevProps.tests !== this.props.tests) {
      this.getFilteredTests(this.state.filterBy);
    }

    if (Object.keys(this.state.groupedTests).length !== 0 && this.state.loading) {
      this.setState({ loading: false });
    }
  }

  handleDelete = (id) => {
    db.ref(`marks-app/tests/${id}`).remove();
  }

  getFilteredTests = (filterBy) => {
    this.setState({
      filteredTests: _.filter(this.props.tests, filterBy)
    });
  }

  getGroupedTests = (groupBy) => {
    this.setState({
      groupedTests: _.groupBy(this.state.filteredTests, groupBy)
    })
  }

  handleGroupByChange = (groupBy) => {
    this.setState({ groupBy });
  }

  handleGradedChange = () => {
    let showGraded = this.state.showGraded;
    this.setState({ showGraded: !showGraded });

    if (!showGraded) {
      this.setState({
        filterBy: (o) => { return true },
      });
    }
    else {
      this.setState({
        filterBy: (o) => { return !o.markValue },
      });
    }

  }

  render() {

    const {
      loading,
      groupedTests,
      groupBy,
      showGraded,
    } = this.state;

    const {
      subjects,
      tests,
      fromAgenda,
      loadingTests,
    } = this.props;

    return (
      <div>
        {/* <TestAddForm subjects={subjects} /> */}
        <AgendaSubMenu showGraded={showGraded} groupBy={groupBy} handleGradedChange={this.handleGradedChange} handleGroupByChange={this.handleGroupByChange} subjects={subjects} />
        <Segment attached='bottom'>
        <Loader active={loadingTests}/>
          {/* { fromAgenda !== true && <AgendaSubMenu subjects={subjects} /> } */}
          <List divided relaxed>
          { groupedTests && Object.keys(groupedTests).map((testGroup, i) => {
            return (
              <List.Item key={i}>
                {/* { groupBy === 'dueDate' && <Header size='small' color='red' >{ new Date(Number(testGroup)).toDateString() }</Header> } */}
                { groupBy === 'dueDate' && <Header size='small' color='red' >{ DateUtils.getDayDelta(testGroup) }</Header> }                
                { groupBy === 'subjectInitials' && <Header size='small' color='red' >{ testGroup }</Header> }
                
                <List  size='large' relaxed>
                  { tests.length !== 0 && groupedTests[testGroup].map((test, i) => <TestItem key={i} i={i} test={test} handleDelete={this.handleDelete} />) }
                </List>
              </List.Item>
            )
          }) }
          </List>
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
      {/* {new Date(test.dueDate).toDateString()} */}
      { DateUtils.getFormatedDate(test.dueDate) }
      { test.markValue !== undefined && <div>Mark: {test.markValue}</div> }        
    </List.Content>
    <List.Content floated='right'>
      <DeleteConfirmModal handleConfirm={() => handleDelete(test.key)} />
    </List.Content>
  </List.Item>

export default Tests;