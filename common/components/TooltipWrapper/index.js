import React from 'react'

class ToolTipWrapper extends React.Component {
    render() {
        return (
            <div id="tooltip" className="ToolTipWrapper">
                <h5>{this.props.title}</h5>
                <div className="value"></div>
                <div className="value"></div>
                <div className="value"></div>
                <div className="value"></div>
            </div>
        )
    }
}

export default ToolTipWrapper;

