import React, { Component } from 'react'

import { Checkbox, Menu, Dropdown, Icon, } from 'semantic-ui-react'

import TestAddForm from './TestAddForm'

class AgendaSubMenu extends Component {

  handleGroupByChange = (groupBy) => {
    this.props.handleGroupByChange(groupBy);
  }

  handleRangeChange = (range) => {
    this.props.handleRangeChange(range);
  }



  render() {

    const {
      subjects,
      showGraded,
      groupBy,
      date,
      handleSearchFilterChange,
    } = this.props;

    return (
      <Menu attached='top'>
        <Dropdown item icon='bars' simple>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Icon name='dropdown' />
              <span className='text'>Group by</span>
              <Dropdown.Menu>
                <Dropdown.Item active={groupBy === 'dueDate'} onClick={() => this.handleGroupByChange('dueDate')} >Due date</Dropdown.Item>
                <Dropdown.Item active={groupBy === 'subjectInitials'} onClick={() => this.handleGroupByChange('subjectInitials')}>Subject</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
            <Dropdown.Item>
              <Icon name='dropdown' />
              <span className='text'>Select range</span>
              <Dropdown.Menu>
                <Dropdown.Item active={date === false} onClick={() => this.handleRangeChange(false)}>All</Dropdown.Item>
                <Dropdown.Item active={date === 'upcoming'}  onClick={() => this.handleRangeChange('upcoming')}>Upcoming</Dropdown.Item>
                <Dropdown.Item active={date === 'today'}     onClick={() => this.handleRangeChange('today')}   >Today</Dropdown.Item>
                <Dropdown.Item active={date === 'tomorrow'}  onClick={() => this.handleRangeChange('tomorrow')}>Tomorrow</Dropdown.Item>
                <Dropdown.Item active={date === 'week'}      onClick={() => this.handleRangeChange('week')}    >This Week</Dropdown.Item>
                <Dropdown.Item active={date === 'month'}     onClick={() => this.handleRangeChange('month')}   >This Month</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
            <Dropdown.Item>
              <Checkbox checked={showGraded} onChange={this.props.handleGradedChange} label='Show graded' />
            </Dropdown.Item>
            <TestAddForm subjects={subjects} />
          </Dropdown.Menu>
        </Dropdown>
        <TestAddForm subjects={subjects} />
        <Menu.Menu position='right'>
          <div className='ui right aligned category search item'>
            <div className='ui transparent icon input'>
              <input onChange={handleSearchFilterChange} className='prompt' type='text' placeholder='Search tests...' />
              <i className='search link icon' />
            </div>
            <div className='results' />
          </div>
        </Menu.Menu>
      </Menu>
    )
  }
}


export default AgendaSubMenu;