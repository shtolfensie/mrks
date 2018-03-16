import React, { Component } from 'react'
import { List, Grid, Segment, Header, Button, Confirm, } from 'semantic-ui-react'

import { db } from './firebase'

import MarkAddForm from './MarkAddForm'
import DeleteConfirmModal from './DeleteConfirmModal'

class Marks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      marks: [],
    }
  }

  componentWillMount() {
    this.getAllMarks();
    console.log('hi');
    
  }

  getAllMarks = () => {
    let marksArr = [];
    db.ref('/marks-app/marks').orderByKey().on('value', snapshot => {
      snapshot.forEach(mark => {
        marksArr.push({
          value: mark.val().value,
          subjectId: mark.val().subjectId,
          subjectInitials: mark.val().subjectInitials,
          timestamp: mark.val().timestamp,
          key: mark.key,
        }); 
      });
      this.setState({ marks: marksArr });
      marksArr = [];
    });
  }

  handleDelete = (id) => {
    db.ref(`marks-app/marks/${id}`).remove();
  }



  render() {

    const {
      marks
    } = this.state;

    const {
      subjects,
      tests,
    } = this.props;

    return(
      <div>
        <MarkAddForm subjects={subjects} tests={tests}/>
        <List divided>
          {marks.length !== 0 && marks.map((mark, i) => <MarkItem key={i} handleDelete={this.handleDelete} markId={mark.key} subjectId={mark.subjectId} value={mark.value} subjectInitials={mark.subjectInitials} timestamp={mark.timestamp} />)}
        </List>
      </div>
    )
  }

}


const MarkItem = (props) =>
  <List.Item>
    <Grid padded celled='internally' columns='equal' >
      <Grid.Row stretched columns={3}>
        <Grid.Column textAlign='center' verticalAlign='middle' computer={3} tablet={2}>
          <Segment textAlign='center' color='purple'>
            <Header content={props.value} size='medium' />
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Header size='medium' content={props.subjectInitials}/>
          <p>{new Date(props.timestamp).toDateString()}</p>
        </Grid.Column>   
        <Grid.Column computer={2} tablet={3} floated='right' verticalAlign='middle'>
          {/* <Button floated='right' onClick={() => props.handleDelete(props.markId)} content='Delete' negative/> */}
          <DeleteConfirmModal handleConfirm={() => props.handleDelete(props.markId)} />
        </Grid.Column>             
      </Grid.Row>              
    </Grid>
  </List.Item>


export default Marks;