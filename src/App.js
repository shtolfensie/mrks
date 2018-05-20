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
  homework: [false],
  subjects: [false],
  loadingTests: true,
  loadingMarks: true,
  loadingHomework: true,
  user: false,
  settings: false,
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

    if ((prevState.homework !== this.state.homework) && this.state.user !== null) {
      this.setState({ loadingHomework: false });
    }

    if ((prevState.reminders !== this.state.reminders) && this.state.user !== null) {
      this.setState({ loadingReminders: false });
    }

    if ((prevState.user === null || prevState.user === false) && this.state.user) {
      this.getAllSubjects();
      this.getAllTests();
      this.getAllMarks();
      this.getAllHomework();
      this.getAllReminders();
      this.getUserSettings();
      // alert(4)
    }

    if (this.state.settings !== prevState.settings) {
      this.setState({ activeItem: this.state.settings.mainMenu });    
      if (this.state.settings.mainMenu === undefined && this.state.user) db.ref(`marks-app/${this.state.user.uid}/settings/mainMenu`).set(this.state.activeItem);
    }

    if (prevState.user !== null && this.state.user === null) this.setState(CLEAR_STATE);

  }

  componentDidMount() {
    this.getCurrentUser();

    if (this.state.user !== null && this.state.user !== false) {
      this.getAllSubjects();
      this.getAllTests();
      this.getAllMarks();
      this.getAllHomework();
      this.getAllReminders();
      this.getUserSettings();

      if (this.state.settings !== undefined && this.state.settings !== false) this.setState({ activeItem: this.state.settings.mainMenu });
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
          testIds: data.val().testIds ? data.val().testIds : {},
          markIds: data.val().markIds ? data.val().markIds : {},
          homeworkIds: data.val().homeworkIds ? data.val().homeworkIds : {},
          reminderIds: data.val().reminderIds ? data.val().reminderIds : {},
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
          type: 'test',        
        }); 
      });
      this.setState({ tests: testsArr });
      // this.setState({ tests: [] });      
      console.log(this.state.tests);
      
      testsArr = [];
    });
  }

  getAllHomework = () => {
    const { user } = this.state;
    let homeworkArr = [];
    db.ref(`/marks-app/${user.uid}/homework`).orderByChild('dueDate').on('value', snapshot => {
      snapshot.forEach(homework => {
        homeworkArr.push({
          name: homework.val().name,
          dueDate: homework.val().dueDate,
          subjectId: homework.val().subjectId,
          subjectInitials: homework.val().subjectInitials,
          timestamp: homework.val().timestamp,
          key: homework.key,
          // markId: test.val().markId ? test.val().markId : undefined,
          type: 'homework',
        }); 
      });
      this.setState({ homework: homeworkArr });
      // this.setState({ tests: [] });
      
      homeworkArr = [];
    });
  }

  getAllReminders = () => {
    const { user } = this.state;
    let remindersArr = [];
    db.ref(`/marks-app/${user.uid}/reminders`).orderByChild('dueDate').on('value', snapshot => {
      snapshot.forEach(reminder => {
        remindersArr.push({
          name: reminder.val().name,
          dueDate: reminder.val().dueDate,
          subjectId: reminder.val().subjectId,
          subjectInitials: reminder.val().subjectInitials,
          timestamp: reminder.val().timestamp,
          key: reminder.key,
          // markId: test.val().markId ? test.val().markId : undefined,
          type: 'reminder',
        }); 
      });
      this.setState({ reminders: remindersArr });
      // this.setState({ tests: [] });
      
      remindersArr = [];
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
          timestamp: mark.val().timestamp,
          dueDate: mark.val().dueDate,
          key: mark.key,
          testId: mark.val().testId,
        }); 
      });
      this.setState({ marks: marksArr });
      marksArr = [];
    });
  }

  handleMenuItemClick = (e, {name}) => {
    this.setState({ activeItem: name });
    db.ref(`marks-app/${this.state.user.uid}/settings/mainMenu`).set(name);
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
      if (snapshot.val()) {
        this.setState({ settings: snapshot.val() });
      }
      else this.setState({ settings: false });
      console.log(snapshot.val());
      
    })
  }

  render() {

    const {
      activeItem,
      subjects,
      tests,
      marks,
      homework,
      reminders,
      loadingTests,
      loadingMarks,
      loadingHomework,
      loadingReminders,
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
        {(user === false || settings === false) && user !== null ? <Loader active />
        :
          user === null
        ? <SignInPage />
        : <SettingsContext.Provider value={settings}>
            <Grid columns={2} padded>
                <Grid.Column computer={2} tablet={3} mobile={4}>
                  <MainMenu user={user} activeItem={activeItem} handleItemClick={this.handleMenuItemClick}/>
                </Grid.Column>
                <Grid.Column computer={14} tablet={13} mobile={12} style={{ padding: '0'}}>
                  {/* <Button onClick={() => auth.signOut()} >Sign Out</Button> */}
                  { activeItem === 'home' && <HomePage tests={tests} subjects={subjects} /> }
                  { activeItem === 'marks' && <Marks user={user} loadingMarks={loadingMarks} marks={marks} subjects={subjects} tests={tests}/> }
                  { activeItem === 'subjects' && <Subjects user={user} subjects={subjects} tests={tests}/> }
                  { activeItem === 'tests' && <Tests settings={settings} user={user} loadingTests={loadingTests} subjects={subjects} tests={tests}/> }
                  { activeItem === 'agenda' && <Agenda loadingReminders={loadingReminders} loadingHomework={loadingHomework} loadingMarks={loadingMarks} loadingTests={loadingTests} reminders={reminders} homework={homework} marks={marks} subjects={subjects} tests={tests}/> }
                </Grid.Column>
              </Grid>
        </SettingsContext.Provider>
        }
      </UserContext.Provider>

    );
  }
}

export default App;
