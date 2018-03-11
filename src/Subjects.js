import React, { Component } from 'react'
import { Grid, Card, Button, Progress } from 'semantic-ui-react'

import { List, Segment, Header, Icon, } from 'semantic-ui-react'

import { db } from './firebase'

import SubjectAddForm from './SubjectAddForm'
import MarkAddForm from './MarkAddForm'

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

  deleteSubject = (id) => {
    db.ref(`/marks-app/subjects/${id}`).remove();
  }

  render() {

    const {
      subjects,
    } = this.props;

    return (
      <div>
        <SubjectAddForm />
        <Grid doubling padded columns={3}>
          {subjects.length !== 0 && subjects.map((subject, i) => <Grid.Column style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}} key={i}><SubjectCard handleDelete={this.deleteSubject} id={subject.key} name={subject.name} initials={subject.initials} teacher={subject.teacher}/></Grid.Column>)}
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
    }
  }

  componentDidMount() {
    this.getAllSubjectMarks();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('oh hi mark');
    console.log(this.state.subjectMarks);
    console.log(prevState.subjectMarks);
    if (this.state.subjectMarks !== prevState.subjectMarks) {
      console.log(this.state.subjectMarks);
      this.getSubjectAverage();
    }
  }

  componentWillUnmount() {
    this.setState({ subjectMarks: [] })
  }

  getAllSubjectMarks = () => {
    const { id } = this.props;
    let subjectMarksArr = [];
    db.ref('marks-app/marks').orderByChild('subjectId').equalTo(id).on('value', snapshot => {
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
      this.setState({ subjectMarks: subjectMarksArr.slice() });
      subjectMarksArr = [];
      // this.setState({ subjectMarks: [...this.state.subjectMarks, subjectMarks] });
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


  render() {

    const {
      subjectMarks,
      subjectAverage,
      subjectDisplayAverage,
      isProgressError
    } = this.state;

    const {
      name,
      initials,
      teacher,
      id,
      handleDelete,
    } = this.props;

    return(
      <Card fluid>
          <Card.Content>
            <Card.Header>{name}</Card.Header>
            <Card.Meta>
              {initials}
              <div>Teacher: {teacher}</div>
            </Card.Meta>
            <Card.Description>
              <div>I dont like this subject.</div>
            </Card.Description>
          </Card.Content>
          <Card.Content>
            <Progress error={isProgressError} label='You fucking suck.' progress content={subjectDisplayAverage} className='indicating' value={subjectAverage} total={5} size='small' />
          </Card.Content>
          <Card.Content extra>
          <Button.Group fluid widths='2' >
            <MarkAddForm fromSubjectCard subjects={[{ name, key: id, initials, teacher }]}/>
            <Button animated='fade' basic color='blue' onClick={() => handleDelete(id)}>
              <Button.Content visible>Delete</Button.Content>
              <Button.Content hidden><Icon name='trash outline'/></Button.Content>
            </Button>
          </Button.Group>
          </Card.Content>
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