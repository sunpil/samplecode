/**
 * Created by griga on 11/24/15.
 */

import React from 'react'

import {Dropdown, MenuItem} from 'react-bootstrap'

export default class Footer extends React.Component {
    render(){
        return (
            <div className="page-footer">
                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <strong>xCon for SAP v.3 - INSPIEN © 2013-2018</strong>
                    </div>
                    <div className="col-xs-6 col-sm-6 text-right hidden-xs">
                        <div className="inline-block">
                            <span className="hidden-mobile">Last account activity: <strong>52 mins ago</strong> </span>

                            <Dropdown className="btn-group dropup" id="footer-progress-dropdown">
                                <Dropdown.Toggle className="btn">
                                    <i className="fa fa-gear" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu pull-right text-left">
                                    <MenuItem>
                                        <div className="padding-5">
                                            <p className="txt-color-darken font-sm no-margin">Download Progress</p>

                                            <div className="progress progress-micro no-margin">
                                                <div className="progress-bar progress-bar-success" style={{width: 50 + '%'}}></div>
                                            </div>
                                        </div>
                                    </MenuItem>
                                    <MenuItem divider />
                                    <MenuItem>
                                        <div className="padding-5">
                                            <p className="txt-color-darken font-sm no-margin">Server Load</p>

                                            <div className="progress progress-micro no-margin">
                                                <div className="progress-bar progress-bar-success" style={{width: 20 + '%'}}></div>
                                            </div>
                                        </div>
                                    </MenuItem>
                                    <MenuItem divider />
                                    <MenuItem>
                                        <div className="padding-5">
                                            <p className="txt-color-darken font-sm no-margin">Memory Load <span className="text-danger">*critical*</span>
                                            </p>

                                            <div className="progress progress-micro no-margin">
                                                <div className="progress-bar progress-bar-danger" style={{width: 70 + '%'}}></div>
                                            </div>
                                        </div>
                                    </MenuItem>
                                    <MenuItem divider />
                                    <MenuItem>
                                        <div className="padding-5">
                                            <button className="btn btn-block btn-default">refresh</button>
                                        </div>
                                    </MenuItem>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}