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
        this.timeObj["fromTime"] = fromTime.substring(0,5);
        this.timeObj["toDate"] = toDate;
        this.timeObj["toTime"] = toTime.substring(0,5);

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
        let jsonData = JSON.parse(data)
        let option = jsonData.option;
        let type = jsonData.type;
        if (type != "") {
            this.timeSelect();        
            const calcTime = calcQuickTime(option, type)
            this.timeObj["fromDate"] = calcTime["fromDate"]
            this.timeObj["fromTime"] = calcTime["fromTime"]
            this.timeObj["toDate"] = calcTime["toDate"]
            this.timeObj["toTime"] = calcTime["toTime"]
            this.timeObj["option"] = option;
            this.timeObj["type"] = type;
        } else {
            this.timeObj["option"] = option;
            this.timeObj["type"] = type;
        }

        this.props.setting(this.timeObj);
    }

    getFromDate = (fromDate) => {
        this.setPreset('','')
        this.timeObj["fromDate"] = fromDate;
        this.timeSelect();        
        let el = document.getElementById( 'fromDate' );
        if( el ) el.blur();
    }

    getFromTime = (fromTime) => {        
        this.setPreset('','')
        this.timeObj["fromTime"] = fromTime.substring(0,5)
        this.timeSelect();
    }

    getToDate = (toDate) => {
        this.setPreset('','')
        this.timeObj["toDate"] = toDate;
        this.timeSelect();
        let el = document.getElementById( 'toDate' );
        if( el ) el.blur();
    }

    getToTime = (toTime) => {
        this.setPreset('','')
        this.timeObj["toTime"] = toTime.substring(0,5)
        this.timeSelect();
    }

    timeSelect = () => {
        this.timeObj["option"] = "";
        this.timeObj["type"] = "";
        this.props.setting(this.timeObj);
    }

    setPreset = (option, type) => {
        this.refs._preset.value = '{"option":' + option + ',"type": "' + type + '"}'
    }

    render() {
        let {fromDate, fromTime, toDate, toTime, selectedTimeObj} = this.props;
        fromTime = fromTime.substring(0, 5)
        toTime = toTime.substring(0,5)
        if (selectedTimeObj && selectedTimeObj.option != "" && selectedTimeObj.type != "") {                        
            this.setPreset(selectedTimeObj.option, selectedTimeObj.type)
        }
        return(
            <div className="action-tool form-group col-md-12" style={{width:"100%"}}>
                <div className="col-md-4">기간설정 :</div>
                <div className="input-group smart-form col-md-2">
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
                {!this.props.day || (this.props.day && this.props.day===false)?
                <div className="input-group smart-form col-md-1">
                    <label className="input" style={{width: "85px"}}>
                        <i className="icon-append fa fa-clock-o" style={{zIndex:"4"}}/>
                        <ClockPicker className="form-control"
                            inputName="fromTime"
                            data-autoclose="true"
                            setTime={fromTime}
                            getTime={this.getFromTime} />
                    </label>
                </div>:null}
                <div className="input-group smart-form col-md-2">
                    <label className="input" style={{width: "120px"}}>
                        <i className="icon-append fa fa-calendar" style={{zIndex:"4"}}/>
                        <DatePicker id="toDate"
                                    maxRestrict="#fromDate"
                                    dateFormat="yy-mm-dd"
                                    getDate={this.getToDate}
                                    setDate={toDate}/>
                    </label>
                </div>
                {!this.props.day || (this.props.day && this.props.day===false)?
                <div className="input-group smart-form col-md-1">
                    <label className="input"  style={{width: "85px"}}>
                        <i className="icon-append fa fa-clock-o" style={{zIndex:"4"}}/>
                        <ClockPicker className="form-control"
                            inputName="toTime"
                            data-autoclose="true"
                            setTime={toTime}
                            getTime={this.getToTime}/>
                    </label>
                </div>
                :null}
                <div className="form-group col-md-2">
                    <select onChange={e => this.quickTime(e.target.value)} ref="_preset">
                        <option value='{"option":,"type": ""}'>빠른선택</option>
                        {!this.props.day || (this.props.day && this.props.day===false)?<option className="time" value='{"option":15,"type": "time"}' >15분전</option>:null}
                         {!this.props.day || (this.props.day && this.props.day===false)?<option className="time" value='{"option":30,"type": "time"}' >30분전</option>:null}
                         {!this.props.day || (this.props.day && this.props.day===false)?<option className="time" value='{"option":60,"type": "time"}' >1시간전</option>:null}
                         {!this.props.day || (this.props.day && this.props.day===false)?<option className="time" value='{"option":240,"type": "time"}' >4시간전</option>:null}
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
        // return (
        //     <div>
        //         <UiTabs id="tabs">
        //             <ul>
        //                 <li>
        //                     <a href="#tabs-quick">빠른 선택</a>
        //                 </li>
        //                 <li>
        //                     <a href="#tabs-custom">직접 입력</a>
        //                 </li>
        //             </ul>
        //             <div id="tabs-quick">
        //                 <table className="table" style={{marginBottom:"0px"}}>
        //                     <tbody>
        //                         <tr>
        //                             <td className="time" onClick={() => this.quickTime(0, "days")}>오늘</td>
        //                             <td className="time" onClick={() => this.quickTime(1, "days")}>어제</td>
        //                             <td className="time" onClick={() => this.quickTime(15, "time")}>15분전</td>
        //                             <td className="time" onClick={() => this.quickTime(30, "day")}>30일전</td>
        //                         </tr>
        //                         <tr>
        //                             <td className="time" onClick={() => this.quickTime(0, "weeks")}>이번주</td>
        //                             <td className="time" onClick={() => this.quickTime(1, "weeks")}>저번주</td>
        //                             <td className="time" onClick={() => this.quickTime(30, "time")}>30분전</td>
        //                             <td className="time" onClick={() => this.quickTime(60, "day")}>60일전</td>
        //                         </tr>
        //                         <tr>
        //                             <td className="time" onClick={() => this.quickTime(0, "months")}>이번달</td>
        //                             <td className="time" onClick={() => this.quickTime(1, "months")}>저번달</td>
        //                             <td className="time" onClick={() => this.quickTime(60, "time")}>1시간전</td>
        //                             <td className="time" onClick={() => this.quickTime(90, "day")}>90일전</td>
        //                         </tr>
        //                         <tr>
        //                             <td className="time" onClick={() => this.quickTime(0, "years")}>올해</td>
        //                             <td className="time" onClick={() => this.quickTime(1, "years")}>지난해</td>
        //                             <td className="time" onClick={() => this.quickTime(240, "time")}>4시간전</td>
        //                             <td className="time" onClick={() => this.quickTime(300, "day")}>300일전</td>
        //                         </tr>
        //                     </tbody>
        //                 </table>
        //             </div>
        //             <div id="tabs-custom">
        //                 <div className="row">
        //                     <div className="form-group col-md-4">
        //                         <div className="input-group smart-form">
        //                             <label className="input">
        //                                 <i className="icon-append fa fa-calendar" style={{zIndex:"4"}}/>
        //                                 <DatePicker id="fromDate"
        //                                             minRestrict="#toDate"
        //                                             dateFormat="yy-mm-dd"
        //                                             getDate={this.getFromDate}
        //                                             setDate={fromDate}/>
        //                             </label>
        //                         </div>
        //                     </div>
        //                     <div className="form-group col-md-2">
        //                         <div className="input-group smart-form">
        //                             <label className="input">
        //                                 <i className="icon-append fa fa-clock-o" style={{zIndex:"4"}}/>
        //                                 <ClockPicker className="form-control"
        //                                             data-autoclose="true"
        //                                             setTime={fromTime}
        //                                             getTime={this.getFromTime} />
        //                             </label>
        //                         </div>
        //                     </div>
        //                     <div className="form-group col-md-4">
        //                         <div className="input-group smart-form">
        //                             <label className="input">
        //                                 <i className="icon-append fa fa-calendar" style={{zIndex:"4"}}/>
        //                                 <DatePicker id="toDate"
        //                                         maxRestrict="#fromDate"
        //                                         dateFormat="yy-mm-dd"
        //                                         getDate={this.getToDate}
        //                                         setDate={toDate}/>
        //                             </label>
        //                         </div>
        //                     </div>
        //                     <div className="form-group col-md-2">
        //                         <div className="input-group smart-form">
        //                             <label className="input">
        //                                 <i className="icon-append fa fa-clock-o" style={{zIndex:"4"}}/>
        //                                 <ClockPicker className="form-control"
        //                                             data-autoclose="true"
        //                                             setTime={toTime}
        //                                             getTime={this.getToTime}/>
        //                             </label>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="row">&nbsp;</div>
        //                 <div className="row">
        //                     <div className="col-md-10">&nbsp;</div>
        //                     <div className="form-group col-md-2" style={{textAlign:"right"}}>
        //                         <button type="button" className="btn btn-primary btn-sm" onClick={() => this.timeSelect()}>선택</button>
        //                      </div>
        //                 </div>
        //             </div>
        //         </UiTabs>
        //     </div>
        // )
    }
}