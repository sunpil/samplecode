import React from 'react';
import UiTabs from '../../../components/ui/UiTabs';
import DatePicker from './DatePicker';
import ClockPicker from './ClockPicker';
import BootstrapValidator from '../../../components/forms/validation/BootstrapValidator'
import 'script-loader!smartadmin-plugins/bower_components/bootstrapvalidator/dist/js/bootstrapValidator.min.js'
import '../css/TimeSetting.css';
import moment from 'moment'

export const getDate = (currentDate, beforeDay) => {
    if (beforeDay) {
        currentDate = new Date(currentDate.valueOf() - beforeDay * 24 * 60 * 60 * 1000);
    }
    return moment(currentDate).format('YYYY-MM-DD');
}

export const getTime = (currentDate, beforeMinute) => {
    if (beforeMinute) {
        currentDate = new Date(currentDate.valueOf() - 1000 * 60 * beforeMinute);
    }
    return moment(currentDate).format('HH:mm');
}

export const timeFormat = (time) => {
    let hours = Number(time.match(/^(\d+)/)[1]);
    let minutes = Number(time.match(/:(\d+)/)[1]);

    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10)
      sHours = "0" + sHours;
    if (minutes < 10)
      sMinutes = "0" + sMinutes;

    return sHours + ":" + sMinutes + ":00"
}

export default class TimeSetting extends React.Component {
    constructor (props) {
        super(props);
        this.timeObj = {};

        const fromDateName = "fromDate-" + this.props.dateId;
        const fromTimeName = "fromTime-" + this.props.dateId;
        const toDateName = "toDate-" + this.props.dateId;
        const toTimeName = "toTime-" + this.props.dateId;

        const valid = this.valid;

        this.validatorOptions = {
            fields: {
                [fromDateName]: {
                    validators: {
                        callback: {
                            message: "The value is not a valid date",
                            callback: function(value, validator) {
                                const check = moment(value, "YYYY-MM-DD", true).isValid();
                                valid(check);
                                return check;
                            }
                        },
                        notEmpty: {
                            message: "The date is required"
                        }
                    }
                },
                [toDateName]: {
                    validators: {
                        callback: {
                            message: "The value is not a valid date",
                            callback: function(value, validator) {
                                const check = moment(value, "YYYY-MM-DD", true).isValid();
                                valid(check);
                                return check;
                            }
                        },
                        notEmpty: {
                            message: "The date is required"
                        }
                    }
                },
                [fromTimeName]: {
                    validators: {
                        callback: {
                            message: "The value is not a valid time",
                            callback: function(value, validator) {
                                const check = moment(value, "HH:mm", true).isValid();
                                valid(check);
                                return check;
                            }
                        },
                        notEmpty: {
                            message: "The time is required"
                        }
                    }
                },
                [toTimeName]: {
                    validators: {
                        callback: {
                            message: "The value is not a valid time",
                            callback: function(value, validator) {
                                const check = moment(value, "HH:mm", true).isValid();
                                valid(check);
                                return check;
                            }
                        },
                        notEmpty: {
                            message: "The time is required"
                        }
                    }
                }
            }
        };
    }

    valid = (check) => {
        const button = this.refs._button;
        button.disabled = !check;
    }

    componentDidMount() {
        const {fromDate, fromTime, toDate, toTime} = this.props;
        this.timeObj["fromDate"] = fromDate;
        this.timeObj["fromTime"] = fromTime;
        this.timeObj["toDate"] = toDate;
        this.timeObj["toTime"] = toTime;
    }
    componentDidUpdate(){
        const {fromDate, fromTime, toDate, toTime} = this.props;
        this.timeObj["fromDate"] = fromDate;
        this.timeObj["fromTime"] = fromTime;
        this.timeObj["toDate"] = toDate;
        this.timeObj["toTime"] = toTime;
    }
    shouldComponentUpdate(nextProps){
        const {fromDate,fromTime,toDate,toTime} = this.timeObj
        return fromDate !== nextProps.fromDate || fromTime !== nextProps.fromTime || toDate !== nextProps.toDate || toTime !== toTime
    }

