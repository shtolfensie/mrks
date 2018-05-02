import React, { Component } from 'react'
import  { Grid, Button, Loader } from 'semantic-ui-react'

import { db, auth } from './firebase'

import SignInPage from './SignIn'

import MainMenu from './MainMenu'
import Subjects from './Subjects.js'
import Marks from './Marks'
import HomePage from './Home'
import Tests from './Tests'
import Agenda from './Agenda'

export const UserContext = React.createContext({ user: null });
export const SettingsContext = React.createContext({ settings: null });

const INITIAL_STATE = {
  // rename this you fuckhead
  activeItem: 'agenda',
  subjects: [],
  tests: [false],
  marks: [false],
  subjects: [false],
  loadingTests: true,
  loadingMarks: true,
  user: false,
}

const CLEAR_STATE = {
  subjects: [],
  tests: [],
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.tests !== this.state.tests) && this.state.user !== null) {
      this.setState({ loadingTests: false });
    }
    if ((prevState.marks !== this.state.marks) && this.state.user !== null) {
      this.setState({ loadingMarks: false });
    }

    if ((prevState.user === null || prevState.user === false) && this.state.user) {
      this.getAllSubjects();
      this.getAllTests();
      this.getAllMarks();
      this.getUserSettings();
      // alert(4)
    }

    if (prevState.user !== null && this.state.user === null) this.setState(CLEAR_STATE);

  }

  componentDidMount() {
    this.getCurrentUser();

    if (this.state.user !== null && this.state.user !== false) {
      this.getAllSubjects();
      this.getAllTests();
      this.getAllMarks();
      this.getUserSettings();
    }
  }

  getAllSubjects = () => {
    const { user } = this.state;
    let subjects = [];
    db.ref(`/marks-app/${user.uid}/subjects`).orderByChild('name').on('value', snapshot => {
      snapshot.forEach(data => {
        subjects.push({
          name: data.val().name,
          initials: data.val().initials,
          teacher: data.val().teacher,
          testIds: data.val().testIds,
          markIds: data.val().markIds,
          key: data.key,
        });
        // console.log(data.val().name);
      });
      this.setState({ subjects });
      subjects = [];
    })
  }

  getAllTests = () => {
    const { user } = this.state;
    let testsArr = [];
    db.ref(`/marks-app/${user.uid}/tests`).orderByChild('dueDate').on('value', snapshot => {
      snapshot.forEach(test => {
        testsArr.push({
          name: test.val().name,
          dueDate: test.val().dueDate,
          subjectId: test.val().subjectId,
          subjectInitials: test.val().subjectInitials,
          timestamp: test.val().timestamp,
          key: test.key,
          markValue: test.val().markValue ? test.val().markValue : undefined,
          // markId: test.val().markId ? test.val().markId : undefined,
          markId: test.val().markId,          
        }); 
      });
      this.setState({ tests: testsArr });
      // this.setState({ tests: [] });      
      console.log(this.state.tests);
      
      testsArr = [];
    });
  }

  getAllMarks = () => {
    const { user } = this.state;
    let marksArr = [];
    db.ref(`/marks-app/${user.uid}/marks`).orderByKey().on('value', snapshot => {
      snapshot.forEach(mark => {
        marksArr.push({
          value: mark.val().value,
          subjectId: mark.val().subjectId,
          subjectInitials: mark.val().subjectInitials,
          timestamp: mark.val().timestamp,
          key: mark.key,
          testId: mark.val().testId,
          testName: mark.val().testName,
        }); 
      });
      this.setState({ marks: marksArr });
      marksArr = [];
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

  getCurrentUser = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // alert(1);
        this.setState({ user });
        // console.log(user);
        // console.log(auth.currentUser.getIdToken());
      } else {
        // alert(2);
        this.setState({ user: null });
      }
    });
  }

  getUserSettings = () => {
    db.ref(`marks-app/${this.state.user.uid}/settings`).on('value', snapshot => {
      // console.log(snapshot.val());
      this.setState({ settings: snapshot.val() });
    })
  }

  render() {

    const {
      activeItem,
      subjects,
      tests,
      marks,
      loadingTests,
      loadingMarks,
      user,
      settings,
    } = this.state;

    return (
      // <div>
      //   <MainMenu />
      //   <div style={this.styles.rightSideWithLeftMargin}>
      //     <SubjectAddForm />
      //     <Subjects />
      //   </div>
      // </div>

      <UserContext.Provider value={user}>
        {user === false ? <Loader active />
        :
          user === null
        ? <SignInPage />
        : <SettingsContext.Provider value={settings}>
            <Grid columns={2} padded>
                <Grid.Column computer={2} tablet={3}>
                  <MainMenu user={user} activeItem={activeItem} handleItemClick={this.handleMenuItemClick}/>
                </Grid.Column>
                <Grid.Column comouter={14} tablet={13} style={{ padding: '0'}}>
                  {/* <Button onClick={() => auth.signOut()} >Sign Out</Button> */}
                  { activeItem === 'home' && <HomePage /> }
                  { activeItem === 'marks' && <Marks loadingMarks={loadingMarks} marks={marks} subjects={subjects} tests={tests}/> }
                  { activeItem === 'subjects' && <Subjects user={user} subjects={subjects} tests={tests}/> }
                  { activeItem === 'tests' && <Tests settings={settings} user={user} loadingTests={loadingTests} subjects={subjects} tests={tests}/> }
                  { activeItem === 'agenda' && <Agenda loadingMarks={loadingMarks} loadingTests={loadingTests} marks={marks} subjects={subjects} tests={tests}/> }
                </Grid.Column>
              </Grid>
        </SettingsContext.Provider>
        }
      </UserContext.Provider>

    );
  }
}

export default App;
