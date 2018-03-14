import React, { Component } from 'react'
import { db } from './firebase'

import { Modal, Button, Icon, Form, Dropdown, Message, } from 'semantic-ui-react'

const INITIAL_STATE = {
  open: false,
  name: '',
  dueDate: '',
  subjectId: null,
  isError: false,
  subjectOptions: [],
}

class TestAddForm extends Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
  }
  
  handleOpen = ()  => {
    this.setState({ open: true });
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

  handleAdd = (e) => {
    e.preventDefault();

    const {
      name,
      dueDate,
      subjectId,
    } = this.state;

    if (name === '' || subjectId === '' || dueDate === '') {
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
  
      db.ref('marks-app/tests').push(test);

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


  render() {
    const {
      open,
      name,
      dueDate,
      subjectId,
      isError,
      subjectOptions,
    } = this.state;

    const {
      fromSubjectCard,
      subjects
    } = this.props;

    // const subjectOptions = [
    //   {
    //     key: 1,
    //     text: 'Cestina',
    //     value: 1231312412,
    //   },
    // ]

    return (
      <Modal
        trigger={<Button basic color='blue' animated='fade' onClick={this.handleOpen}>
                  <Button.Content visible>Add Test</Button.Content>
                  <Button.Content hidden><Icon name='plus'/></Button.Content>
                </Button>}
        open={open}
        onClose={this.handleClose}
        dimmer={false}
        closeOnDocumentClick
      >
        <Modal.Header>Add Test</Modal.Header>
        <Modal.Content>
          <p>Oh no. You have another? That sucks. Well...</p>
          <Form error={isError}>
            <Form.Group>
              <Form.Input value={name} onChange={(e) => this.setState({ name: e.target.value })} label='Add a Name' placeholder='' />
              <Form.Input value={dueDate} onChange={(e) => this.setState({ dueDate: e.target.value })} label='Add a Due Date' />
              <Form.Dropdown disabled={fromSubjectCard && true} label='Choose a Subject' onChange={this.handleDropdown} value={subjectId} placeholder='Choose a Subject' search selection options={subjectOptions}/>
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
          <Button positive onClick={this.handleAdd}>Add</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}


export default TestAddForm;