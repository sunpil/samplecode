import React from 'react';
import UiTabs from '../../../components/ui/UiTabs';
import DatePicker from '../../common/components/DatePicker';
import ClockPicker from '../../common/components/ClockPicker';
import '../css/TimeSetting.css';
import {calcQuickTime} from '../../common/utils/DateUtil'

export default class TimeSetting extends React.Component {
    constructor (props) {
        super(props);
        this.timeObj = {};
    }

    componentDidMount() {
        const {fromDate, fromTime, toDate, toTime} = this.props;
        this.timeObj["fromDate"] = fromDate;
        this.timeObj["fromTime"] = fromTime;
        this.timeObj["toDate"] = toDate;
        this.timeObj["toTime"] = toTime;

        let fTimeArr = fromTime.split(":");
        let tTimeArr = toTime.split(":");

        if(fTimeArr.length == 3){
            let ftime = "";
            let ttime = "";
            for(let i=0;i<2;i++){
                ftime += fTimeArr[i] + (i==0?":":"");
                ttime += tTimeArr[i] + (i==0?":":"");
            }
            this.timeObj["fromTime"] = ftime;
            this.timeObj["toTime"] = ttime;
        }

        this.timeObj["option"] = "";
        this.timeObj["type"] = "";
    }

    quickTime = (data) => { 
        if(data==="")
        return
        let jsonData = JSON.parse(data)
        let option = jsonData.option;
        let type = jsonData.type;
        
        this.timeSelect();
        const calcTime = calcQuickTime(option, type)
        this.timeObj["fromDate"] = calcTime["fromDate"]
        this.timeObj["fromTime"] = calcTime["fromTime"]
        this.timeObj["toDate"] = calcTime["toDate"]
        this.timeObj["toTime"] = calcTime["toTime"]
        this.timeObj["option"] = option;
        this.timeObj["type"] = type;

        this.props.setting(this.timeObj);
    }

    getFromDate = (fromDate) => {
        this.timeObj["fromDate"] = fromDate;
        this.timeSelect();
    }
    
    getFromTime = (fromTime) => {
        this.timeObj["fromTime"] = fromTime;
        this.timeSelect();
    }

    getToDate = (toDate) => {
        this.timeObj["toDate"] = toDate;
        this.timeSelect();
    }

    getToTime = (toTime) => {
        this.timeObj["toTime"] = toTime;
        this.timeSelect();
    }

    timeSelect = () => {
        this.timeObj["option"] = "";
        this.timeObj["type"] = "";
        this.props.setting(this.timeObj);
    }

    render() {
        const {fromDate, fromTime, toDate, toTime} = this.props;
        let fTimeArr = fromTime.split(":");
        let tTimeArr = toTime.split(":");
        let ftime = "";
        let ttime = "";
        if(fTimeArr.length == 3){    
            for(let i=0;i<2;i++){
                ftime += fTimeArr[i] + (i==0?":":"");
                ttime += tTimeArr[i] + (i==0?":":"");
            }
        }

        return (
            <div className="action-tool form-group">
                <div style={{width: "120px"}}>기간설정 :</div>
                <div>
                    <div className="input-group smart-form">
                        <label className="input" style={{width: "120px"}}>
                            <i className="icon-append fa fa-calendar" style={{zIndex:"4"}}/>
                            <DatePicker id="fromDate"
                                        minRestrict="#toDate"
                                        dateFormat="yy-mm-dd"
                                        getDate={this.getFromDate}
                                        setDate={fromDate}
                            />
                        </label>
                    </div>
                </div>
                <div>
                    <div className="input-group smart-form">
                        <label className="input" style={{width: "85px"}}>
                            <i className="icon-append fa fa-clock-o" style={{zIndex:"4"}}/>
                            <ClockPicker className="form-control"
                                inputName="fromTime"
                                data-autoclose="true"
                                setTime={ftime}
                                getTime={this.getFromTime} />
                        </label>
                    </div>
                </div>
                <div>
                    <div className="input-group smart-form">
                        <label className="input" style={{width: "120px"}}>
                            <i className="icon-append fa fa-calendar" style={{zIndex:"4"}}/>
                            <DatePicker id="toDate"
                                        maxRestrict="#fromDate"
                                        dateFormat="yy-mm-dd"
                                        getDate={this.getToDate}
                                        setDate={toDate}/>
                        </label>
                    </div>
                </div>
                <div>
                    <div className="input-group smart-form">
                        <label className="input"  style={{width: "85px"}}>
                            <i className="icon-append fa fa-clock-o" style={{zIndex:"4"}}/>
                            <ClockPicker className="form-control"
                                inputName="toTime"
                                data-autoclose="true"
                                setTime={ttime}
                                getTime={this.getToTime}/>
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <select onChange={e => this.quickTime(e.target.value)}>
                        <option value="">빠른선택</option>
                        <option className="time" value='{"option":15,"type": "time"}' >15분전</option>
                        <option className="time" value='{"option":30,"type": "time"}' >30분전</option>
                        <option className="time" value='{"option":60,"type": "time"}' >1시간전</option>
                        <option className="time" value='{"option":240,"type": "time"}' >4시간전</option>
                        <option className="time" value='{"option":0,"type": "day"}' >오늘</option>
                        <option className="time" value='{"option":1,"type": "day"}' >어제</option>
                        <option className="time" value='{"option":30,"type": "days"}' >30일전</option>
                        <option className="time" value='{"option":60,"type": "days"}' >60일전</option>
                        <option className="time" value='{"option":90,"type": "days"}' >90일전</option>
                        <option className="time" value='{"option":360,"type": "days"}' >300일전</option>
                        <option className="time" value='{"option":0,"type": "weeks"}' >이번주</option>
                        <option className="time" value='{"option":1,"type": "weeks"}' >저번주</option>
                        <option className="time" value='{"option":0,"type": "months"}' >이번달</option>
                        <option className="time" value='{"option":1,"type": "months"}' >저번달</option>
                        <option className="time" value='{"option":0,"type": "years"}' >올해</option>
                        <option className="time" value='{"option":1,"type": "years"}' >지난해</option>
                    </select>
                </div>
            </div>
        )
    }
}