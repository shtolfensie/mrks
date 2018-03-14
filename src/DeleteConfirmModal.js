import React, { Component } from 'react'

import { Modal, Button, } from 'semantic-ui-react'

import DeleteButton from './DeleteButton'


class DeleteConfirmModal extends Component {
  state = { open: false }

  show = () => this.setState({ open: true })
  handleConfirm = () => {
    this.props.handleConfirm();
    this.handleClose();
  }
  handleClose = () => this.setState({ open: false })

  render() {
    const {
      open
    } = this.state;

    return (
      // <div>
      //   {/* <Button negative onClick={this.show}>{this.props.buttonContent}</Button> */}
      //   <DeleteButton onClick={this.show} />
      //   <Confirm
      //     open={this.state.open}
      //     cancelButton='Never mind'
      //     confirmButton="Yes"
      //     onCancel={this.handleClose}
      //     onConfirm={this.handleConfirm}
      //   />
      // </div>
        <Modal size='tiny' open={open} onClose={this.handleClose} trigger={ <DeleteButton onClick={this.show} /> }>
          <Modal.Header>
            Are you sure?
          </Modal.Header>
          <Modal.Actions>
            <Button negative onClick={this.handleClose}>
              No
            </Button>
            <Button positive icon='checkmark' labelPosition='right' content='Yes' onClick={this.handleConfirm}/>
          </Modal.Actions>
        </Modal>
      
    )
  }
}

export default DeleteConfirmModal;