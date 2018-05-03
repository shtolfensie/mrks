import React, { Component } from 'react'

import { Menu, Dropdown, Icon, Input, } from 'semantic-ui-react'

import MarkAddForm from './MarkAddForm'

const MarksMenu = (props) => {
  return (
    <Menu compact attached='top'>
      <Dropdown item icon='bars' simple>
        <Dropdown.Menu>
          <Dropdown.Item>
            hi
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Menu.Item as={'a'}>
        <MarkAddForm subjects={props.subjects} tests={props.tests}> Add a Mark </MarkAddForm>
      </Menu.Item>
      <Menu.Item position='right' >
        <Input style={{width: '9rem'}} icon='search' transparent placeholder='Search marks...' />
      </Menu.Item>
    </Menu>
  )
}


export default MarksMenu;