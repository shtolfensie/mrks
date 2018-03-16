import React, { Component } from 'react'

import { Dropdown, Form, Modal, } from 'semantic-ui-react'

import Calendar from './Calendar'

class DuedatePicker extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: false,
      onDocClick: false,
    }
  }

  options = [
    {
      key: 1,
      text: 'Today',
      value: new Date().valueOf(),
    },
    {
      key: 2,
      text: 'Tomorrow',
      value: new Date('2018').valueOf(),
    },
    {
      key: 3,
      text: 'Next Week',
      value: new Date('2019').valueOf(),
    },
    {
      key: 4,
      text: 'Other',
      value: 'other',
    },
  ];

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      this.checkIfOpen();
    }
  }

  handleOpen = () => {
    this.setState({ open: true, });

    setTimeout(() => {
      this.setState({ onDocClick: true });
    }, 200)
  }

  handleClose = () => {
    this.setState({ open: false, onDocClick: false });
  }

  checkIfOpen = () => {
    if (this.props.value === 'other') this.handleOpen();
    console.log('check if open');
    
  }

  render() {
    const {
      label,
      onChange,
      value,
      placeholder,
    } = this.props;

    const {
      open,
      onDocClick,
    } = this.state;


    return (
      <div>
        <Form.Dropdown selection value={value} options={this.options} label={label} onChange={onChange} placeholder={placeholder} />
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
          size='mini'
          dimmer={false}
          style={{ zIndex: '1002 !important' }}
          closeOnDocumentClick={onDocClick}
        >
          <Modal.Content style={{ display: 'flex', justifyContent: 'center' }}>
            <Calendar />
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}





export default DuedatePicker;