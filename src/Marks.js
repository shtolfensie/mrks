import React, { Component } from 'react'
import { List, Grid, Segment, Header, Button, Confirm, } from 'semantic-ui-react'

import { db } from './firebase'
import * as DateUtils from './utils/DateUtils'

import MarkAddForm from './MarkAddForm'
import DeleteConfirmModal from './DeleteConfirmModal'

class Marks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      marks: [],
    }
  }

  handleDelete = (id) => {
    db.ref(`marks-app/marks/${id}`).remove();
  }



  render() {

    const {
      subjects,
      tests,
      marks,
    } = this.props;

    return(
      <div>
        <MarkAddForm subjects={subjects} tests={tests}/>
        <List divided>
          {marks.length !== 0 && marks.map((mark, i) => <MarkItem key={i} handleDelete={this.handleDelete} mark={mark} markId={mark.key} subjectId={mark.subjectId} value={mark.value} subjectInitials={mark.subjectInitials} timestamp={mark.timestamp} />)}
        </List>
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
        <Grid.Column computer={2} tablet={3} floated='right' verticalAlign='middle'>
          {/* <Button floated='right' onClick={() => props.handleDelete(props.markId)} content='Delete' negative/> */}
          <DeleteConfirmModal handleConfirm={() => handleDelete(mark.key)} />
        </Grid.Column>             
      </Grid.Row>              
    </Grid>
  </List.Item>


export default Marks;