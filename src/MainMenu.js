import React, { Component } from 'react'
import { Menu, Header } from 'semantic-ui-react'

class MainMenu extends Component {

  styles = {
    mainMenu: {
      borderRadius: '0',
      width: 'inherit',
    },
    mainMenuButtons: {
      borderRadius: '0',
    }
  }


  render() {
    const {
      activeItem,
      handleItemClick,
    } = this.props;

    return(
      <Menu vertical fixed='left' color='red'  style={this.styles.mainMenu}>
        <Menu.Item><Header color='red'>mrks</Header></Menu.Item>
        <Menu.Item name='home' style={this.styles.mainMenuButtons} active={activeItem === 'home'} onClick={handleItemClick}>
          Home
        </Menu.Item>
        <Menu.Item name='marks' style={this.styles.mainMenuButtons} active={activeItem === 'marks'} onClick={handleItemClick}>
          Marks
        </Menu.Item>
        <Menu.Item name='subjects' style={this.styles.mainMenuButtons} active={activeItem === 'subjects'} onClick={handleItemClick}>
          Subjects
        </Menu.Item>
        <Menu.Item name='tests' style={this.styles.mainMenuButtons} active={activeItem === 'tests'} onClick={handleItemClick}>
          Tests
        </Menu.Item>
        <Menu.Item name='agenda' style={this.styles.mainMenuButtons} active={activeItem === 'agenda'} onClick={handleItemClick}>
          Agenda
        </Menu.Item>
      </Menu>
    )
  }
}


export default MainMenu;