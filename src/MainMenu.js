import React, { Component } from 'react'
import { Menu, Header, Accordion, Button, } from 'semantic-ui-react'

import { auth } from './firebase'

class MainMenu extends Component {

  state = { accordionIndex: -1 }

  styles = {
    mainMenu: {
      borderRadius: '0',
      width: 'inherit',
    },
    mainMenuButtons: {
      borderRadius: '0',
    }
  }

  handleAccordionClick = (e, titleProps) => {
    const { accordionIndex } = this.state;
    const { index } = titleProps;
    const newIndex = accordionIndex === index ? -1 : index;

    this.setState({ accordionIndex: newIndex });
  }


  render() {
    const {
      accordionIndex,
    } = this.state;

    const {
      activeItem,
      handleItemClick,
      user,
    } = this.props;

    return(
        <Menu vertical fixed='left' color='red'  style={this.styles.mainMenu}>
          <Menu.Item><Header color='red'>mrks</Header></Menu.Item>
          {/* I really dont llike it like this. It doesnt look good and it doesnt do what i want it to do. */}
          {/* so fix it you ----------- */}
          {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
          <Accordion as={Menu.Item} fitted='vertically'>
            <Accordion.Title
              active={accordionIndex === 0}
              content={user.displayName}
              index={0}
              onClick={this.handleAccordionClick}
            />
            <Accordion.Content active={accordionIndex === 0} content={<Button onClick={() => auth.signOut()} >Sign Out</Button>} />
          </Accordion>
          <Menu.Item name='home' style={this.styles.mainMenuButtons} active={activeItem === 'home'} onClick={handleItemClick}>
            Home
          </Menu.Item>
          <Menu.Item name='marks' style={this.styles.mainMenuButtons} active={activeItem === 'marks'} onClick={handleItemClick}>
            Marks
          </Menu.Item>
          <Menu.Item name='subjects' style={this.styles.mainMenuButtons} active={activeItem === 'subjects'} onClick={handleItemClick}>
            Subjects
          </Menu.Item>
          {/* <Menu.Item name='tests' style={this.styles.mainMenuButtons} active={activeItem === 'tests'} onClick={handleItemClick}>
            Tests
          </Menu.Item> */}
          <Menu.Item name='agenda' style={this.styles.mainMenuButtons} active={activeItem === 'agenda'} onClick={handleItemClick}>
            Agenda
          </Menu.Item>
        </Menu>
    )
  }
}


export default MainMenu;