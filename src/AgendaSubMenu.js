import React, { Component } from 'react'

import { Menu, Dropdown, Icon, } from 'semantic-ui-react'

import TestAddForm from './TestAddForm'

class AgendaSubMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: ''
    }
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  }



  render() {
    const {
      activeItem
    } = this.state;

    const {
      subjects,
    } = this.props;

    return (
      <Menu attached='top'>
        <Dropdown item icon='bars' simple>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Icon name='dropdown' />
              <span className='text'>New</span>

              <Dropdown.Menu>
                <Dropdown.Item>Document</Dropdown.Item>
                <Dropdown.Item>Image</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
            <Dropdown.Item>Open</Dropdown.Item>
            <Dropdown.Item>Save...</Dropdown.Item>
            <Dropdown.Item>Edit Permissions</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>Export</Dropdown.Header>
            <Dropdown.Item>Share</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item>
          <TestAddForm subjects={subjects} />
        </Menu.Item>

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