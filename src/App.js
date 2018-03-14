import React, { Component } from 'react'
import GridColumn, { Grid } from 'semantic-ui-react'

import { db } from './firebase'

import MainMenu from './MainMenu'
import Subjects from './Subjects.js'
import Marks from './Marks'
import HomePage from './Home'
import Tests from './Tests'
import Agenda from './Agenda'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeItem: 'agenda',
      subjects: [],
      tests: [],
    }
  }

  componentWillMount() {
    this.getAllSubjects();
    this.getAllTests();
  }

  getAllSubjects = () => {
    let subjects = [];
    db.ref('/marks-app/subjects').orderByKey().on('value', snapshot => {
      snapshot.forEach(data => {
        subjects.push({
          name: data.val().name,
          initials: data.val().initials,
          teacher: data.val().teacher,
          key: data.key,
        });
        // console.log(data.val().name);
      });
      this.setState({ subjects });
      subjects = [];
    })
  }

  getAllTests = () => {
    let testsArr = [];
    db.ref('/marks-app/tests').orderByKey().on('value', snapshot => {
      snapshot.forEach(test => {
        testsArr.push({
          name: test.val().name,
          dueDate: test.val().dueDate,
          subjectId: test.val().subjectId,
          subjectInitials: test.val().subjectInitials,
          timestamp: test.val().timestamp,
          key: test.key,
        }); 
      });
      this.setState({ tests: testsArr });
      console.log(this.state.tests);
      
      testsArr = [];
    });
  }

  handleMenuItemClick = (e, {name}) => {
    this.setState({ activeItem: name })
  }

  styles = {
    rightSideWithLeftMargin: {
      marginLeft: '250px',
      // minWidth: '550px',
    },
    topLevel: {
      width: '100vw'
    }
  };

  render() {

    const {
      activeItem,
      subjects,
      tests,
    } = this.state;

    return (
      // <div>
      //   <MainMenu />
      //   <div style={this.styles.rightSideWithLeftMargin}>
      //     <SubjectAddForm />
      //     <Subjects />
      //   </div>
      // </div>

      <Grid columns={2} padded>
        <Grid.Column width={3}>
          <MainMenu activeItem={activeItem} handleItemClick={this.handleMenuItemClick}/>
        </Grid.Column>
        <Grid.Column width={13} style={{ padding: '0'}}>
          { activeItem === 'home' && <HomePage /> }
          { activeItem === 'marks' && <Marks subjects={subjects} /> }
          { activeItem === 'subjects' && <Subjects subjects={subjects} tests={tests}/> }
          { activeItem === 'tests' && <Tests subjects={subjects} tests={tests}/> }
          { activeItem === 'agenda' && <Agenda subjects={subjects} tests={tests}/> }
        </Grid.Column>
      </Grid>
    );
  }
}

export default App;
