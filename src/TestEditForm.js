import React, { Component } from 'react'
import { db } from './firebase'

import { Modal, Button, Icon, Form, Dropdown, Message, Menu, } from 'semantic-ui-react'

import * as DateUtils from './utils/DateUtils'

import { UserContext } from './App'

import DuedatePicker from './DuedatePicker'

const INITIAL_STATE = {
  open: false,
  name: '',
  dueDate: '',
  subjectId: '',
  isError: false,
  subjectOptions: [],
  onDocClick: true,
}

class TestEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    const { test } = this.props;

    // alert(2)
    this.setState(test);
  }
  
  handleOpen = ()  => {
    this.setState({ open: true });
    this.setState(this.props.test);
    if (this.props.subjects.length === 0) {
      // THIS IS NOT GOOD!! FIX THIS. MAKE IT RELOAD OR SMTHING. K? :)
      // NOT GOOOOOOOOOFING 'ROUND. REALLY, FIX THIS YOU LAZY DUMBASS
      // FIX THIIIIIIIIIIS
      this.handleClose();
    }
    else {
      this.constructDropDownOptionsArray();
    }
  }

  handleClose = () => {
    this.setState(INITIAL_STATE);
  }

  handleSave = (user) => {

    const {
      name,
      dueDate,
      subjectId,
      subjectInitials,
    } = this.state;

    if (name === '' || subjectId === '' || dueDate === '' ) {
      this.setState({ isError: true });
    }
    else {
      const test = {
        name,
        dueDate,
        timestamp: new Date().valueOf(),
        subjectInitials: this.getSubjectInitials(subjectId),
        subjectId,
      }
  
      db.ref(`marks-app/${user.uid}/tests/${this.props.test.key}`).update(test);
      if (subjectId !== this.props.test.subjectId) {
        db.ref(`marks-app/${user.uid}/subjects/${subjectId}/testIds`).push({ testId: this.props.test.key });
        db.ref(`marks-app/${user.uid}/subjects/${this.props.test.subjectId}/testIds`).once('value', testIdKeys => {
          testIdKeys.forEach(testIdKey => {
            if (this.props.test.key === testIdKey.val().testId) db.ref(`marks-app/${user.uid}/subjects/${this.props.test.subjectId}/testIds/${testIdKey.key}`).remove();
          })
        })
      }

      this.handleClose();
    }
  }

  handleDropdown = (e, { value }) => {
    this.setState({
      subjectId: value,
    });

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

  constructDropDownOptionsArray = () => {
    const {
      subjects,
      fromSubjectCard,
    } = this.props;

    let subjectOptions = [];

    // if (fromSubjectCard) {
    //   subjectOptions[0] = {
    //     key: 1,
    //     text: subjectName,
    //     value: subjectId
    //   }
    // }
    // else {
      for (var i = 0; i < subjects.length; i++) {
        let subject = {
          key: i,
          text: subjects[i].name,
          value: subjects[i].key,
        };
  
        // console.log(subject);
        
  
        subjectOptions.push(subject);
      }
    // }

    fromSubjectCard && this.setState({ subjectId: subjectOptions[0].value });
    this.setState({ subjectOptions });

    // if (fromSubjectCard) {
      // this.setState({ subjectId: this.state.subjectOptions[0].value});
    // }

    // console.log(subjectOptions);
    

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
      dueDate,
      subjectId,
      isError,
      subjectOptions,
      onDocClick,
    } = this.state;

    const {
      fromSubjectCard,
      subjects,
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
          <Modal.Header>Edit Test</Modal.Header>
          <Modal.Content>
            <p>Oh no. You have another? That sucks. Well...</p>
            <Form error={isError}>
              <Form.Group>
                <Form.Input autoFocus value={name} onChange={(e) => this.setState({ name: e.target.value })} label='Add a Name' placeholder='' />
                {/* <Form.Input value={dueDate} onChange={(e) => this.setState({ dueDate: e.target.value })} label='Add a Due Date' /> */}
                <DuedatePicker fromEdit onOpenChange={this.handleOpenChage} value={dueDate} onChange={(e, { value }) => this.setState({ dueDate: value })} label='Add a Due Date' placeholder='Add a Due Date'/>
                <Form.Dropdown disabled={fromSubjectCard && true} label='Choose a Subject' onChange={this.handleDropdown} value={subjectId} placeholder='Choose a Subject' search selection options={subjectOptions}/>
              </Form.Group>
              <Form.TextArea label='Description' placeholder='!!! NOT YET IMPLEMENTED !!!' autoHeight style={{ maxHeight: 300 }} rows={3}/>
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


export default TestEditForm;

{/* <Button basic color='blue' animated='fade' onClick={this.handleOpen}>
                  <Button.Content visible>Add Test</Button.Content>
                  <Button.Content hidden><Icon name='plus'/></Button.Content>
                </Button> */}