import React, { Component } from 'react'
import { List, Header, Segment, Loader, Input, Icon, } from 'semantic-ui-react'

import { db } from './firebase'

import _ from 'lodash'

import * as DateUtils from './utils/DateUtils'

import TestAddForm from './TestAddForm'
import TestEditForm from './TestEditForm'
import DeleteConfirmModal from './DeleteConfirmModal'
import TestsMenu from './TestsMenu'
import MarkAddForm from './MarkAddForm'

import { UserContext } from './App'
import { SettingsContext } from './App'
import DeleteButton from './DeleteButton';


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
        filterBy: settings.tests.filterBy ? settings.tests.filterBy : this.state.filterBy,
        groupBy: settings.tests.groupBy ? settings.tests.groupBy : this.state.groupBy,
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

    // update filterBy setting on change in firebase
    if (!_.isEqual(prevState.filterBy, this.state.filterBy)) {
      db.ref(`marks-app/${this.props.user.uid}/settings/tests/filterBy`).update(this.state.filterBy);
    }

    // update groupBy settings on change in firebase
    if (prevState.groupBy !== this.state.groupBy) {
      db.ref(`marks-app/${this.props.user.uid}/settings/tests`).update({groupBy: this.state.groupBy});
    }

    // controll loader
    if (Object.keys(this.state.groupedTests).length !== 0 && this.state.loading) {
      this.setState({ loading: false });
    }

    // set settings from firebase if they exist
    if (this.props.settings !== undefined && this.props.settings !== null) {
      if (prevProps.settings !== this.props.settings && this.props.settings.tests.filterBy !== undefined) {
        this.setState({ filterBy: this.props.settings.tests.filterBy });      
      }
      if (prevProps.settings !== this.props.settings && this.props.settings.tests.groupBy !== undefined) {
        this.setState({ groupBy: this.props.settings.tests.groupBy });      
      }
    }
  }

  handleDelete = (test) => {
    const {
      user,
      subjects,
    } = this.props;
    db.ref(`marks-app/${user.uid}/tests/${test.key}`).remove();
    db.ref(`marks-app/${user.uid}/marks/${test.markId}`).remove();
    subjects.forEach(subject => {
      if (test.subjectId === subject.key) {
        Object.keys(subject.testIds).forEach(testIdKey => {      
          if (test.key === subject.testIds[testIdKey].testId) db.ref(`marks-app/${user.uid}/subjects/${test.subjectId}/testIds/${testIdKey}`).remove();
        })
      }
    })
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
        <TestsMenu handleSearchFilterChange={this.handleSearchFilterChange} showGraded={showGraded} date={date} groupBy={groupBy} handleRangeChange={this.handleRangeChange} handleGradedChange={this.handleGradedChange} handleGroupByChange={this.handleGroupByChange} subjects={subjects} />
        <Segment attached='bottom'>
        <Loader active={loadingTests}/>
        { tests.length === 0 && <div style={{ textAlign: 'center' }}>Look's like you don't have any tests.</div>}
        <List >
          { groupedTests && Object.keys(groupedTests).map((testGroup, i) => {
            return (
              <List.Item key={i}>
                {/* { groupBy === 'dueDate' && <Header size='small' color='red' >{ new Date(Number(testGroup)).toDateString() }</Header> } */}
                { groupBy === 'dueDate' && <Header size='small' color='red' >{ DateUtils.getDayDelta(testGroup) }</Header> }                
                { groupBy === 'subjectInitials' && <Header size='small' color='red' >{ testGroup }</Header> }

                <List divided relaxed size='large'>
                  { tests[0] !== false && groupedTests[testGroup].map((test, i) => <TestItem subjects={subjects} key={i} i={i} test={test} handleDelete={this.handleDelete} />) }
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


const TestItem = ({ test, i, handleDelete, subjects }) =>
  <List.Item key={i}>
    <List.Content floated='left'>
      <Header size='small' content={test.name}/>
      <div style={{marginLeft: '0.3rem', color: 'rgba(0, 0, 0, 0.7)'}}>
        <div style={{fontSize: '1.2rem'}} >{test.subjectInitials}</div>
        <div style={{fontSize: '1.2rem'}}>{ DateUtils.getFormatedDate(test.dueDate) }</div>
        { test.markValue !== undefined && <div style={{fontSize: '1.2rem'}}>Mark: {test.markValue}</div> }        
      </div>
    </List.Content>
    <List.Content floated='right'>
      { !test.markValue ? <MarkAddForm subjects={subjects} tests={[test]} fromTest> <Icon link name='checkmark' /> </MarkAddForm> : <Icon name='checkmark' color='green'/> }
      <TestEditForm subjects={subjects} test={test} > <Icon link name='edit' /> </TestEditForm>
      <DeleteConfirmModal handleConfirm={() => handleDelete(test)} > <Icon link name='trash outline' /> </DeleteConfirmModal>
    </List.Content>
  </List.Item>

export default Tests;