import React, { Component } from 'react'

import _ from 'lodash'

import * as DateUtils from './utils/DateUtils'

import { Segment, List, Header, } from 'semantic-ui-react'

import { TestItem } from './Tests'



class Today extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredTests: null,
      groupedTests: null,
    }
  }

  componentDidMount() {
    this.getFilteredTests();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(prevState.filterBy);
    // console.log(this.state.filterBy);
    if (prevState.filteredTests !== this.state.filteredTests || prevState.groupBy !== this.state.groupBy) {
      this.getGroupedTests(this.state.groupBy);
    }
    if (!_.isEqual(prevState.filterBy, this.state.filterBy) || prevProps.tests !== this.props.tests) {
      this.getFilteredTests(this.doFilter);
    }
  }

  getFilteredTests = () => {
    this.setState({
      filteredTests: _.filter(this.props.tests, this.doFilter)
    });
  }

  getGroupedTests = () => {
    this.setState({
      groupedTests: _.groupBy(this.state.filteredTests, 'subjectInitials')
    })
  }

  doFilter = (ob) => {
    if (!DateUtils.isInRange(ob, 'today')) return false;
    else return true;
  }


  render() {

    const {
      subjects,
      tests,
    } = this.props;

    const {
      filteredTests,
      groupedTests,
    } = this.state;

    return (
      <div>
        <Header content="Today's agenda" attached='top' size='large' />
        <Segment attached='bottom'>
          { tests.length === 0 && <div style={{ textAlign: 'center' }}>There are no events for today.</div> }
          <List >
            { groupedTests && Object.keys(groupedTests).map((testGroup, i) => {
              return (
                <List.Item key={i}>
                  <List>
                    <Header size='small' color='red' >{ testGroup }</Header>
                    {tests[0] !== false && groupedTests[testGroup].map((test, i) => <TestItem subjects={subjects} key={i} i={i} test={test} handleDelete={() => {}} />)}
                  </List>
                </List.Item>
              )
            })}
          </List>
        </Segment>
      </div>
    )
  }
}


export default Today;