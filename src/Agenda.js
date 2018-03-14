import React, { Component } from 'react'

import { Segment, Grid, Header, Divider} from 'semantic-ui-react'

class Agenda extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {

    return (
      // <Grid padded columns={1}>
      //   <Grid.Column>
      //     <Segment.Group horizontal>
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
      //     </Segment.Group>
      //   </Grid.Column>
      // </Grid>
      <Grid collumns={1}>
        <Grid.Column>
          <div style={{ backgroundColor: 'blue'}}>hi</div>
        </Grid.Column>
      </Grid>
    )
  }
}


export default Agenda;