import React, { Component } from 'react'
import { List, Grid, Segment, Header, Button, Confirm, } from 'semantic-ui-react'

import { db } from './firebase'

import MarkAddForm from './MarkAddForm'

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
      subjects
    } = this.props;

    return(
      <div>
        <MarkAddForm subjects={subjects} />
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
        <Grid.Column textAlign='center' verticalAlign='middle' computer={1} tablet={2}>
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
          <ConfirmDeleteModal handleConfirm={() => props.handleDelete(props.markId)} buttonContent='Delete' />
        </Grid.Column>             
      </Grid.Row>              
    </Grid>
  </List.Item>


class ConfirmDeleteModal extends Component {
  state = { open: false }

  show = () => this.setState({ open: true })
  handleConfirm = () => {
    this.props.handleConfirm();
    this.handleClose();
  }
  handleClose = () => this.setState({ open: false })

  render() {
    return (
      <div>
        <Button negative onClick={this.show}>{this.props.buttonContent}</Button>
        <Confirm
          open={this.state.open}
          cancelButton='Never mind'
          confirmButton="Yes"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </div>
    )
  }
}


export default Marks;