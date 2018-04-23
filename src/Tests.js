import React, { Component } from 'react'
import { List, Header, Segment, Loader, Input, } from 'semantic-ui-react'

import { db } from './firebase'

import _ from 'lodash'

import * as DateUtils from './utils/DateUtils'

import TestAddForm from './TestAddForm'
import DeleteConfirmModal from './DeleteConfirmModal'
import AgendaSubMenu from './AgendaSubMenu'

import { UserContext } from './App'
import { SettingsContext } from './App'


class Tests extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      groupedTests: {},
      groupBy: 'dueDate',
      filterBy: {
        date: 'upcoming',
        search: false,
        subject: false,
        showGraded: false,
      },
    };
  }

  componentDidMount() {
    const { settings } = this.props;
    this.getFilteredTests(this.doFilter);
    if (settings !== undefined && settings !== null && settings.tests !== undefined) {
      this.setState({
        filterBy: settings.tests.filterBy,
        groupBy: settings.tests.groupBy,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(prevState.filterBy);
    // console.log(this.state.filterBy);
    if (prevState.filteredTests !== this.state.filteredTests || prevState.groupBy !== this.state.groupBy) {
      this.getGroupedTests(this.state.groupBy);
    }
    if (!_.isEqual(prevState.filterBy, this.state.filterBy) || prevProps.tests !== this.props.tests) {
      this.getFilteredTests(this.doFilter);
    }

    if (!_.isEqual(prevState.filterBy, this.state.filterBy)) {
      db.ref(`marks-app/${this.props.user.uid}/settings/tests/filterBy`).update(this.state.filterBy);
    }

    if (prevState.groupBy !== this.state.groupBy) {
      db.ref(`marks-app/${this.props.user.uid}/settings/tests`).update({groupBy: this.state.groupBy});
    }

    if (Object.keys(this.state.groupedTests).length !== 0 && this.state.loading) {
      this.setState({ loading: false });
    }

    if (prevProps.settings !== this.props.settings && this.props.settings.tests.filterBy !== undefined && this.props.settings.tests.groupBy) {
      this.setState({ filterBy: this.props.settings.tests.filterBy, groupBy: this.props.settings.tests.groupBy });      
    }
  }

  handleDelete = (id) => {
    db.ref(`marks-app/${this.props.user.uid}/tests/${id}`).remove();
  }

  getFilteredTests = (doFilter) => {
    // alert(1);
    this.setState({
      filteredTests: _.filter(this.props.tests, doFilter)
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
    let oldFilterBy = Object.assign({}, this.state.filterBy);
    oldFilterBy.showGraded = !oldFilterBy.showGraded;
    this.setState({ filterBy: oldFilterBy });
  }

  handleRangeChange = (range) => {
    let oldFilterBy = Object.assign({}, this.state.filterBy);
    oldFilterBy.date = range;
    this.setState({ filterBy: oldFilterBy });
  }

  handleSubjectFilterChange = (e) => {
    let oldFilterBy = Object.assign({}, this.state.filterBy);
    oldFilterBy.subject = e.target.value;
    this.setState({ filterBy: oldFilterBy });
  }

  handleSearchFilterChange = (e) => {
    // Use REGEXP!
    // !!!!!!!!!!!
    let oldFilterBy = Object.assign({}, this.state.filterBy);
    oldFilterBy.search = e.target.value;
    this.setState({ filterBy: oldFilterBy });
  }

  doFilter = (ob) => {
    const {
      filterBy
    } = this.state;
    if (!filterBy.showGraded && ob.markValue) return false;
    else if (filterBy.subject && ob.subjectInitials !== filterBy.subject) return false;
    else if (filterBy.search && ob.name !== filterBy.search) return false;
    else if (filterBy.date !== false && !DateUtils.isInRange(ob, filterBy.date)) return false;
    else return true;
  }

  render() {

    const {
      loading,
      groupedTests,
      groupBy,
      filterBy,
    } = this.state;

    const {
      subjects,
      tests,
      fromAgenda,
      loadingTests,
    } = this.props;

    const {
      showGraded,
      date,
    } = filterBy;

    return (
      <div>
        {/* Input for subject filter (only Fy, Cj, ...), should add a dropdown menu with all the available subjects on the future */}
        {/* <Input type='text' onChange={(e) => this.handleSubjectFilterChange(e)} /> */}
        <AgendaSubMenu handleSearchFilterChange={this.handleSearchFilterChange} showGraded={showGraded} date={date} groupBy={groupBy} handleRangeChange={this.handleRangeChange} handleGradedChange={this.handleGradedChange} handleGroupByChange={this.handleGroupByChange} subjects={subjects} />
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