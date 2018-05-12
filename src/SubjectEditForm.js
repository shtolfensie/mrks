import React, { Component } from 'react'
import { db } from './firebase'

import { Modal, Button, Icon, Form, Dropdown, Message, Menu, } from 'semantic-ui-react'

import * as DateUtils from './utils/DateUtils'

import { UserContext } from './App'

import DuedatePicker from './DuedatePicker'

const INITIAL_STATE = {
  open: false,
  name: '',
  initials: '',
  teacher: '',
  isError: false,
  onDocClick: true,
}

class SubjectEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    const { subject } = this.props;

    // alert(2)
    this.setState(subject);
  }
  
  handleOpen = ()  => {
    this.setState({ open: true });
    this.setState(this.props.subject);
  }

  handleClose = () => {
    this.setState(INITIAL_STATE);
  }

  handleSave = (user) => {

    const {
      name,
      initials,
      teacher,
    } = this.state;

    const {
      subject
    } = this.props;

    const {
      testIds,
      markIds,
      reminderIds,
      homeworkIds,
    } = subject;

    const ids = {
      testIds,
      markIds,
      reminderIds,
      homeworkIds,
    };

    if (name === '' || initials === '') {
      this.setState({ isError: true });
    }
    else {
      const subject = {
        name,
        initials,
        teacher,
        timestamp: new Date().valueOf(),
        testIds,
        markIds,
        reminderIds,
        homeworkIds,
      }
  
      db.ref(`marks-app/${user.uid}/subjects/${this.props.subject.key}`).update(subject);
      // if (subjectId !== this.props.test.subjectId) {
      //   db.ref(`marks-app/${user.uid}/subjects/${subjectId}/testIds`).push({ testId: this.props.test.key });
      //   db.ref(`marks-app/${user.uid}/subjects/${this.props.test.subjectId}/testIds`).once('value', testIdKeys => {
      //     testIdKeys.forEach(testIdKey => {
      //       if (this.props.test.key === testIdKey.val().testId) db.ref(`marks-app/${user.uid}/subjects/${this.props.test.subjectId}/testIds/${testIdKey.key}`).remove();
      //     })
      //   })
      // }

      this.handleClose();
    }
  }

  handleOpenChage = (open) => {
    if (open) this.setState({ onDocClick: false });
    else {
      setTimeout(() => {
        this.setState({ onDocClick: true });
      }, 150)
    }
      
  }


  render() {
    const {
      open,
      name,
      initials,
      teacher,
      isError,
      onDocClick,
    } = this.state;

    const {
      children
    } = this.props;

    // const subjectOptions = [
    //   {
    //     key: 1,
    //     text: 'Cestina',
    //     value: 1231312412,
    //   },
    // ]

    return (
      <UserContext.Consumer>
      { user => (
        <Modal
          trigger={ <div onClick={this.handleOpen}>{children}</div> }
          open={open}
          onClose={this.handleClose}
          dimmer={false}
          closeOnDocumentClick={onDocClick}
          style={{ zIndex: '999' }}
        >
          <Modal.Header>Edit Subject</Modal.Header>
          <Modal.Content>
            <Form error={isError}>
              <Form.Group>
                <Form.Input autoFocus value={name} onChange={(e) => this.setState({ name: e.target.value })} label='Add a Name' placeholder='' />
                <Form.Input value={initials} onChange={(e) => this.setState({ initials: e.target.value })} label='Add a Subject Initials' placeholder='' />
                <Form.Input value={teacher} onChange={(e) => this.setState({ teacher: e.target.value })} label='Teacher' placeholder='' />
                {/* <Form.Input value={dueDate} onChange={(e) => this.setState({ dueDate: e.target.value })} label='Add a Due Date' /> */}
              </Form.Group>
              {/* <Form.Button onClick={this.handleAdd} positive>Add</Form.Button> */}
              <Message 
                error
                header='All fields are required'
                content='Please fill in all fields of the form.'
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button basic onClick={this.handleClose}>Cancel</Button>
            <Button positive onClick={() => this.handleSave(user)}>Save</Button> 
          </Modal.Actions>
        </Modal>
      )}
      </UserContext.Consumer>
    );
  }
}


export default SubjectEditForm;

{/* <Button basic color='blue' animated='fade' onClick={this.handleOpen}>
                  <Button.Content visible>Add Test</Button.Content>
                  <Button.Content hidden><Icon name='plus'/></Button.Content>
                </Button> */}