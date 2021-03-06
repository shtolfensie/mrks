import React, { Component } from 'react'
import { List, Grid, Segment, Header, Button, Confirm, Loader, Icon, } from 'semantic-ui-react'

import { db } from './firebase'
import * as DateUtils from './utils/DateUtils'

// import MarkAddForm from './MarkAddForm'
import MarksMenu from './MarksMenu'
import DeleteConfirmModal from './DeleteConfirmModal'

class Marks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      marks: [],
    }
  }

  handleDelete = (mark) => {
    const {
      user,
      subjects,
    } = this.props;
    const markRef = db.ref(`marks-app/${user.uid}/marks/${mark.key}`);
    // markRef.once('value', mark => {
    //   db.ref(`marks-app/${this.props.user.uid}/tests/${mark.val().testId}`).update({ markId: null, markValue: null });
    // });
    markRef.remove();
    db.ref(`marks-app/${user.uid}/tests/${mark.testId}`).update({ markId: null, markValue: null });
    subjects.forEach(subject => {
      if (mark.subjectId === subject.key) {
        Object.keys(subject.markIds).forEach(markIdKey => {      
          if (mark.key === subject.markIds[markIdKey].markId) db.ref(`marks-app/${user.uid}/subjects/${mark.subjectId}/markIds/${markIdKey}`).remove();
        })
      }
    })
  }

  getTestName = (id) => {
    const {
      tests,
    } = this.props;

    if (id === 'notest') { return 'No test' }

    for (var i = 0; i < tests.length; i++) {
      if (tests[i].key === id) {
        return tests[i].name;
      }
    }
  }

  getTestDueDate = (id) => {
    const {
      tests,
    } = this.props;

    if (id !== 'notest') {
      for (var i = 0; i < tests.length; i++) {
        if (tests[i].key === id) {
          return tests[i].dueDate;
        }
      }
    }
  }

  getSubjectInitials = (id) => {
    const {
      subjects
    } = this.props;
    // console.log(id);

    for (var i = 0; i < subjects.length; i++) {
      
      if (subjects[i].key === id){
        // console.log('hey');
        return subjects[i].initials;
      }
    }
  }



  render() {

    const {
      subjects,
      tests,
      marks,
      loadingMarks,
    } = this.props;

    return(
      <div style={{margin: '1rem'}}>
        {/* <AgendaSubMenu handleSearchFilterChange={this.handleSearchFilterChange} showGraded={false} date={false} groupBy={false} handleRangeChange={this.handleRangeChange} handleGradedChange={this.handleGradedChange} handleGroupByChange={this.handleGroupByChange} subjects={subjects} />         */}
        <MarksMenu subjects={subjects} tests={tests}/>
        <Segment attached='bottom'>
          <Loader active={loadingMarks}/>
          { marks.length === 0  && <div style={{ textAlign: 'center' }}>Look's like you don't have any marks.</div>}
          <List divided>
            {marks[0] !== false && marks.map((mark, i) => (
              <MarkItem
                key={i}
                getTestName={this.getTestName}
                getTestDueDate={this.getTestDueDate}
                getSubjectInitials={this.getSubjectInitials}
                handleDelete={this.handleDelete}
                mark={mark}
                markId={mark.key}
                subjectId={mark.subjectId}
                value={mark.value}
                subjectInitials={mark.subjectInitials}
                timestamp={mark.timestamp}
              />
            ))}
          </List>
        </Segment>  
      </div>
    )
  }

}


const MarkItem = ({ handleDelete, mark, getTestName, getTestDueDate, getSubjectInitials }) =>
  <List.Item>
    <Grid padded columns='equal' >
      <Grid.Row stretched columns={3}>
        <Grid.Column textAlign='center' verticalAlign='middle' computer={1} tablet={2}>
          <Header content={mark.value} size='huge' />
        </Grid.Column>
        <Grid.Column>
          <Header size='medium' content={getSubjectInitials(mark.subjectId)}/>
          {/* <p>{new Date(mark.timestamp).toDateString()}</p> */}
          <p>{ mark.dueDate ? DateUtils.getFormatedDate(mark.dueDate) : DateUtils.getFormatedDate(getTestDueDate(mark.testId)) }</p>
          {/* <p>{mark.testName}</p> */}
          <p>{getTestName(mark.testId)}</p>
        </Grid.Column>   
          {/* <Button floated='right' onClick={() => props.handleDelete(props.markId)} content='Delete' negative/> */}
          <DeleteConfirmModal handleConfirm={() => handleDelete(mark)}> <Icon link name='trash outline' /> </DeleteConfirmModal>             
      </Grid.Row>              
    </Grid>
  </List.Item>


export default Marks;