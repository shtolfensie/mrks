import React, { Component } from 'react'

import _ from 'lodash'

import { db } from './firebase'

import * as DateUtils from './utils/DateUtils'

import { Segment, List, Header, } from 'semantic-ui-react'

import { TestItem } from './Tests'
import { HomeworkItem } from './Homework'
import { ReminderItem, styles } from './Reminders'



class Today extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredTests: null,
      groupedTests: null,
    }
  }

  componentDidMount() {
    this.getFilteredTests(this.doFilter);
    this.getFilteredHomework(this.doFilter);
    this.getFilteredReminders(this.doFilter);
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

    if (prevState.filteredHomework !== this.state.filteredHomework || prevState.groupBy !== this.state.groupBy) {
      this.getGroupedHomework(this.state.groupBy);
    }
    if (!_.isEqual(prevState.filterBy, this.state.filterBy) || prevProps.homework !== this.props.homework) {
      this.getFilteredHomework(this.doFilter);
    }

    if (prevState.filteredReminders !== this.state.filteredReminders || prevState.groupBy !== this.state.groupBy) {
      this.getGroupedReminders(this.state.groupBy);
    }
    if (!_.isEqual(prevState.filterBy, this.state.filterBy) || prevProps.reminders !== this.props.reminders) {
      this.getFilteredReminders(this.doFilter);
    }
  }

  // TESTS
  getFilteredTests = () => {
    this.setState({
      filteredTests: _.filter(this.props.tests, this.doFilter)
    });
  }

  getGroupedTests = () => {
    this.setState({
      groupedTests: _.groupBy(this.state.filteredTests, 'subjectInitials')
    })
  }

  // HOMEWORK
  getFilteredHomework = (doFilter) => {
    this.setState({
      filteredHomework: _.filter(this.props.homework, doFilter)
    });
    
  }

  getGroupedHomework = (groupBy) => {
    this.setState({
      groupedHomework: _.groupBy(this.state.filteredHomework, 'subjectInitials')
    })
  }

  // REMINDERS
  getFilteredReminders = (doFilter) => {
    this.setState({
      filteredReminders: _.filter(this.props.reminders, doFilter)
    });
    
  }

  getGroupedReminders = (groupBy) => {
    this.setState({
      groupedReminders: _.groupBy(this.state.filteredReminders, 'subjectInitials')
    })
  }

  handleDone = (reminder) => {
    db.ref(`marks-app/${this.props.user.uid}/reminders/${reminder.key}`).update({ done: Date.now().valueOf() });
  }

  doFilter = (ob) => {
    if (!DateUtils.isInRange(ob, 'today')) {
      if (ob.type === 'reminder' && DateUtils.getDateDelta(ob.dueDate) < 0 && !ob.done) return true;
      return false;
    }
    else return true;
  }

  handleDeleteTest = (test) => {
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

  handleDeleteHomework = (homework) => {
    const {
      user,
      subjects,
    } = this.props;
    db.ref(`marks-app/${user.uid}/homework/${homework.key}`).remove();
    subjects.forEach(subject => {
      if (homework.subjectId === subject.key) {
        Object.keys(subject.homeworkIds).forEach(homeworkIdKey => {      
          if (homework.key === subject.homeworkIds[homeworkIdKey].homeworkId) db.ref(`marks-app/${user.uid}/subjects/${homework.subjectId}/homeworkIds/${homeworkIdKey}`).remove();
        })
      }
    })
  }

  handleDeleteReminder = (reminder) => {
    const {
      user,
      subjects,
    } = this.props;
    db.ref(`marks-app/${user.uid}/reminders/${reminder.key}`).remove();
    subjects.forEach(subject => {
      if (reminder.subjectId === subject.key) {
        Object.keys(subject.reminderIds).forEach(reminderIdKey => {      
          if (reminder.key === subject.reminderIds[reminderIdKey].reminderId) db.ref(`marks-app/${user.uid}/subjects/${reminder.subjectId}/reminderIds/${reminderIdKey}`).remove();
        })
      }
    })
  }

  render() {

    const {
      subjects,
      tests, 
    } = this.props;

    const {
      filteredTests,
      groupedTests,
      groupedHomework,
      groupedReminders,
    } = this.state;
    
    return (
      <div>
        <Header content="Today's agenda" attached='top' size='large' />
        <Segment attached='bottom'>
          { _.isEmpty(groupedTests) ? _.isEmpty(groupedHomework) ? _.isEmpty(groupedReminders) ? <div style={{ textAlign: 'center' }}>There are no events for today.</div> : null : null : null }
          <List>
            {!_.isEmpty(groupedTests) && <List.Header content='Tests' />}
            { groupedTests && Object.keys(groupedTests).map((testGroup, i) => {
              return (
                <List.Item key={i}>
                  <List>
                    <Header size='small' color='red' >{ testGroup }</Header>
                    {tests[0] !== false && groupedTests[testGroup].map((test, i) => <TestItem subjects={subjects} key={i} i={i} test={test} handleDelete={this.handleDeleteTest} />)}
                  </List>
                </List.Item>
              )
            })}
          </List>
          <List>
            {!_.isEmpty(groupedHomework) && <List.Header content='Homework' />}
            { groupedHomework && Object.keys(groupedHomework).map((homeworkGroup, i) => {
              return (
                <List.Item key={i}>
                  <List>
                    <Header size='small' color='red' >{ homeworkGroup }</Header>
                    { groupedHomework && groupedHomework[homeworkGroup].map((homework, i) => <HomeworkItem subjects={subjects} key={i} i={i} homework={homework} handleDelete={this.handleDeleteHomework} />)}
                  </List>
                </List.Item>
              )
            })}
          </List>
          <List>
            {!_.isEmpty(groupedReminders) && <List.Header content='Reminders' />}
            { groupedReminders && Object.keys(groupedReminders).map((remindersGroup, i) => {
              return (
                <List.Item key={i}>
                  <List>
                    <Header size='small' color='red' >{ remindersGroup }</Header>
                    { groupedReminders && groupedReminders[remindersGroup].map((reminder, i) => <ReminderItem subjects={subjects} key={i} i={i} reminder={reminder} handleDelete={this.handleDeleteReminder} handleDone={this.handleDone}/>)}
                  </List>
                </List.Item>
              )
            })}
          </List>
        </Segment>
      </div>
    )
  }
}


export default Today;