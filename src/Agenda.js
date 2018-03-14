import React, { Component } from 'react'

import { Segment, Grid, Header, Menu} from 'semantic-ui-react'

import Tests from './Tests'

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
      <Grid columns={1} padded>
        <Grid.Column>
          <Segment style={this.styles.noPaddingSegment} >
            <Grid columns='equal' padded celled='internally' >
              <Grid.Row>
                <Grid.Column>
                  <Header color='red' content='TESTS' size='large' textAlign='center' />
                </Grid.Column>
                <Grid.Column>
                  <Header color='red' content='HOMEWORK' size='large' textAlign='center' />
                </Grid.Column>
                <Grid.Column>
                  <Header color='red'  content='REMINDERS' size='large' textAlign='center' />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column >
                  <Menu color='red' pointing secondary>
                    <Menu.Item
                      name='section1'
                      active={true}
                    >
                      Section 1
                    </Menu.Item>

                    <Menu.Item
                      name='section2'
                      active={false}
                    >
                      Section 2
                    </Menu.Item>
                  </Menu>
                  <Tests subjects={subjects} tests={tests}/>
                </Grid.Column>
                <Grid.Column>
                  <Header content='Homework' size='large' textAlign='center' />
                </Grid.Column>
                <Grid.Column>
                  <Header content='Reminders' size='large' textAlign='center' />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}


export default Agenda;