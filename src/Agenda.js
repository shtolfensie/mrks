import React, { Component } from 'react'

import { Segment, Grid, Header, Menu, Dropdown, Icon} from 'semantic-ui-react'

import Tests from './Tests'
import Marks from './Marks'
import AgendaSubMenu from './AgendaSubMenu';

class Agenda extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  styles = {
    noPadding: {
      paddingLeft: '0',
      paddingRight: '0',
    },
    noPaddingSegment: {
      padding: '0',
    },
  }

  render() {

    const {
      subjects,
      tests,
    } = this.props;

    return (
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
    <div>
      <Segment style={{ margin: '1rem 1rem 0 1rem'}}>
      <Grid columns={3} padded>
        <Grid.Row>
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
      <Grid columns={3} padded>
        <Grid.Row>
          <Grid.Column>
            <Tests subjects={subjects} tests={tests} fromAgenda={true}/>
          </Grid.Column>
          <Grid.Column>
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
            <Segment attached='bottom' >
              <Marks subjects={subjects} tests={tests}/>
            </Segment>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
      </Grid>
      </div>
    )
  }
}


export default Agenda;