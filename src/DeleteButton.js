import React from 'react'

import { Button, Icon, } from 'semantic-ui-react'

const DeleteButton = (props) =>
  <Button animated='fade' basic color='blue' onClick={props.onClick}>
    <Button.Content visible>Delete</Button.Content>
    <Button.Content hidden><Icon name='trash outline'/></Button.Content>
  </Button>

export default DeleteButton;