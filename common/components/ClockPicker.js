import React from 'react'

import 'script-loader!clockpicker/dist/bootstrap-clockpicker.min.js'

export default class Clockpicker extends React.Component {
  componentDidMount() {
    const { getTime, setTime } = this.props;

    const input = $(this.refs.input);

    const element = $(this.refs.input);
    const options = {
      donetext: 'Done',
      default: setTime,
      afterDone: function() {
        getTime(input.val());
      }
    };

    element.clockpicker(options);
    input.on("change", function (e) {
        getTime(e.target.value);
    });
  }
  render() {
    const { getTime, defaultTime, setTime, inputName, ...props }  = { ...this.props };
    return (
      <input type="text" { ...props } ref="input" name={inputName} value={setTime} readOnly/>
    )
  }
}