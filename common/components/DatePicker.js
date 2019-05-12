import React from 'react'

export default class DatePicker extends React.Component {
  
  componentDidMount() {
    const onSelectCallbacks = [];
    const props = this.props;
    const element = $(this.refs.input);
    const getDate = this.props.getDate;

    if (props.minRestrict) {
      onSelectCallbacks.push((selectedDate) => {
        $(props.minRestrict).datepicker('option', 'minDate', selectedDate);
      });
    }
    if (props.maxRestrict) {
      onSelectCallbacks.push((selectedDate) => {
        $(props.maxRestrict).datepicker('option', 'maxDate', selectedDate);
      });
    }
    if (props.getDate) {
      onSelectCallbacks.push((selectedDate) => {
        getDate(selectedDate);
      });
    }

    const options = {
      prevText: '<i class="fa fa-chevron-left"></i>',
      nextText: '<i class="fa fa-chevron-right"></i>',
      onSelect: (selectedDate) => {
        onSelectCallbacks.forEach((cb)=> {
          cb.call(cb, selectedDate)
        })
      }
    };

    if (props.numberOfMonths) options.numberOfMonths = props.numberOfMonths;

    if (props.dateFormat) options.dateFormat = props.dateFormat;

    if (props.defaultDate) options.defaultDate = props.defaultDate;

    if (props.changeMonth) options.changeMonth = props.changeMonth;
    
    element.datepicker(options);

    if (props.setDate) element.datepicker("setDate" , props.setDate);
  }

  componentDidUpdate() {
    if (this.props.setDate) {
      $(this.refs.input).datepicker("setDate" , this.props.setDate);
    }
  }

  render() {
    const {
      minRestrict, maxRestrict, changesMonth,
      numberOfMonths, dateFormat, defaultDate, changeMonth, setDate, getDate,
      ...props
    } = {...this.props};
    return (
      // <input type="text" className="form-control" {...props} autoComplete="off" ref="input"/>
      <input type="text" {...props} autoComplete="off" ref="input"/>
    )
  }
}
