import React, { Component } from 'react'
import { List, Header, Segment, Loader, Input, Icon, } from 'semantic-ui-react'

import { db } from './firebase'

import _ from 'lodash'

import * as DateUtils from './utils/DateUtils'

import DeleteConfirmModal from './DeleteConfirmModal'
import HomeworkMenu from './HomeworkMenu'
import HomeworkEditForm from './HomeworkEditForm'

import { UserContext } from './App'
import { SettingsContext } from './App'
import DeleteButton from './DeleteButton';


class Homework extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      groupedHomework: {},
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
    this.getFilteredHomework(this.doFilter);
    if (settings !== undefined && settings !== null && settings.homework !== undefined) {
      this.setState({
        filterBy: settings.homework.filterBy ? settings.homework.filterBy : this.state.filterBy,
        groupBy: settings.homework.groupBy ? settings.homework.groupBy : this.state.groupBy,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(prevState.filterBy);
    // console.log(this.state.filterBy);
    if (prevState.filteredHomework !== this.state.filteredHomework || prevState.groupBy !== this.state.groupBy) {
      this.getGroupedHomework(this.state.groupBy);
    }
    if (!_.isEqual(prevState.filterBy, this.state.filterBy) || prevProps.homework !== this.props.homework) {
      this.getFilteredHomework(this.doFilter);
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
    if (Object.keys(this.state.groupedHomework).length !== 0 && this.state.loading) {
      this.setState({ loading: false });
    }

    // set settings from firebase if they exist
    if (this.props.settings !== undefined && this.props.settings) {
      if (prevProps.settings !== this.props.settings && this.props.settings.homework.filterBy !== undefined) {
        this.setState({ filterBy: this.props.settings.homework.filterBy });      
      }
      if (prevProps.settings !== this.props.settings && this.props.settings.homework.groupBy !== undefined) {
        this.setState({ groupBy: this.props.settings.homework.groupBy });      
      }
    }
  }

  handleDelete = (homework) => {
    const {
      user,
      subjects,
    } = this.props;
    subjects.forEach(subject => {
      if (homework.subjectId === subject.key) {
        Object.keys(subject.homeworkIds).forEach(homeworkIdKey => {      
          if (homework.key === subject.homeworkIds[homeworkIdKey].homeworkId) db.ref(`marks-app/${user.uid}/subjects/${homework.subjectId}/homeworkIds/${homeworkIdKey}`).remove();
        })
      }
    })
    db.ref(`marks-app/${user.uid}/homework/${homework.key}`).remove();    
  }

  getFilteredHomework = (doFilter) => {
    // alert(1);
    this.setState({
      filteredHomework: _.filter(this.props.homework, doFilter)
    });
    
  }

  getGroupedHomework = (groupBy) => {
    this.setState({
      groupedHomework: _.groupBy(this.state.filteredHomework, groupBy)
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
      groupedHomework,
      groupBy,
      filterBy,
    } = this.state;

    const {
      subjects,
      homework,
      fromAgenda,
      loadingHomework,
    } = this.props;

    const {
      showGraded,
      date,
    } = filterBy;

    return (
      <div style={ fromAgenda ? {} : {margin: '1rem'} }>
        {/* Input for subject filter (only Fy, Cj, ...), should add a dropdown menu with all the available subjects on the future */}
        {/* <Input type='text' onChange={(e) => this.handleSubjectFilterChange(e)} /> */}
        <HomeworkMenu handleSearchFilterChange={this.handleSearchFilterChange} date={date} groupBy={groupBy} handleRangeChange={this.handleRangeChange} handleGradedChange={this.handleGradedChange} handleGroupByChange={this.handleGroupByChange} subjects={subjects} />
        <Segment attached='bottom'>
        <Loader active={loadingHomework}/>
        { homework.length === 0 && <div style={{ textAlign: 'center' }}>Look's like you don't have any homework.</div>}
        <List >
          { groupedHomework && Object.keys(groupedHomework).map((homeworkGroup, i) => {
            return (
              <List.Item key={i}>
                {/* { groupBy === 'dueDate' && <Header size='small' color='red' >{ new Date(Number(testGroup)).toDateString() }</Header> } */}
                { groupBy === 'dueDate' && <Header size='small' color='red' >{ DateUtils.getDayDelta(homeworkGroup) }</Header> }                
                { groupBy === 'subjectInitials' && <Header size='small' color='red' >{ homeworkGroup }</Header> }

                <List divided relaxed size='large'>
                  { homework[0] !== false && groupedHomework[homeworkGroup].map((homework, i) => <HomeworkItem subjects={subjects} key={i} i={i} homework={homework} handleDelete={this.handleDelete} />) }
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


const HomeworkItem = ({ homework, i, handleDelete, subjects }) =>
  <List.Item key={i}>
    <List.Content floated='left'>
      <Header size='small' content={homework.name}/>
      <div style={{marginLeft: '0.3rem', color: 'rgba(0, 0, 0, 0.7)'}}>
        <div style={{fontSize: '1.2rem'}} >{homework.subjectInitials}</div>
        <div style={{fontSize: '1.2rem'}}>{ DateUtils.getFormatedDate(homework.dueDate) }</div>
        {/* { homework.markValue !== undefined && <div style={{fontSize: '1.2rem'}}>Mark: {homework.markValue}</div> }         */}
      </div>
    </List.Content>
    <List.Content floated='right'>
      {/* { !homework.markValue ? <MarkAddForm subjects={subjects} tests={[test]} fromTest> <Icon link name='checkmark' /> </MarkAddForm> : <Icon name='checkmark' color='green'/> } */}
      <HomeworkEditForm subjects={subjects} homework={homework} > <Icon link name='edit' /> </HomeworkEditForm>
      <DeleteConfirmModal handleConfirm={() => handleDelete(homework)} > <Icon link name='trash outline' /> </DeleteConfirmModal>
    </List.Content>
  </List.Item>

export default Homework;