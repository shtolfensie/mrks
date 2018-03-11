import React, { Component } from 'react'

import { Header, Grid, Segment, } from 'semantic-ui-react'

class Home extends Component {
  


  render() {
    return (
      <Grid padded>
        <Grid.Row columns={3}>
          <Grid.Column>
            <Segment>
              <Header size='huge' content='Hi there you fucker' />
              <p>Here will be stuff like upcoming events.</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <Header size='huge' content="I don't like school." />
              <p>Here will be stuff like upcoming events.</p>
            </Segment>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}


export default Home;