    quickTime = (option, type) => {
        let currentDay = new Date();
        let month =currentDay.getMonth()
        let year = currentDay.getFullYear()
        if (type == "time") {
            let fromDate = new Date(currentDay.valueOf() - (option * 60 * 1000));
            this.timeObj["fromDate"] = moment(fromDate).format("YYYY-MM-DD");
            this.timeObj["fromTime"] = moment(fromDate).format('HH:mm');
            this.timeObj["toDate"] = moment(currentDay).format("YYYY-MM-DD");
            this.timeObj["toTime"] = moment(currentDay).format("HH:mm");
        } else if (type == "day") {
            let fromDate = new Date(currentDay.valueOf() - (option  * 24 * 60 * 60 * 1000));
            this.timeObj["fromDate"] = moment(fromDate).format('YYYY-MM-DD');
            this.timeObj["fromTime"] = "00:00";
            this.timeObj["toDate"] = moment(currentDay).format('YYYY-MM-DD');
            this.timeObj["toTime"] = moment(currentDay).format('HH:mm');
        } else {
            if (type == "days") {
                let fromDate = new Date(currentDay.valueOf() - (option  * 24 * 60 * 60 * 1000));
                this.timeObj["fromDate"] = moment(fromDate).format('YYYY-MM-DD');
                this.timeObj["fromTime"] = "00:00";
                let toDate = new Date(currentDay.valueOf() - ((option - 1)  * 24 * 60 * 60 * 1000));
                this.timeObj["toDate"] = moment(toDate).format('YYYY-MM-DD');
                this.timeObj["toTime"] = "00:00";

            } else if (type == "weeks") {
                let day = new Date(currentDay.valueOf() - ((option * 7) * 24 * 60 * 60 * 1000));
                let firstDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() - day.getDay());
                this.timeObj["fromDate"] = moment(firstDay).format('YYYY-MM-DD');
                this.timeObj["fromTime"] = "00:00";
                let lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + (7 - firstDay.getDay()));
                this.timeObj["toDate"] = moment(lastDay).format('YYYY-MM-DD');
                this.timeObj["toTime"] = "00:00";
            } else if (type == "months") {
                if (month - option < 0) {
                    year = year - 1;
                    month = 12 + (month - option);
                } else {
                    month = month - option;
                }

                let firstDay = new Date(year, month, 1);
    
                this.timeObj["fromDate"] =moment(firstDay).format('YYYY-MM-DD');
                this.timeObj["fromTime"] = "00:00";
    
                let lastDay = new Date(year, month + 1, 1);
    
                this.timeObj["toDate"] = moment(lastDay).format('YYYY-MM-DD');
                this.timeObj["toTime"] = "00:00";
            } else if (type == "years") {
                let firstDay = new Date(year - option, 0, 1);
                this.timeObj["fromDate"] = moment(firstDay).format('YYYY-MM-DD');
                this.timeObj["fromTime"] = "00:00";

                let lastDay = new Date(year - option + 1 ,0, 1);
                this.timeObj["toDate"] = moment(lastDay).format('YYYY-MM-DD');
                this.timeObj["toTime"] = "00:00";
            }
        }

        this.props.setting(this.timeObj);
    }

    getFromDate = (fromDate) => {
        const fromDateName = "fromDate-" + this.props.dateId;
        $(this.refs._valid).bootstrapValidator('updateStatus', fromDateName, 'NOT_VALIDATED').bootstrapValidator('validateField', fromDateName);
        this.timeObj["fromDate"] = fromDate;
    }
    
    getFromTime = (fromTime) => {
        const fromTimeName = "fromTime-" + this.props.dateId;
        $(this.refs._valid).bootstrapValidator('updateStatus', fromTimeName, 'NOT_VALIDATED').bootstrapValidator('validateField', fromTimeName);
        this.timeObj["fromTime"] = fromTime;
    }

    getToDate = (toDate) => {
        const toDateName = "toDate-" + this.props.dateId;
        $(this.refs._valid).bootstrapValidator('updateStatus', toDateName, 'NOT_VALIDATED').bootstrapValidator('validateField', toDateName);
        this.timeObj["toDate"] = toDate;
    }

    getToTime = (toTime) => {
        const toTimeName = "toTime-" + this.props.dateId;
        $(this.refs._valid).bootstrapValidator('updateStatus', toTimeName, 'NOT_VALIDATED').bootstrapValidator('validateField', toTimeName);
        this.timeObj["toTime"] = toTime;
    }

    timeSelect = () => {
        this.props.setting(this.timeObj);
    }

    render() {
        const {fromDate, fromTime, toDate, toTime, dateId} = this.props;
        return (
            <div>
                <UiTabs id="tabs">
                    <ul>
                        <li>
                            <a href="#tabs-quick">빠른 선택</a>
                        </li>
                        <li>
                            <a href="#tabs-custom">직접 입력</a>
                        </li>
                    </ul>
                    <div id="tabs-quick">
                        <table className="table" style={{marginBottom:"0px"}}>
                            <tbody>
                                <tr>
                                    <td className="time" onClick={() => this.quickTime(0, "days")}>오늘</td>
                                    <td className="time" onClick={() => this.quickTime(1, "days")}>어제</td>
                                    <td className="time" onClick={() => this.quickTime(15, "time")}>15분전</td>
                                    <td className="time" onClick={() => this.quickTime(30, "day")}>30일전</td>
                                </tr>
                                <tr>
                                    <td className="time" onClick={() => this.quickTime(0, "weeks")}>이번주</td>
                                    <td className="time" onClick={() => this.quickTime(1, "weeks")}>저번주</td>
                                    <td className="time" onClick={() => this.quickTime(30, "time")}>30분전</td>
                                    <td className="time" onClick={() => this.quickTime(60, "day")}>60일전</td>
                                </tr>
                                <tr>
                                    <td className="time" onClick={() => this.quickTime(0, "months")}>이번달</td>
                                    <td className="time" onClick={() => this.quickTime(1, "months")}>저번달</td>
                                    <td className="time" onClick={() => this.quickTime(60, "time")}>1시간전</td>
                                    <td className="time" onClick={() => this.quickTime(90, "day")}>90일전</td>
                                </tr>
                                <tr>
                                    <td className="time" onClick={() => this.quickTime(0, "years")}>올해</td>
                                    <td className="time" onClick={() => this.quickTime(1, "years")}>지난해</td>
                                    <td className="time" onClick={() => this.quickTime(240, "time")}>4시간전</td>
                                    <td className="time" onClick={() => this.quickTime(300, "day")}>300일전</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="tabs-custom">
                        <BootstrapValidator options={this.validatorOptions}>
                            <div className="row" ref="_valid">
                               <div className="form-group col-md-4">
                                    <div className="input-group smart-form">
                                        <label className="input"> 
                                            <i className="icon-append fa fa-calendar" style={{zIndex:"4"}}/>
                                            <DatePicker id={"fromDate-" + dateId}
                                                        inputname={"fromDate-" + dateId}
                                                        className="timeSetting"
                                                        minRestrict={"#toDate-" + dateId}
                                                        dateFormat="yy-mm-dd"
                                                        getDate={this.getFromDate}
                                                        setDate={fromDate}/>
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group col-md-2">
                                    <div className="input-group smart-form">
                                        <label className="input"> 
                                            <i className="icon-append fa fa-clock-o" style={{zIndex:"4"}}/>
                                            <ClockPicker className="form-control"
                                                         inputname={"fromTime-" + dateId}
                                                         data-autoclose="true"
                                                         setTime={fromTime}
                                                         getTime={this.getFromTime} />
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group col-md-4">
                                    <div className="input-group smart-form">
                                        <label className="input"> 
                                            <i className="icon-append fa fa-calendar" style={{zIndex:"4"}}/>
                                            <DatePicker id={"toDate-" + dateId}
                                                        inputname={"toDate-" + dateId}
                                                        className="timeSetting"
                                                        maxRestrict={"#fromDate-" + dateId}
                                                        dateFormat="yy-mm-dd"
                                                        getDate={this.getToDate}
                                                        setDate={toDate}/>
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group col-md-2">
                                    <div className="input-group smart-form">
                                        <label className="input"> 
                                            <i className="icon-append fa fa-clock-o" style={{zIndex:"4"}}/>
                                            <ClockPicker className="form-control"
                                                        inputname={"toTime-" + dateId}
                                                        data-autoclose="true"
                                                        setTime={toTime}
                                                        getTime={this.getToTime} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">&nbsp;</div>
                            <div className="row">
                                <div className="col-md-10">&nbsp;</div>
                                <div className="form-group col-md-2" style={{textAlign:"right"}}>
                                    <button ref="_button" type="button" className="btn btn-primary btn-sm" onClick={() => this.timeSelect()}>선택</button>
                                </div>
                            </div>
                        </BootstrapValidator>
                    </div>
                </UiTabs>
            </div>
        )
    }
}