import React, { Component } from 'react'

class TestUI extends Component {
  constructor(props){
    super(props);

    this.state = {
      adding: false,
      subjects: {
        aj: {
          info: {
            subjectName: 'hi'
          }
        }
      },
    }
  }

  handleSubjectAddFormOpen  = () => {
    this.setState({
      adding: !this.state.adding,
    })
  }

  handleSubjectAdd = (e, subjectName, subjectInitials) => {
    const PREV_STATE = this.state.subjects;
    const subject = {
      ...PREV_STATE,
      [subjectInitials]: {
        info: {
          subjectName,
        },
      }
    }
    this.setState({
      subjects: {
        ...subject
      }
    });
    e.preventDefault();
  }

  render() {

    const {
      adding,
      subjects
    } = this.state;

    return (
      <div>
        <AppBar handleSubjectAddClick={this.handleSubjectAddFormOpen}/>
        {adding && <AddSubjectForm handleSubmit={this.handleSubjectAdd}/>}
        {typeof subjects === 'object' && <div>{Object.keys(subjects).map(key => <div>{subjects[key].info.subjectName}</div>)}</div>}
      </div>
    )
  }
}


const AppBar = (props) =>
  <div>
    <button onClick={props.handleSubjectAddClick}>Add Subject</button>
  </div>

class AddSubjectForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      subjectName: '',
      subjectInitials: '',
    }
  }
  
  render() {

    const {
      subjectName,
      subjectInitials
    } = this.state;

    return (
      <form onSubmit={(e) => this.props.handleSubmit(e, subjectName, subjectInitials)}>
        <lable>Subject Name: </lable>
        <input type='text' value={subjectName} onChange={(e) => this.setState( {subjectName: e.target.value} )}/>
        <lable>Subject Initials: </lable>
        <input type='text' value={subjectInitials} onChange={(e) => this.setState( {subjectInitials: e.target.value} )}/>
        <button type='submit'>Submit</button>
      </form>
    )
  }

}

export default TestUI;