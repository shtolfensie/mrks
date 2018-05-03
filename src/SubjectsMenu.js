import React, { Component } from 'react'

import { Menu, Dropdown, Icon, Input, } from 'semantic-ui-react'

import SubjectAddForm from './SubjectAddForm'

const SubjectsMenu = (props) => {
  return (
    <Menu style={{margin: '-0.1rem 1rem 0 1rem', width: 'inherit'}}  attached='bottom'>
      <Dropdown item icon='bars' simple>
        <Dropdown.Menu>
          <Dropdown.Item>
            hi
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Menu.Item as={'a'}>
        <SubjectAddForm subjects={props.subjects} tests={props.tests}> Add a Subject </SubjectAddForm>
      </Menu.Item>
      <Menu.Item position='right' >
        <Input style={{width: '9rem'}} icon='search' transparent placeholder='Search subjects...' />
      </Menu.Item>
    </Menu>
  )
}


export default SubjectsMenu;