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

const INITIAL_STATE = {
  activeItem: 'agenda',
  subjects: [],
  tests: [],
  loadingTests: true,
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

    if ((prevState.user === null || prevState.user === false) && this.state.user) {
      this.getAllSubjects();
      this.getAllTests();
      alert(4)
    }

    if (prevState.user !== null && this.state.user === null) this.setState(CLEAR_STATE);

  }

  componentDidMount() {
    this.getCurrentUser();

    if (this.state.user !== null && this.state.user !== false) {
      this.getAllSubjects();
      this.getAllTests();
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

  render() {

    const {
      activeItem,
      subjects,
      tests,
      loadingTests,
      user,
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
        : <Grid columns={2} padded>
            <Grid.Column width={2}>
              <MainMenu activeItem={activeItem} handleItemClick={this.handleMenuItemClick}/>
            </Grid.Column>
            <Grid.Column width={14} style={{ padding: '0'}}>
              <Button onClick={() => auth.signOut()} >Sign Out</Button>
              { activeItem === 'home' && <HomePage /> }
              { activeItem === 'marks' && <Marks subjects={subjects} tests={tests}/> }
              { activeItem === 'subjects' && <Subjects subjects={subjects} tests={tests}/> }
              { activeItem === 'tests' && <Tests loadingTests={loadingTests} subjects={subjects} tests={tests}/> }
              { activeItem === 'agenda' && <Agenda loadingTests={loadingTests} subjects={subjects} tests={tests}/> }
            </Grid.Column>
          </Grid>
        }
      </UserContext.Provider>

    );
  }
}

export default App;
