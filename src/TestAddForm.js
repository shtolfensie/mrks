import React, { Component } from 'react'
import { db } from './firebase'

import { Modal, Button, Icon, Form, Dropdown, Message, Menu, } from 'semantic-ui-react'

import * as DateUtils from './utils/DateUtils'

import Mousetrap from 'mousetrap'

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

class TestAddForm extends Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
  }

  shortcuts = {
    testAddOpen: ['t e s t']
  }

  componentDidMount() {
    Mousetrap.bind(this.shortcuts.testAddOpen, () => {
      this.handleOpen();
    });
  }

  componentWillUnmount() {
    Mousetrap.unbind(this.shortcuts.testAddOpen);
  }
  
  handleOpen = ()  => {
    this.setState({ open: true });
    if (this.props.subjects[0] === false) {
      // THIS IS NOT GOOD!! FIX THIS. MAKE IT RELOAD OR SMTHING. K? :)
      // NOT GOOOOOOOOOFING 'ROUND. REALLY, FIX THIS YOU LAZY DUMBASS
      // FIX THIIIIIIIIIIS
      this.handleClose();
    }
    else if (this.props.subjects.length === 0) {
      alert("Looks like you don't have any subjects yet. Please add at least one subject before adding any tests.");
      this.handleClose();
    }
    else {
      this.constructDropDownOptionsArray();
      // reseting name -- needed if using sequence of keys to open
      setTimeout(() => {
        this.setState({name: ''});
      }, 1);
    }
  }

  handleClose = () => {
    this.setState(INITIAL_STATE);
  }

  handleAdd = (user) => {

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
  
      const testId = db.ref(`marks-app/${user.uid}/tests`).push(test).key;
      db.ref(`marks-app/${user.uid}/subjects/${test.subjectId}/testIds`).push({ testId });

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
          trigger={ <Menu.Item onClick={this.handleOpen}>Add a Test</Menu.Item> }
          open={open}
          onClose={this.handleClose}
          dimmer={false}
          closeOnDocumentClick={onDocClick}
          style={{ zIndex: '999' }}
        >
          <Modal.Header>Add Test</Modal.Header>
          <Modal.Content>
            <p>Oh no. You have another? That sucks. Well...</p>
            <Form error={isError}>
              <Form.Group>
                <Form.Input autoFocus value={name} onChange={(e) => this.setState({ name: e.target.value })} label='Add a Name' placeholder='Add a name' />
                {/* <Form.Input value={dueDate} onChange={(e) => this.setState({ dueDate: e.target.value })} label='Add a Due Date' /> */}
                <DuedatePicker onOpenChange={this.handleOpenChage} value={dueDate} onChange={(e, { value }) => this.setState({ dueDate: value })} label='Add a Due Date' placeholder='Add a Due Date'/>
                <Form.Dropdown disabled={fromSubjectCard && true} label='Choose a Subject' onChange={this.handleDropdown} value={subjectId} placeholder='Choose a Subject' search selection options={subjectOptions}/>
              </Form.Group>
              <Form.TextArea label='Description' placeholder='Placeholder...' autoHeight style={{ maxHeight: 300 }} rows={3}/>
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
            <Button positive onClick={() => this.handleAdd(user)}>Add</Button> 
          </Modal.Actions>
        </Modal>
      )}
      </UserContext.Consumer>
    );
  }
}


export default TestAddForm;

{/* <Button basic color='blue' animated='fade' onClick={this.handleOpen}>
                  <Button.Content visible>Add Test</Button.Content>
                  <Button.Content hidden><Icon name='plus'/></Button.Content>
                </Button> */}