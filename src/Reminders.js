import React, { Component } from 'react'
import { List, Header, Segment, Loader, Input, Icon, } from 'semantic-ui-react'

import { db } from './firebase'

import _ from 'lodash'

import * as DateUtils from './utils/DateUtils'

import DeleteConfirmModal from './DeleteConfirmModal'
import RemindersMenu from './RemindersMenu'
import RemindersEditForm from './RemindersEditForm'

import { UserContext } from './App'
import { SettingsContext } from './App'
import DeleteButton from './DeleteButton';


class Reminders extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      groupedReminders: {},
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
    this.getFilteredReminders(this.doFilter);
    if (settings !== undefined && settings !== null && settings.reminders !== undefined) {
      this.setState({
        filterBy: settings.reminders.filterBy ? settings.reminders.filterBy : this.state.filterBy,
        groupBy: settings.reminders.groupBy ? settings.reminders.groupBy : this.state.groupBy,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(prevState.filterBy);
    // console.log(this.state.filterBy);
    if (prevState.filteredReminders !== this.state.filteredReminders || prevState.groupBy !== this.state.groupBy) {
      this.getGroupedReminders(this.state.groupBy);
    }
    if (!_.isEqual(prevState.filterBy, this.state.filterBy) || prevProps.reminders !== this.props.reminders) {
      this.getFilteredReminders(this.doFilter);
    }

    // update filterBy setting on change in firebase
    if (!_.isEqual(prevState.filterBy, this.state.filterBy)) {
      db.ref(`marks-app/${this.props.user.uid}/settings/homework/filterBy`).update(this.state.filterBy);
    }

    // update groupBy settings on change in firebase
    if (prevState.groupBy !== this.state.groupBy) {
      db.ref(`marks-app/${this.props.user.uid}/settings/homework`).update({groupBy: this.state.groupBy});
    }

    // controll loader
    if (Object.keys(this.state.groupedReminders).length !== 0 && this.state.loading) {
      this.setState({ loading: false });
    }

    // set settings from firebase if they exist
    if (this.props.settings !== undefined && this.props.settings.reminders !== undefined) {
      if (prevProps.settings !== this.props.settings && this.props.settings.homework.filterBy !== undefined) {
        this.setState({ filterBy: this.props.settings.homework.filterBy });      
      }
      if (prevProps.settings !== this.props.settings && this.props.settings.homework.groupBy !== undefined) {
        this.setState({ groupBy: this.props.settings.homework.groupBy });      
      }
    }
  }

  handleDelete = (reminder) => {
    const {
      user,
      subjects,
    } = this.props;
    subjects.forEach(subject => {
      if (reminder.subjectId === subject.key) {
        Object.keys(subject.reminderIds).forEach(reminderIdKey => {      
          if (reminder.key === subject.reminderIds[reminderIdKey].reminderId) db.ref(`marks-app/${user.uid}/subjects/${reminder.subjectId}/reminderIds/${reminderIdKey}`).remove();
        })
      }
    })
    db.ref(`marks-app/${user.uid}/reminders/${reminder.key}`).remove();
  }

  getFilteredReminders = (doFilter) => {
    // alert(1);
    this.setState({
      filteredReminders: _.filter(this.props.reminders, doFilter)
    });
    
  }

  getGroupedReminders = (groupBy) => {
    this.setState({
      groupedReminders: _.groupBy(this.state.filteredReminders, groupBy)
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
    else if (filterBy.date !== false && !DateUtils.isInRange(ob, filterBy.date)) {
      if (DateUtils.getDateDelta(ob.dueDate) < 0 && !ob.done) return true;
      return false;
    }
    else return true;
  }

  handleDone = (reminder) => {
    db.ref(`marks-app/${this.props.user.uid}/reminders/${reminder.key}`).update({ done: Date.now().valueOf() });
  }

  render() {

    const {
      loading,
      groupedReminders,
      groupBy,
      filterBy,
    } = this.state;

    const {
      subjects,
      reminders,
      fromAgenda,
      loadingReminders,
    } = this.props;

    const {
      showGraded,
      date,
    } = filterBy;

    return (
      <div style={ fromAgenda ? {} : {margin: '1rem'} }>
        {/* Input for subject filter (only Fy, Cj, ...), should add a dropdown menu with all the available subjects on the future */}
        {/* <Input type='text' onChange={(e) => this.handleSubjectFilterChange(e)} /> */}
        <RemindersMenu handleSearchFilterChange={this.handleSearchFilterChange} date={date} groupBy={groupBy} handleRangeChange={this.handleRangeChange} handleGradedChange={this.handleGradedChange} handleGroupByChange={this.handleGroupByChange} subjects={subjects} />
        <Segment attached='bottom'>
        <Loader active={loadingReminders}/>
        { reminders.length === 0 && <div style={{ textAlign: 'center' }}>Look's like you don't have any reminders.</div>}
        <List >
          { groupedReminders && Object.keys(groupedReminders).map((remindersGroup, i) => {
            return (
              <List.Item key={i}>
                {/* { groupBy === 'dueDate' && <Header size='small' color='red' >{ new Date(Number(testGroup)).toDateString() }</Header> } */}
                { groupBy === 'dueDate' && <Header size='small' color='red' >{ DateUtils.getDayDelta(remindersGroup) }</Header> }                
                { groupBy === 'subjectInitials' && <Header size='small' color='red' >{ remindersGroup }</Header> }

                <List divided relaxed size='large'>
                  { reminders[0] !== false && groupedReminders[remindersGroup].map((reminder, i) => <ReminderItem subjects={subjects} key={i} i={i} reminder={reminder} handleDelete={this.handleDelete} handleDone={this.handleDone}/>) }
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


const styles = {
  ReminderItemHeaderDone: {color: 'green', textDecoration: 'line-through'},
  ReminderItemHeaderOverdue : {color: 'red'}
}


const ReminderItem = ({ reminder, i, handleDelete, handleDone, subjects }) =>
  <List.Item key={i}>
    <List.Content floated='left'>
      <Header size='small' content={reminder.name} style={reminder.done ? styles.ReminderItemHeaderDone : DateUtils.getDateDelta(reminder.dueDate) < 0 ? styles.ReminderItemHeaderOverdue : {} }/>
      <div style={{marginLeft: '0.3rem', color: 'rgba(0, 0, 0, 0.7)'}}>
        <div style={{fontSize: '1.2rem'}} >{reminder.subjectInitials}</div>
        <div style={{fontSize: '1.2rem'}}>{ DateUtils.getFormatedDate(reminder.dueDate) }</div>
        {/* { homework.markValue !== undefined && <div style={{fontSize: '1.2rem'}}>Mark: {homework.markValue}</div> }         */}
      </div>
    </List.Content>
    <List.Content floated='right'>
      {/* { !homework.markValue ? <MarkAddForm subjects={subjects} tests={[test]} fromTest> <Icon link name='checkmark' /> </MarkAddForm> : <Icon name='checkmark' color='green'/> } */}
      <Icon link name='checkmark' onClick={() => handleDone(reminder)}/>
      <RemindersEditForm subjects={subjects} reminder={reminder} > <Icon link name='edit' /> </RemindersEditForm>
      <DeleteConfirmModal handleConfirm={() => handleDelete(reminder)} > <Icon link name='trash outline' /> </DeleteConfirmModal>
    </List.Content>
  </List.Item>

export default Reminders;

export {
  ReminderItem,
  styles
};