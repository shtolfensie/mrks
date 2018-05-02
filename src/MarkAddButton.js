import React from 'react'


const MarkAddButton = () =>
  <Button basic color='blue' animated='fade'>
    <Button.Content visible>Add a Mark</Button.Content>
    <Button.Content hidden><Icon name='plus'/></Button.Content>
  </Button>


export default MarkAddButton;