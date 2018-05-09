import React, { Component } from 'react'

import { Segment, Grid, Header, Menu, Dropdown, Icon} from 'semantic-ui-react'

import { UserContext } from './App'
import { SettingsContext } from './App'

import Tests from './Tests'
import Marks from './Marks'
import Homework from './Homework'
import Reminders from './Reminders'

class Agenda extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updateStyles: 0,
    }
  }

  styles = {
    noPadding: {
      paddingLeft: '0',
      paddingRight: '0',
    },
    noPaddingSegment: {
      padding: '0',
    },
    topHeader: {
      margin: '1rem 1rem 0 1rem',
      display: '',
    }
  }

  componentDidMount() {
    this.responsiveStyles();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.checkWidth);
  }


  // this is fucking terrible. 
  //fix it
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  responsiveStyles = () => {
    
    window.addEventListener('resize', this.checkWidth);
    this.checkWidth();

  }

  checkWidth = () => {
    if (window.matchMedia("(max-width: 992px)").matches && this.state.updateStyles === 0) {
      this.styles.topHeader = {display: 'none'};
      this.setState({ updateStyles: 1 });
    }
    else if (!window.matchMedia("(max-width: 992px)").matches && this.state.updateStyles === 1) {
      this.styles.topHeader = {margin: '1rem 1rem 0 1rem',};
      this.setState({ updateStyles: 0 });
    }
  }

  render() {

    const {
      subjects,
      tests,
      marks,
      homework,
      reminders,
      loadingTests,
      loadingMarks,
      loadingHomework,
      loadingReminders,
    } = this.props;

    return (

    <UserContext.Consumer>
      { user => (
        <div>
          <Segment style={this.styles.topHeader}>
          <Grid columns={3} padded>
            <Grid.Row only='computer'>
              <Grid.Column style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Header textAlign='center' size='large' content='Tests' />
                <div style={{ borderBottom: '2px solid red', width: '75%'}}></div>
              </Grid.Column>
              <Grid.Column style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Header textAlign='center' size='large' content='Homework' />
                <div style={{ borderBottom: '2px solid red', width: '75%'}}></div>            
              </Grid.Column>
              <Grid.Column style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Header textAlign='center' size='large' content='Reminders' />
                <div style={{ borderBottom: '2px solid red', width: '75%'}}></div>            
              </Grid.Column>
            </Grid.Row>
          </Grid>
          </Segment>
          <SettingsContext.Consumer>
            { settings => (
            <Grid columns={3} doubling stackable style={{padding: '1rem'}} >
              <Grid.Row>
                <Grid.Column>
                  <Tests settings={settings} user={user} loadingTests={loadingTests} subjects={subjects} tests={tests} fromAgenda={true}/>
                </Grid.Column>
                <Grid.Column>
                  <Homework settings={settings} user={user} loadingHomework={loadingHomework} subjects={subjects} homework={homework} fromAgenda={true}/>
                  {/* <Marks user={user} loadingMarks={loadingMarks} marks={marks} subjects={subjects} tests={tests}/> */}
                </Grid.Column>
                <Grid.Column>
                  <Reminders settings={settings} user={user} loadingReminders={loadingReminders} subjects={subjects} reminders={reminders} fromAgenda={true}/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            )}
          </SettingsContext.Consumer>
        </div>
      )}
      </UserContext.Consumer>
    )
  }
}


export default Agenda;






      // <Grid padded columns={2}>
      //   <Grid.Column>
      //     {/* <Segment.Group horizontal>
      //       <Segment>
      //         <Header style={{ backgroundColor: ''}} content='Tests'/>
      //         <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati at ipsum atque.</p>
      //       </Segment>
      //       <Segment >
      //         <Header content='Homework'/>
      //       </Segment>
      //       <Segment >
      //         <Header content='Reminders'/>
      //       </Segment>
      //     </Segment.Group> */}
      //     <Segment attached/>
      //   </Grid.Column>
      //   <Grid.Column>
      //     <Segment attached />
      //   </Grid.Column>
      // </Grid>

      // <Grid columns={1} padded>
      //   <Grid.Column>
      //     <Segment style={this.styles.noPaddingSegment} >
      //       <Grid columns='equal' padded celled='internally' >
      //         <Grid.Row>
      //           <Grid.Column>
      //             <Header color='red' content='TESTS' size='large' textAlign='center' />
      //           </Grid.Column>
      //           <Grid.Column>
      //             <Header color='red' content='HOMEWORK' size='large' textAlign='center' />
      //           </Grid.Column>
      //           <Grid.Column>
      //             <Header color='red'  content='REMINDERS' size='large' textAlign='center' />
      //           </Grid.Column>
      //         </Grid.Row>
      //         <Grid.Row>
      //           <Grid.Column >
      //             <Menu color='red' pointing secondary>
      //               <Menu.Item name='upcomingTests' active={true} >
      //                 Upcoming Tests
      //               </Menu.Item>
      //               <Menu.Item name='allTests' active={false} >
      //                 All Tests
      //               </Menu.Item>
      //             </Menu>
      //             <Tests subjects={subjects} tests={tests}/>
      //           </Grid.Column>
      //           <Grid.Column>
      //             <Header content='Homework' size='large' textAlign='center' />
      //           </Grid.Column>
      //           <Grid.Column>
      //             <Header content='Reminders' size='large' textAlign='center' />
      //           </Grid.Column>
      //         </Grid.Row>
      //       </Grid>
      //     </Segment>
      //   </Grid.Column>
      // </Grid>