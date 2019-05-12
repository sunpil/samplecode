import React from 'react'

import 'script-loader!bootstrap-timepicker/js/bootstrap-timepicker.min.js'

export default class TimePicker extends React.Component {
  componentDidMount() {
    const { getTime, defaultTime } = this.props;

    $(this.refs.input).timepicker({
      minuteStep: 10,
      defaultTime: defaultTime,
      showMeridian: false
    });

    $(this.refs.input).on("change", function (e) {
      getTime(e.target.value);
    });
  }

  componentDidUpdate() {
    const { defaultTime } = this.props;

    $(this.refs.input).val(defaultTime);
  }

  render() {
    const { getTime, defaultTime, ...props }  = { ...this.props };
    return (
      <input type="text" { ...props } ref="input"/>
    )
  }
}
