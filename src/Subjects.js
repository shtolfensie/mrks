import React, { Component } from 'react'
import { Grid, Card, Button, Progress } from 'semantic-ui-react'

import { List, Segment, Header, Icon, Menu, } from 'semantic-ui-react'

import { db } from './firebase'

import SubjectAddForm from './SubjectAddForm'
import SubjectEditForm from './SubjectEditForm'
import MarkAddForm from './MarkAddForm'
import TestAddForm from './TestAddForm'
import DeleteButton from './DeleteButton'
import DeleteConfirmModal from './DeleteConfirmModal'
import SubjectsMenu from './SubjectsMenu'

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

class Subjects extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // this.getAllSubjects();
  }

  // getAllSubjects = () => {
  //   let subjects = [];
  //   db.ref('/marks-app/subjects').orderByKey().on('value', snapshot => {
  //     snapshot.forEach(data => {
  //       subjects.push({
  //         name: data.val().name,
  //         initials: data.val().initials,
  //         teacher: data.val().teacher,
  //         key: data.key,
  //       });
  //       // console.log(data.val().name);
  //     });
  //     this.setState({ subjects });
  //     subjects = [];
  //   })
  // }

  handleDelete = (id) => {
    const {
      subjects,
      user,
    } = this.props;
    const userRefPath = `/marks-app/${this.props.user.uid}`;
    this.props.subjects.forEach(subject => {
      if (subject.key === id) {
        let homeworkRefPaths = {};
        let testsRefPaths = {};
        let marksRefPaths = {};
        let remindersRefPaths = {};

        if (subject.homeworkIds) Object.keys(subject.homeworkIds).forEach(homeworkIdKey => {
          // db.ref(`${userRefPath}/homework/${subject.homeworkIds[homeworkIdKey].homeworkId}`).remove();
          homeworkRefPaths[`${userRefPath}/homework/${subject.homeworkIds[homeworkIdKey].homeworkId}`] = null;
        });
        if (subject.testIds) Object.keys(subject.testIds).forEach(testIdKey => {
          // db.ref(`${userRefPath}/tests/${subject.testIds[testIdKey].testId}`).remove();
          testsRefPaths[`${userRefPath}/tests/${subject.testIds[testIdKey].testId}`] = null;
        });
        if (subject.markIds) Object.keys(subject.markIds).forEach(markIdKey => {
          // db.ref(`${userRefPath}/marks/${subject.markIds[markIdKey].markId}`).remove();
          marksRefPaths[`${userRefPath}/marks/${subject.markIds[markIdKey].markId}`] = null;
        });
        if (subject.reminderIds) Object.keys(subject.reminderIds).forEach(reminderIdKey => {
          // db.ref(`${userRefPath}/marks/${subject.markIds[markIdKey].markId}`).remove();
          remindersRefPaths[`${userRefPath}/reminders/${subject.reminderIds[reminderIdKey].reminderId}`] = null;
        });
        db.ref().update({ ...homeworkRefPaths, ...marksRefPaths, ...testsRefPaths, ...remindersRefPaths });
      }
    })
    db.ref(`${userRefPath}/subjects/${id}`).remove();
  }

  render() {

    const {
      subjects,
      tests,
      user,
    } = this.props;

    return (
      <div>
        <SubjectsMenu />
        { subjects.length === 0 && <div style={{ textAlign: 'center', marginTop: '2rem'}}> <Header content="Look's like you don't have any subjects yet. You can go ahead and add some." /> </div> }
        <Grid doubling padded columns={3}>

          {subjects.length !== 0 && subjects.map((subject, i) => (
            <Grid.Column
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}
              key={i}
              >
                <SubjectCard handleDelete={this.handleDelete} user={user} tests={tests} subject={subject}/>
              </Grid.Column>
            ))}
        </Grid>
      </div>
    )
  }
}

class SubjectCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subjectMarks: [],
      subjectAverage: 0,
      subjectDisplayAverage: 0,
      isProgressError: false,
      subjectTests: [],
      marksRef: null,
    }
  }

  componentDidMount() {
    this.getAllSubjectMarks();
    this.getAllSubjectTests();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('oh hi mark');
    // console.log(this.state.subjectMarks);
    // console.log(prevState.subjectMarks);
    if (this.state.subjectMarks !== prevState.subjectMarks) {
      // console.log(this.state.subjectMarks);
      this.getSubjectAverage();
    }
    if (this.props.tests !== prevProps.tests) {
      this.getAllSubjectTests();
      console.log('props');
      
    }
  }

  componentWillUnmount() {
    db.ref(`marks-app/${this.props.user.uid}/marks`).orderByChild('subjectId').equalTo(this.props.subject.key).off();
    this.setState({ subjectMarks: [] })
  }

  getAllSubjectMarks = () => {
    const {
      subject,
      user,
    } = this.props;
    let subjectMarksArr = [];
    db.ref(`marks-app/${user.uid}/marks`).orderByChild('subjectId').equalTo(subject.key).on('value', snapshot => {
      // console.log(snapshot.val().subjectInitials);
      console.log('getAllSubjectMarks');
      snapshot.forEach(mark => {
        subjectMarksArr.push({
          timestamp: mark.val().timestamp,
          value: mark.val().value,
          subjectId: mark.val().subjectId,
          subjectInitials: mark.val().subjectInitials,
        });
      });
      this.setState({ subjectMarks: subjectMarksArr });
      subjectMarksArr = [];
    }); 
  }

  getSubjectAverage = () => {
    const { subjectMarks } = this.state;
    let subjectAverage = 0;
    let subjectDisplayAverage = 0;
    let isProgressError;

    console.log(subjectMarks)

    Number.prototype.map = function (in_min, in_max, out_min, out_max) {
      return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    
    for (var i = 0; i < subjectMarks.length; i++) {
      subjectAverage += subjectMarks[i].value;
      console.log(subjectAverage);
    }
    if (subjectMarks.length !== 0) subjectAverage /= subjectMarks.length;
    subjectAverage = round(subjectAverage, 2);
    
    subjectDisplayAverage = subjectAverage;
    // subjectAverage = 6 - subjectAverage;
    subjectAverage === 5 ? isProgressError = true : isProgressError = false;
    subjectAverage !== 0 ? subjectAverage = subjectAverage.map(1, 5, 5, 0) : subjectAverage = 0;

    this.setState({ subjectAverage, subjectDisplayAverage, isProgressError });
  }

  getAllSubjectTests = () => {
    const { tests, subject } = this.props;
    const subjectTests = [];

    for (var i = 0; i < tests.length; i++) {
      if (tests[i].subjectId === subject.key) {
        subjectTests.push(tests[i]); 
      } 
    }
    this.setState({ subjectTests });
  }


  render() {

    const {
      subjectMarks,
      subjectAverage,
      subjectDisplayAverage,
      isProgressError,
      subjectTests,
    } = this.state;

    const {
      subject,
      handleDelete,
    } = this.props;

    const {
      initials,
      name,
      teacher,
      key,
    } = subject;

    return(
      <Card fluid>
          <Card.Content>
            <Card.Header>{name}</Card.Header>
            <Card.Meta>
              {initials}
              { teacher.length !== 0 && <div>Teacher: {teacher}</div> }
            </Card.Meta>
            <Card.Description>
              <div>I dont like this subject.</div>
            </Card.Description>
          </Card.Content>
          <Card.Content>
            <Progress error={isProgressError} label='You fucking suck.' progress content={subjectDisplayAverage} className='indicating' value={subjectAverage} total={5} size='small' />
          </Card.Content>
          {/* <Card.Content extra>
            <Button.Group fluid widths='1' >
              <MarkAddForm fromSubjectCard subjects={ [{ name, key, initials, teacher }] } tests={subjectTests} />
              <DeleteConfirmModal handleConfirm={() => handleDelete(key)} />
            </Button.Group>
          </Card.Content> */}
          <Menu attached='bottom'>
            <TestAddForm fromSubjectCard subjects={ [{ name, key, initials, teacher }] }/>
            <Menu.Item as={'a'}>
              <MarkAddForm fromSubjectCard subjects={ [{ name, key, initials, teacher }] } tests={subjectTests}> <Icon name='checkmark' /> </MarkAddForm>
            </Menu.Item>
            <Menu.Item as={'a'}>
              <DeleteConfirmModal handleConfirm={() => handleDelete(key)}> <Icon name='trash outline' /> </DeleteConfirmModal>
            </Menu.Item>
            <Menu.Item as={'a'}>
              <SubjectEditForm subject={subject} >Edit Subject</SubjectEditForm>
            </Menu.Item>
          </Menu>
        </Card>
    );
  }
}

export default Subjects;





{/* <Segment>
<Grid celled='internally'>
  <Grid.Row stretched columns={2}>
    <Grid.Column textAlign='center' verticalAlign='middle' width={6}>
      <Segment textAlign='center' color='purple'>
        <Header content='1' size='medium' />
      </Segment>
    </Grid.Column>
    <Grid.Column>
      <Header size='medium' content='Cj'/>
      <p>{new Date().toDateString()}</p>
    </Grid.Column>                
  </Grid.Row>              
</Grid>
</Segment> */}