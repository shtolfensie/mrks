import React, { Component } from 'react'

import { db } from './firebase'

import TestAddForm from './TestAddForm'


class Tests extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tests: [],
    }
  }

  componentWillMount() {
    this.getAllTests();
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

  render() {

    const {
      tests,
    } = this.state;

    const {
      subjects,
    } = this.props;

    return (
      <div>
        <TestAddForm subjects={subjects} />
        { tests.length !== 0 && tests.map((test, i) => <div key={i} >{test.name}</div>) }
      </div>
    )
  }
}

export default Tests;