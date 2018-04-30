import React, { Component } from 'react'
import { List, Grid, Segment, Header, Button, Confirm, Loader, Icon, } from 'semantic-ui-react'

import { db } from './firebase'
import * as DateUtils from './utils/DateUtils'

import MarkAddForm from './MarkAddForm'
import DeleteConfirmModal from './DeleteConfirmModal'
import AgendaSubMenu from './AgendaSubMenu'

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



  render() {

    const {
      subjects,
      tests,
      marks,
      loadingMarks,
    } = this.props;

    return(
      <div>
        <AgendaSubMenu handleSearchFilterChange={this.handleSearchFilterChange} showGraded={false} date={false} groupBy={false} handleRangeChange={this.handleRangeChange} handleGradedChange={this.handleGradedChange} handleGroupByChange={this.handleGroupByChange} subjects={subjects} />        
        <Segment attached='bottom'>
        <MarkAddForm subjects={subjects} tests={tests}> <Icon link name='plus' /> </MarkAddForm>
        <Loader active={loadingMarks}/>
        { marks.length === 0  && <div style={{ textAlign: 'center' }}>Look's like you don't have any marks.</div>}
        <List divided>
          {marks[0] !== false && marks.map((mark, i) => <MarkItem key={i} handleDelete={this.handleDelete} mark={mark} markId={mark.key} subjectId={mark.subjectId} value={mark.value} subjectInitials={mark.subjectInitials} timestamp={mark.timestamp} />)}
        </List>
        </Segment>  
      </div>
    )
  }

}


const MarkItem = ({ handleDelete, mark }) =>
  <List.Item>
    <Grid padded celled='internally' columns='equal' >
      <Grid.Row stretched columns={3}>
        <Grid.Column textAlign='center' verticalAlign='middle' computer={3} tablet={2}>
          <Segment textAlign='center' color='purple'>
            <Header content={mark.value} size='medium' />
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Header size='medium' content={mark.subjectInitials}/>
          {/* <p>{new Date(mark.timestamp).toDateString()}</p> */}
          <p>{ DateUtils.getFormatedDate(mark.timestamp) }</p>
          <p>{mark.testName}</p>
        </Grid.Column>   
          {/* <Button floated='right' onClick={() => props.handleDelete(props.markId)} content='Delete' negative/> */}
          <DeleteConfirmModal handleConfirm={() => handleDelete(mark)}> <Icon link name='trash outline' /> </DeleteConfirmModal>             
      </Grid.Row>              
    </Grid>
  </List.Item>


export default Marks;