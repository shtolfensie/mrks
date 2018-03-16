import React, { Component } from 'react'
import { db } from './firebase'

import { Modal, Button, Icon, Form, Dropdown, Message, } from 'semantic-ui-react'

class MarkAddForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      value: '',
      subjectId: null,
      testId: '', 
      isError: false,
      subjectOptions: [],
      testOptions: [],
    }
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
      this.constructSubjectsDropDownOptionsArray();
    }
    this.constructTestsDropDownOptionsArray();

  }

  handleClose = () => {
    this.setState({
      open: false,
      value: '',
      subjectInitials: '',
      subjectId: null,
      isError: false,
    });
  }

  handleAdd = (e) => {
    e.preventDefault();

    const {
      value,
      timestamp,
      subjectInitials,
      subjectId,
    } = this.state;

    if (value === '' || subjectId === '') {
      this.setState({ isError: true });
    }
    else {
      const mark = {
        value: parseFloat(value),
        timestamp: new Date().valueOf(),
        subjectInitials: this.getSubjectInitials(subjectId),
        subjectId,
      }
  
      db.ref('marks-app/marks').push(mark);

      this.handleClose();
    }
  }

  handleSubjectDropdown = (e, { value }) => {
    this.setState({
      subjectId: value,
    });

  }

  handleTestDropdown = (e, { value }) => {
    this.setState({
      testId: value,
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

  constructSubjectsDropDownOptionsArray = () => {
    const {
      subjects,
      fromSubjectCard,
    } = this.props;

    let subjectOptions = [];

    for (var i = 0; i < subjects.length; i++) {
      let subject = {
        key: i,
        text: subjects[i].name,
        value: subjects[i].key,
      };
      // console.log(subject);
      subjectOptions.push(subject);
    }

    fromSubjectCard && this.setState({ subjectId: subjectOptions[0].value });
    this.setState({ subjectOptions });
  }

  constructTestsDropDownOptionsArray = () => {
    const {
      tests,
    } = this.props;

    let testOptions = [{ key: 0, text: 'No test', value: 'notest', }];

    console.log(tests);
    
    if (tests !== undefined) {
      for (var i = 0; i < tests.length; i++) {
        let test = {
          key: i + 1,
          text: tests[i].name,
          value: tests[i].key,
        };
        testOptions.push(test);
        
      }
    }

    this.setState({ testOptions });
  }


  render() {
    const {
      open,
      value,
      subjectId,
      testId,
      isError,
      subjectOptions,
      testOptions,
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
    //   {
    //     key: 2,
    //     text: 'Matematika',
    //     value: 679679743,
    //   },
    //   {
    //     key: 3,
    //     text: 'Biologie',
    //     value: 3453735734,
    //   },
    // ]

    return (
      <Modal
        trigger={<Button basic color='blue' animated='fade' onClick={this.handleOpen}>
                  <Button.Content visible>Add Mark</Button.Content>
                  <Button.Content hidden><Icon name='plus'/></Button.Content>
                </Button>}
        open={open}
        onClose={this.handleClose}
        dimmer={false}
        closeOnDocumentClick
        size='tiny'
      >
        <Modal.Header>Add Mark</Modal.Header>
        <Modal.Content>
          <p>Hello! Do you want to add some maks? Yeah. Me neither. But...</p>
          <Form error={isError} onSubmit={(e) => this.handleAdd(e)} >
            <Form.Group>
              <Form.Input value={value} onChange={(e) => this.setState({ value: e.target.value })} label='Add a Grade' placeholder='1-5' width={3}/>
              <Form.Dropdown label='Choose a Test' onChange={this.handleTestDropdown} value={testId} placeholder='Choose a Test' search selection options={testOptions}/>              
              <Form.Dropdown disabled={fromSubjectCard && true} label='Choose a Subject' onChange={this.handleSubjectDropdown} value={subjectId} placeholder='Choose a Subject' search selection options={subjectOptions}/>
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


export default MarkAddForm;