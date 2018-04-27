import React, { Component } from 'react'

import { Dropdown, Form, Modal, Button, } from 'semantic-ui-react'

import * as DateUtils from './utils/DateUtils'

import Calendar from './Calendar'

class DuedatePicker extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: false,
      onDocClick: false,
      pickedDate: null,
    }
  }

  options = [
    {
      key: 1,
      text: 'Today',
      value: DateUtils.getDuedate('today'),
    },
    {
      key: 2,
      text: 'Tomorrow',
      value: DateUtils.getDuedate('tomorrow'),
    },
    {
      key: 3,
      text: 'Next Week',
      value: DateUtils.getDuedate('nextWeek'),
    },
    {
      key: 4,
      text: 'Other',
      value: 'other',
    },
  ];

  componentDidMount() {
    if (this.props.fromEdit) {
      this.options.push({
        key: this.options.length + 1,
        text: DateUtils.getFormatedDate(this.props.value),
        value: this.props.value,
      });
      this.props.onChange(1, { value: this.props.value });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      this.checkIfOpen();
    }
  }

  handleOpen = () => {
    this.props.onOpenChange(true);
    this.setState({ open: true, });

    setTimeout(() => {
      this.setState({ onDocClick: true });
    }, 200)
  }

  handleClose = () => {
    this.props.onOpenChange(false);
    this.setState({ open: false, onDocClick: false });
  }

  checkIfOpen = () => {
    if (this.props.value === 'other') this.handleOpen();
    console.log('check if open');
    
  }

  handleClickDay = (date) => {
    // alert(date.valueOf());
    this.setState({ pickedDate: date });    
    
  }

  handleCalendarPick = () => {
    this.options.push({
      key: this.options.length + 1,
      text: DateUtils.getFormatedDate(this.state.pickedDate),
      value: this.state.pickedDate.valueOf(),
    });

    console.log(this.options)

    // this.setState({ value: this.state.pickedDate.valueOf() });
    this.props.onChange(1, { value: this.state.pickedDate.valueOf() });

    this.handleClose();

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
            <Calendar handleClickDay={this.handleClickDay}/>
          </Modal.Content>
          <Modal.Actions>
            <Button basic content='Cancel' onClick={this.handleClose}/>
            <Button basic positive content='Ok' onClick={this.handleCalendarPick} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}





export default DuedatePicker;