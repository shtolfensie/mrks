import React, { Component } from 'react'

import { Header, Grid, Segment, } from 'semantic-ui-react'

import { UserContext } from './App'

import Today from './Today'

class Home extends Component {
  


  render() {
  const {
    tests,
    subjects,
  } = this.props;

    return (
      <UserContext.Consumer>
        { user => (
          <Grid padded>
            <Grid.Row columns={3}>
              <Grid.Column>
                <Today user={user} tests={tests} subjects={subjects} />
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
        )}
      </UserContext.Consumer>
    )
  }
}


export default Home;