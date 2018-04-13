import React, { Component } from 'react'

import { Checkbox, Menu, Dropdown, Icon, } from 'semantic-ui-react'

import TestAddForm from './TestAddForm'

class AgendaSubMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: '',
      showGraded: true,
    }
  }

  componentDidMount() {
    this.setState({ activeItem: this.props.groupBy })
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  }

  handleGroupByChange = (groupBy) => {
    this.setState({ activeItem: groupBy });
    this.props.handleGroupByChange(groupBy);
  }



  render() {
    const {
      activeItem,
    } = this.state;

    const {
      subjects,
      showGraded,      
    } = this.props;

    return (
      <Menu attached='top'>
        <Dropdown item icon='bars' simple>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Icon name='dropdown' />
              <span className='text'>Sort by</span>

              <Dropdown.Menu>
                <Dropdown.Item active={activeItem === 'dueDate'} onClick={() => this.handleGroupByChange('dueDate')} >Due date</Dropdown.Item>
                <Dropdown.Item active={activeItem === 'subjectInitials'} onClick={() => this.handleGroupByChange('subjectInitials')}>Subject</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
            <Dropdown.Item>
              <Checkbox checked={showGraded} onChange={this.props.handleGradedChange} label='Show graded' />
            </Dropdown.Item>
            <TestAddForm subjects={subjects} />
            <Dropdown.Item>Open</Dropdown.Item>
            <Dropdown.Item>Save...</Dropdown.Item>
            <Dropdown.Item>Edit Permissions</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>Export</Dropdown.Header>
            <Dropdown.Item>Share</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <TestAddForm subjects={subjects} />
        <Menu.Menu position='right'>
          <div className='ui right aligned category search item'>
            <div className='ui transparent icon input'>
              <input className='prompt' type='text' placeholder='Search tests...' />
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