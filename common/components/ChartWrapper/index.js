import React from 'react'
import {OverlayTrigger} from "react-bootstrap";

class ChartWrapper extends React.Component {
    render() {
        return (
            <div className="dashboard-widget">
                <header>
                    <span className="widget-icon">
                        <i className="material-icons md-24" style={{paddingTop:10}} aria-hidden="true">{this.props.icon ? this.props.icon : "equalizer"}</i>
                    </span>
                    <h2>{this.props.title}</h2>
                    <div className="dashboard-widget-ctrls">
                        { this.props.displayInfo ?
                        <OverlayTrigger placement="left" overlay={<div></div>}>
                            <a className="button-icon">
                                <i className="fa fa-info"/>
                            </a>
                        </OverlayTrigger>
                        : null
                        }
                    </div>
                </header>
                <div className="chartWrapper">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default ChartWrapper;

