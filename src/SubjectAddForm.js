import React, { Component } from 'react'
import { Modal, Button, Icon, Form, Message } from 'semantic-ui-react'

import { db } from './firebase'

import { UserContext } from './App'

class SubjectAddForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      name: '',
      initials: '',
      teacher: '',
      isError: false,
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({
      open: false,
      name: '',
      initials: '',
      teacher: '',
      isError: false,
    });
  }

  handleAdd = (user) => {
    console.log(user);
    
    const {
      name,
      initials,
      teacher,
    } = this.state

    if (name === '' || initials === '') {
      this.setState({ isError: true });
    }
    else {
      const subject = {
        name,
        initials,
        teacher,
      }
  
      var subjectsRef = db.ref(`/marks-app/${user.uid}/subjects`).push(subject);
      // var subjectRef = db.ref('/marks-app/subjects').orderByKey().once('value').then(snapshot => {
      //   snapshot.forEach(data => {
      //     console.log(data.val().name);
          
      //   })
      // })
      this.handleClose();
    }

  }

  render() {
    const {
      open,
      name,
      initials,
      teacher,
      isError
    } = this.state;

    return (
      <UserContext.Consumer>
        {user => (
        <Modal
          trigger={ <div onClick={this.handleOpen}>{this.props.children}</div> }
          open={open}
          onClose={this.handleClose}
          dimmer={false}
          closeOnDocumentClick
        >
          <Modal.Header>Add a Subject</Modal.Header>
          <Modal.Content>
            <p>Hi there! Let's add some subjects, shall we?</p>
            <Form error={isError} onSubmit={this.handleAdd}>
              <Form.Group widths='equal'>
                <Form.Input autoFocus value={name} onChange={(e) => this.setState({ name: e.target.value })} fluid label='Subject Name' placeholder='eg. Maths, Biology, ...'/>
                <Form.Input value={initials} onChange={(e) => this.setState({ initials: e.target.value })} fluid label='Subject Initials' placeholder='eg. M, Ma, Bi, Fy, ...'/>
                <Form.Input value={teacher} onChange={(e) => this.setState({ teacher: e.target.value })} fluid label='Teacher' placeholder='eg. Smith, Doe, ...'/>
              </Form.Group>
              <Message 
                error
                header='Something is missing'
                content="Please fill in 'Subject name' and 'Subject Initials'."
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button basic onClick={this.handleClose}>Cancel</Button>
            <Button positive onClick={() => this.handleAdd(user)}>Add</Button>
          </Modal.Actions>
        </Modal>
        )}
      </UserContext.Consumer>
    )
  }
}

export default SubjectAddForm;




{/* <form onSubmit={}>
          <label for='subjectNameInput'>Subject Name: </label>
          <input id='subjectNameInput' type='text' value={subjectName} onChange={(e) => this.setState({ subjectName: e.target.value })}/>
          <label for='subjectInitialsInput'>Subject Initials: </label>
          <input id='subjectInitialsInput' type='text' value={subjectInitials} onChange={(e) => this.setState({ subjectInitials: e.target.value })}/>
          <label for='subjectTeacherInput'>Teacher: </label>
          <input id='subjectTeacherInput' type='text' value={subjectTeacher} onChange={(e) => this.setState({ subjectTeacher: e.target.value })}/>
        </form> */}



{/* <Button animated='fade' onClick={this.handleOpen}>
                    <Button.Content visible>Add a Subject</Button.Content>
                    <Button.Content hidden><Icon name='plus'/></Button.Content>
                  </Button> */}