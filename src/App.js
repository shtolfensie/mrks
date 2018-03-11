import React, { Component } from 'react'
import GridColumn, { Grid } from 'semantic-ui-react'

import { db } from './firebase'

import MainMenu from './MainMenu'
import Subjects from './Subjects.js'
import Marks from './Marks'
import HomePage from './Home'
import Tests from './Tests'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeItem: 'subjects',
      subjects: [],
    }
  }

  componentWillMount() {
    this.getAllSubjects();
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
      subjects
    } = this.state;

    return (
      // <div>
      //   <MainMenu />
      //   <div style={this.styles.rightSideWithLeftMargin}>
      //     <SubjectAddForm />
      //     <Subjects />
      //   </div>
      // </div>

      <Grid columns={2}>
        <Grid.Column width={3}>
          <MainMenu activeItem={activeItem} handleItemClick={this.handleMenuItemClick}/>
        </Grid.Column>
        <Grid.Column width={13}>
          { activeItem === 'home' && <HomePage /> }
          { activeItem === 'marks' && <Marks subjects={subjects} /> }
          { activeItem === 'subjects' && <Subjects subjects={subjects} /> }
          { activeItem === 'tests' && <Tests subjects={subjects} /> }
        </Grid.Column>
      </Grid>
    );
  }
}

export default App;
