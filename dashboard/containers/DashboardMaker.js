import React from 'react'

import { visualizeList, loadItem, changeEditable, saveDashboard, loadItems, resetData,
         timeSetting, removeGrid, updateDashboard, selectDashboarItemTab, customComponentPagingList,
         loadCustomComponentList, removeGridForId, reloadData, updateDashboardRefresh } from '../DashboardActions';
import UiValidate from '../../../components/forms/validation/UiValidate'
import {OverlayTrigger, Popover} from 'react-bootstrap'
import { Responsive, WidthProvider } from 'react-grid-layout';
import queryString from 'query-string';
import { connect } from 'react-redux';
import PagingTable from '../../common/components/PagingTable';
import BasicCurveLineChart from "../../common/components/charts/BasicCurveLineChart";
import BasicCurveLineAreaChart from "../../common/components/charts/BasicCurveLineAreaChart";
import PieChart from "../../common/components/charts/PieChart";
import ActiveStackedColumnChart from "../../common/components/charts/ActiveStackedColumnChart";
import HeatMapChart from "../../common/components/charts/HeatMapChart";
import TimeSetting from '../components/TimeSetting';
import CustomComponentLoader from '../components/CustomComponentLoader';
import { calcQuickTime } from '../../common/utils/DateUtil'
import { smallBox } from '../../../components/utils/actions/MessageActions'
import UiTabs from '../../../components/ui/UiTabs';
import ModalHeader from '../../common/components/ModalHeader'

import '../css/style.css';
import '../../../../../node_modules/react-grid-layout/css/styles.css'
import '../../../../../node_modules/react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive);

const validateOptions = {
  highlight: function (element) {
      $(element).closest('section').removeClass('has-success').addClass('has-error');
  },
  unhighlight: function (element) {
      $(element).closest('section').removeClass('has-error').addClass('has-success');
  },
  errorElement: 'span',
  errorClass: 'help-block'
};

class DashboardMaker extends React.Component {

  constructor() {
    super();
    this.layoutInfoList = []
    this.layouts = {
      lg : [],
      md : [],
      sm : [],
      xs : [],
      xxs : []
    }
    this.timeTypeRadioList = []
  }

  onLayoutChange = (layout, layouts) => {
    this.layoutInfoList = layout;
    this.layouts = layouts;
  }

  componentDidMount() {
    this.props.doTimeSetting();
    let id = queryString.parse(this.props.location.search).id;
    let mode = queryString.parse(this.props.location.search).mode;
    this.props.doVisualizeList(this.pageData);
    this.props.doCustomComponentPagingList(null);
    this.props.doLoadCustomComponentList();
    if(mode == "add" || mode == "edit")this.props.doChangeEditable(false);
    else this.props.doChangeEditable(true);

    this.props.doResetData();
    if(mode != "add"){
      let time = this.props.dash.fromDate + "T" + this.props.dash.fromTime + ".000Z/" +
                  this.props.dash.toDate + "T" + this.props.dash.toTime + ".000Z";
      this.props.doLoadItems(id, time);
    }
    
    if (this.props.dash.dashboard && this.props.dash.dashboard.refresh == 'Y') {      
      this.interval = this.createInterval()
      const {refresh_interval, refresh_unit} = this.props.dash.dashboard
      
      this.selectedTimeObj = {
        "option": refresh_interval,
        "type":refresh_unit
      }
    }
  }

  reloadData = () => {    
    const {refresh, refresh_interval, refresh_unit} = this.props.dash.dashboard
    if (refresh == 'Y') {
      const timeObj = calcQuickTime(refresh_interval, refresh_unit)
      timeObj["option"] = refresh_interval
      timeObj["type"] = refresh_unit    
      this.props.doTimeSetting(timeObj);
    }
  }

  createInterval = () => {    
    this.reloadData()
    return setInterval(() => { 
      this.reloadData()
    }, 600 * 1000)
  }

  timeSetting = (timeObj) => {    
    timeObj["fromTime"] = timeObj["fromTime"].substring(0,5)
    timeObj["toTime"] = timeObj["toTime"].substring(0,5)
    this.selectedTimeObj = timeObj
    if (timeObj.option == "" && timeObj.type == "") {      
      clearInterval(this.interval)
      this.props.doUpdateDashboardRefresh(this.props.dash.dashboard.dash_id, 'N', '', '')
      this.refs._useRefresh.checked = false
    }
    this.props.doTimeSetting(timeObj);
  }

  componentWillReceiveProps(nextProps) {
    let id = queryString.parse(nextProps.location.search).id;
    let mode = queryString.parse(nextProps.location.search).mode;

    if(this.props.dash.fromDate != nextProps.dash.fromDate || this.props.dash.toDate != nextProps.dash.toDate ||
       this.props.dash.fromTime != nextProps.dash.fromTime || this.props.dash.toTime != nextProps.dash.toTime ||
       queryString.parse(this.props.location.search).id != id || queryString.parse(this.props.location.search).mode != mode){
      this.props.doVisualizeList(this.pageData);
      if(mode == "add" || mode == "edit")this.props.doChangeEditable(false);
      else this.props.doChangeEditable(true);

      this.props.doResetData();
      if(mode != "add"){
        let time = nextProps.dash.fromDate + "T" + nextProps.dash.fromTime + ".000Z/" +
                  nextProps.dash.toDate + "T" + nextProps.dash.toTime + ".000Z";
        this.props.doLoadItems(id, time);
      }
    }
    
    if (this.props.dash.dashboard.refresh == 'N' &&
      nextProps.dash.dashboard.refresh == 'Y' ) {
      clearInterval(this.interval)
      this.interval = this.createInterval()
    }
  }

  changeVisualPaging = (data) => {
    this.props.doVisualizeList(data);
  }

  changeCustomComponentPaging = (data) => {
    this.props.doCustomComponentPagingList(data);
  }

  addGridList = (e, item_id) => {
    e.preventDefault()
    if (item_id) {
      let time = this.props.dash.fromDate + "T" + this.props.dash.fromTime + ".000Z/" +
                      this.props.dash.toDate + "T" + this.props.dash.toTime + ".000Z"
      if (this.props.dash.selectedDashboardItemTab == 'visualize') {
        const value = this.timeTypeRadioList["timeTypeRadio_" + item_id]
        if(value != ""){
          let split = value.split("/")
          this.props.doLoadItem(split[0], split[1], time, this.props.dash.selectedDashboardItemTab)
        }
      } else {
        this.props.doLoadItem(item_id, 'DYNAMIC', time, this.props.dash.selectedDashboardItemTab)
      }
      $("#addGridModal").modal("hide")
    }
  }

  removeGridList = (e, id) => {
    e.preventDefault()
    this.props.doRemoveGridForId(id);
    $("#addGridModal").modal("hide");
  }

  saveDashboard = () => {
    let mode = queryString.parse(this.props.location.search).mode;
    if(mode == "edit"){
      let reqData = {
        dash_id : queryString.parse(this.props.location.search).id,
        items : []
      }
      let layoutList = this.layoutInfoList;
      for(let i=0;i<layoutList.length;i++){
        let id = this.props.dash.gridList[i].id.replace("_" + this.props.dash.gridList[i].itemType, "")
        reqData.items.push({
          "item_type" : this.props.dash.gridList[i].itemType,
          "item_id" : id,
          "width" : layoutList[i].w,
          "height" : layoutList[i].h,
          "coord_x" : layoutList[i].x,
          "coord_y" : layoutList[i].y,
          "static_date" : this.props.dash.gridList[i].static_date
        })
      }

      this.props.doUpdateDashboard(reqData);
      this.props.history.push("/management/configuration");
    }else{
      $("#saveModal").modal("show");
    }
  }

  saveModalsubmit = (e) => {
    e.preventDefault();
    let {_saveModalForm} = this.refs;

    let reqData = {
      dash_name : _saveModalForm.dash_name.value,
      description : _saveModalForm.description.value,
      items : []
    }

    let layoutList = this.layoutInfoList;
    for(let i=0;i<layoutList.length;i++){
      let id = this.props.dash.gridList[i].id.replace("_" + this.props.dash.gridList[i].itemType, "")
      reqData.items.push({
        "item_type" : this.props.dash.gridList[i].itemType,
        "item_id" : id ,
        "width" : layoutList[i].w,
        "height" : layoutList[i].h,
        "coord_x" : layoutList[i].x,
        "coord_y" : layoutList[i].y,
        "static_date" : this.props.dash.gridList[i].static_date
      })
    }

    this.props.doSaveDashboard(reqData);
    $("#saveModal").modal("hide");
    _saveModalForm.dash_name.value = "";
    _saveModalForm.description.value = "";
    this.props.history.push("/management/configuration");
  }

  timePopUpShow = () => {
    $("#timeSettingModal").modal();
  }

  timePopUpHide = () => {
    $("#timeSettingModal").modal("hide");
  }

  deleteGrid = (idx) => {
    this.props.doRemoveGrid(idx);
  }

  existGridItem = (id) => {
    let isAdded = false
    const array = this.props.dash.gridList.filter((gridItem) => {
        return gridItem.id == id;
    })
    if (array.length > 0)
      isAdded = true
    return isAdded
  }

  onTimeTypeRadioChange = (id, value) => {
    this.timeTypeRadioList[id] = value
  }

  onChangeRefresh = (e) => {    
    if (this.selectedTimeObj && this.selectedTimeObj.type != "") {
      const {option, type} = this.selectedTimeObj
      let refresh = 'N'
      if (e.target.checked == true)
        refresh = 'Y'
      else
        clearInterval(this.interval)
      this.props.doUpdateDashboardRefresh(this.props.dash.dashboard.dash_id, refresh, option, type)
    } else {
      smallBox({
        title: "자동갱신 실패.",
        content: `<i class='fa fa-clock-o'></i> <i>빠른선택이 선택되어야 합니다.</i>`,
        color: "#C90000",
        iconSmall: "fa fa-thumbs-down bounce animated",
        timeout: 4000
      })
      this.refs._useRefresh.checked = false
      this.props.doUpdateDashboardRefresh(this.props.dash.dashboard.dash_id, 'N', '', '')
      clearInterval(this.interval)
    }
  }

  render() {
    return (
      <div className="defaultPage">
        { this.props.dash.editable == false ?
          <React.Fragment>
            <div style={{paddingTop: 20}}>
              <header className="traceHader dashboard-top-toolbar">
                <div>
                  <h2>{this.props.dash.dashboard.dash_id ? this.props.dash.dashboard.dash_name:"대시보드 생성"}</h2>
                  <h4>{this.props.dash.dashboard.dash_id ? this.props.dash.dashboard.description:""}</h4>
                </div>
                <div className="headerAction">
                  <div className="dashboard-top-toolbar">
                    <button className="btn btn-xcon btn-xcon-blue pull-right" onClick={() => {
                      this.saveDashboard()
                    }}>저장&nbsp;&nbsp;<i className="material-icons">done</i>
                    </button>
                    <button className="btn btn-xcon btn-xcon-grey pull-right" onClick={() => {
                      this.props.history.push("/management/configuration")
                    }}>취소&nbsp;&nbsp;<i className="material-icons">clear</i>
                    </button>
                  </div>
                </div>
              </header>
              <hr/>
              <button style={{ marginLeft: "50%",transform: "translateX(-50%)"}} className="btn btn-xcon btn-xcon-white" data-toggle="modal" data-target="#addGridModal">
                대시보드 아이템 추가하기
              </button>
            </div>
          </React.Fragment> : ""
        }
        <article>
          {
            this.props.dash.editable == true  &&
            this.props.dash.dashboard != {} ?
            <div>
              <header className="traceHeader dashboard-top-toolbar">
                <div style={{width:"40%"}}>
                    <h2>{this.props.dash.dashboard.dash_name}</h2>
                    <h4>{this.props.dash.dashboard.description}</h4>
                </div>
                <div style={{width:"10%"}}></div>
                <div className="traceHeader-action">                  
                    {
                        this.props.dash.fromDate != "" ?
                          <TimeSetting
                              fromDate={this.props.dash.fromDate}
                              fromTime={this.props.dash.fromTime}
                              toDate={this.props.dash.toDate}
                              toTime={this.props.dash.toTime}
                              setting={(timeObj) => {
                                this.timeSetting(timeObj);
                              }}
                              selectedTimeObj={this.selectedTimeObj}
                          /> : null
                    }                                      
                </div>
                <form className="smart-form none-border">
                        <label className="toggle" style={{textAlign:"right"}}>
                          <input type="checkbox" name="useRefresh" ref="_useRefresh"
                            defaultChecked={this.props.dash.dashboard && this.props.dash.dashboard.refresh == 'Y' ? true : false}
                            onChange={(e)=> {this.onChangeRefresh(e)}}  />
                          <i data-swchon-text="ON" data-swchoff-text="OFF" /><span className="dashboard-refresh">자동 갱신 :</span>
                        </label>
                </form>
              </header>
            </div> : ""
          }
          <main className="dashboard-main padding-top-zero">
          {
            this.props.dash.gridList.length > 0 && this.props.dash.layoutList.length > 0?
            <ResponsiveGridLayout className="layout" layout={this.layouts} 
                                  onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}>
              {
                this.props.dash.gridList.map((item, idx)=>{
                  let startTime = this.props.dash.fromDate + "T" + this.props.dash.fromTime + ".000Z"
                  let endTime = this.props.dash.toDate + "T" + this.props.dash.toTime + ".000Z";
                  let maxHeight = Number(this.props.dash.layoutList[idx].h) * 146;
                  return (
                  <div className="dashboard-widget" key={item.id} data-grid={this.props.dash.layoutList[idx]}>
                      <header>
                        <span className="widget-icon"><i className="material-icons md-24" style={{paddingTop:10}}>equalizer</i></span>
                        <h2>{item.name}</h2>
                        {
                          this.props.dash.editable == false ? 
                          <div className="dashboard-widget-ctrls">
                            <a className="button-icon" onClick={() => {this.deleteGrid(idx)}}>
                              <i className="fa fa-times" aria-hidden="true"></i>
                            </a>
                          </div> : 
                          <div className="dashboard-widget-ctrls">
                            <OverlayTrigger placement="left"
                                              overlay={<Popover id={"popover-right-popover"+idx}>
                                              표츌 시간 유형 : {item["static_date"]=="Y"?"선택 시간값":"저장 시간값"}<br/>
                                              시작 시간 : {item.start}<br/>
                                              종료 시간 : {item.end}<br/>
                                              </Popover>}><a className="button-icon"><i
                                className="fa fa-info"/></a></OverlayTrigger>
                          </div>
                        }
                      </header>
                      {
                        item.itemType === 'V' ? 
                        <div style={(item.chartType == "0" || item.chartType == "1" || item.chartType == "2" || item.chartType == "7" 
                                    ?{maxHeight:maxHeight+"px",overflowY:"auto"}:{})}>
                          {item.chartType == "0" ? <TableChartRender list={item.allList}/> : ""}
                          {item.chartType == "1" ? <TableChartRender list={item.allList}/> : ""}
                          {item.chartType == "2" ? <GridChartRender list={item.allList}/> : ""}
                          {item.chartType == "3" ? <LineChartRender list={item.allList} index={idx}/> : ""}
                          {item.chartType == "4" ? <LineAreaChartRender list={item.allList} index={idx}/> : ""}
                          {item.chartType == "5" ? <BarChartRender list={item.allList} index={idx}/> : ""}
                          {item.chartType == "6" ? <PieChartRender list={item.allList} index={idx}/> : ""}
                          {item.chartType == "7" ? <HeatmapChartRender list={item.allList} index={idx}/> : ""}
                        </div>
                        : 
                        <div style={{maxHeight:maxHeight+"px",overflowY:"auto"}}>
                          <CustomComponentLoader path={item.path} startTime={startTime} endTime={endTime} />
                        </div>
                      }
                    </div>
                  )
                })
              }
            </ResponsiveGridLayout> : ""
          }
          </main>
        </article>

        <div className="modal fade" id="saveModal" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" style={{ width: "300px" }}>
            <UiValidate options={validateOptions}>
                <form noValidate="novalidate" ref="_saveModalForm" onSubmit={this.saveModalsubmit} id="saveModalForm">
                <div className="modal-content">
                    <div className="modal-header">
                      <ModalHeader icon="fa fa-cube fa-fw" title="대시보드 저장"/>
                    </div>
                    <div className="modal-body custom-scroll terms-body smart-form">
                    <fieldset>
                        <section>
                            <label className="label">대시보드 명 :</label>
                            <label className="input">
                                <input type="text" name="dash_name" data-smart-validate-input=""
                                    data-required=""/>
                            </label>
                        </section>
                    </fieldset>
                    <fieldset>
                        <section>
                            <label className="label">대시보드 설명 :</label>
                            <label className="input">
                                <input type="text" name="description" data-smart-validate-input=""
                                    data-required=""/>
                            </label>
                        </section>
                    </fieldset>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">완료</button>
                    </div>
                </div>
                </form>
            </UiValidate>
            </div>
        </div>

        <div className="modal fade" id="timeSettingModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" style={{width:"50%"}}>
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-xconClose" data-dismiss="modal" aria-hidden="true" onClick={() => this.timePopUpHide()}>
                  <i className="material-icons">close</i>
                </button>
                <h4 className="modal-title">시간 선택</h4>
              </div>
              <div className="modal-body">
              {
                this.props.dash.fromDate != "" ?
                <TimeSetting fromDate={this.props.dash.fromDate}
                              fromTime={this.props.dash.fromTime}
                              toDate={this.props.dash.toDate}
                              toTime={this.props.dash.toTime}
                              setting={(timeObj) => this.timeSetting(timeObj)}/> : ""
              }
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="addGridModal" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" style={{ width: "600px" }}>
              <form noValidate="novalidate" ref="_addGridModalForm" id="addGridModalModalForm">
              <div className="modal-content">
                  <div className="modal-header">
                    <ModalHeader iconType="mi" icon="beenhere" title="대시보드 아이템 추가"/>
                  </div>
                  <div className="modal-body custom-scroll terms-body" style={{maxHeight:"570px"}}>
                    <UiTabs id="dashboardItemTab">
                      <ul>
                        <li className={ this.props.dash.selectedDashboardItemTab === "visualize" ? 'ui-tabs-active' : null}>
                            <a href="#tabs-visualize" data-toggle="tab" onClick={() => this.props.doSelectDashboarItemTab("visualize")}>시각화</a>
                        </li>
                        <li className={ this.props.dash.selectedDashboardItemTab == 'custom' ? 'ui-tabs-active' : null}>
                            <a href="#tabs-custom" data-toggle="tab" onClick={() => this.props.doSelectDashboarItemTab("custom")}>컴포넌트</a>
                        </li>
                      </ul>
                    <div className="tab-content">
                      <div id="tabs-visualize" className={ this.props.dash.selectedDashboardItemTab === 'visualize' ? 'tab-pane fade in active' : 'tab-pane fade'}>
                        <table className="table modal-table">
                          <thead>
                            <tr>
                              <th style={{width:"50%"}}>시각화 명</th>
                              <th style={{width:"20%"}}>선택 시간 값</th>
                              <th style={{width:"20%"}}>저장 시간 값</th>
                              <th style={{width:"10%"}}></th>
                            </tr>
                          </thead>
                          <tbody>
                          {this.props.dash.visualizeList && this.props.dash.visualizeList.map(
                            (item, idx) => {
                              const isAdded = this.existGridItem(item.vis_id + '_V')
                              this.timeTypeRadioList["timeTypeRadio_" + item.vis_id] = item.vis_id+"/DYNAMIC"
                              return (
                                <tr key={idx}>
                                  <td style={{textAlign:"left"}}>{item.vis_name}</td>
                                  <td>
                                      <input type="radio" name={"timeTypeRadio_" + item.vis_id} defaultChecked value={item.vis_id+"/DYNAMIC"} onChange={() => {this.onTimeTypeRadioChange("timeTypeRadio_" + item.vis_id, item.vis_id+"/DYNAMIC")}}/>
                                  </td>
                                  <td>
                                      <input type="radio" name={"timeTypeRadio_" + item.vis_id} value={item.vis_id+"/FIXED"} onChange={() => {this.onTimeTypeRadioChange("timeTypeRadio_" + item.vis_id, item.vis_id+"/FIXED")}} />
                                  </td>
                                  <td>
                                    { isAdded == false ? 
                                      <button className='btn btn-xcon btn-xcon-grey-xs update-btn'
                                              onClick={(e) => this.addGridList(e, item.vis_id)}>
                                        추가&nbsp;&nbsp;<i className="material-icons" style={{fontSize:10}}>add_circle_outline</i>
                                      </button> :
                                      <button className='btn btn-xcon btn-xcon-grey-xs delete-btn'
                                              onClick={(e) => this.removeGridList(e, item.vis_id + '_V')}>
                                        삭제&nbsp;&nbsp;<i className="material-icons" style={{fontSize:10}}>delete</i>
                                      </button>
                                    }
                                  </td>
                                </tr>
                              )
                            })
                          }
                          </tbody>
                        </table>
                        <PagingTable
                          totalPage={this.props.dash.visualPagenation.totalPage}
                          currentPage={this.props.dash.visualPagenation.currentPage}
                          listSize={this.props.dash.visualPagenation.listSize}
                          pagingFunction={this.changeVisualPaging} />
                      </div>
                      <div id="tabs-custom" className={ this.props.dash.selectedDashboardItemTab == 'custom' ? 'tab-pane fade in active' : 'tab-pane fade'}>
                        <table className="table modal-table">
                          <thead>
                            <tr>
                              <th style={{width:"90%"}}>컴포넌트 명</th>
                              <th style={{width:"10%"}}></th>                              
                            </tr>
                          </thead>
                          <tbody>
                          {this.props.dash.customComponentPagingList && this.props.dash.customComponentPagingList.map(
                            (item, idx) => {
                              const isAdded = this.existGridItem(item.component_id + '_C')
                              return (
                                <tr key={idx}>
                                  <td style={{textAlign:"left"}}>{item.name}</td>
                                  <td>
                                      { isAdded == false ? 
                                      <button className='btn btn-xcon btn-xcon-grey-xs update-btn'
                                              onClick={(e) => this.addGridList(e, item.component_id)}>
                                        추가&nbsp;&nbsp;<i className="material-icons">add_circle_outline</i>
                                      </button> :
                                      <button className='btn btn-xcon btn-xcon-grey-xs delete-btn'
                                              onClick={(e) => this.removeGridList(e, item.component_id + '_C')}>
                                        삭제&nbsp;&nbsp;<i className="material-icons">delete</i>
                                      </button>
                                      }
                                  </td>
                                </tr>
                              )
                            })
                          }
                          </tbody>
                        </table>
                        <PagingTable
                          totalPage={this.props.dash.customComponentPagenation.totalPage}
                          currentPage={this.props.dash.customComponentPagenation.currentPage}
                          listSize={this.props.dash.customComponentPagenation.listSize}
                          pagingFunction={this.changeCustomComponentPaging} />                        
                      </div>
                    </div>
                  </UiTabs>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const GridChartRender = (props) => {
  const { list } = props;

  if(list.length > 2){
    let valueMap = {};
    let order = [];
    let timeFlag = false;
    for(let i=0;i<list.length;i++){
      if(list[i].type == "V")valueMap = list[i].list;
      if(list[i].type == "T"){order.push(list[i].key);timeFlag=true;}
      if(list[i].type == "D")order.push(list[i].key);
    }

    let datasets = [];
    let xLabels = list.filter(item => item.key == order[0])[0].list.reduce((a, b)=>{if(a.indexOf(b)<0)a.push(b);return a;},[]);
    let yLabels = list.filter(item => item.key == order[1])[0].list.reduce((a, b)=>{if(a.indexOf(b)<0)a.push(b);return a;},[]);

    if(!timeFlag || order[1] == "시간"){
      let tempLabels = xLabels;
      xLabels = yLabels;
      yLabels = tempLabels;
    }

    for(let i=0;i<yLabels.length;i++){
      datasets.push(xLabels.map((item) => {return valueMap[yLabels[i]+"_"+item] || '-'}))
    }

    if(timeFlag == true){
      xLabels = xLabels.map((item) => {
          let val = item.split("T");
          let value = val[0].split("-")[1]+"-"+val[0].split("-")[2]+" "+val[1].split(":")[0]+":"+val[1].split(":")[1];
          return value;
        }
      )
    }

    return (
      <table className="table dashboard-widget-table">
        <tbody>
          <tr style={{fontWeight:"bold",padding:"2px"}}>
            <td>&nbsp;</td>
            {xLabels.map((item, idx) => {return <td key={idx} style={{padding:"2px"}}>{item}</td>})}  
          </tr>
          {
            yLabels.map((item, idx) => {
              return <tr key={idx}>
                <td style={{fontWeight:"bold",padding:"2px"}}>{item}</td>
                {
                  datasets[idx].length > 0 && datasets[idx].map((data, idx2) => {
                    return <td key={idx2} style={{padding:"2px"}}>{data}</td>
                  })
                }
              </tr>
            })
          }
        </tbody>
      </table>)        
  }
  return ""
}

const TableChartRender = (props) => {
  const { list } = props;

  if(list.length > 0){
    return (
      <div>
        <table className="table dashboard-widget-table">
          <tbody>
            <tr>
            {
              list.map((item, idx) => {
                if(item.type != "V"){
                  return <td style={{fontWeight:"bold"}} key={idx}>{item.key}</td>
                }
              })
            }
            </tr>
            {
              list[0].list.map((n, i) => {
                return <tr key={i}>
                  {
                    list.map((item, idx) => {
                      let value = item.list[i];
                      if(item.type == "T"){
                        let val = value.split("T");
                        let timevalue = val[0].split("-")[1]+"-"+val[0].split("-")[2]+" "+val[1].split(":")[0]+":"+val[1].split(":")[1];
                        return <td key={idx}>{timevalue || '-'}</td>
                      }else{
                        if(item.type != "V"){
                          return <td key={idx}>{value || '-'}</td>
                        }
                      }
                    })
                  }
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
  return ""
}

const PieChartRender = (props) => {
  const { list, index } = props;

  if (list.length > 2) {
    let timeList = [];
    let dimenList = [];
    let metricList = [];

    for (let i = 0; i < list.length; i++) {
      if (list[i].type == "M") metricList = list[i].list;
      if (list[i].type == "T") timeList = list[i].list;
      if (list[i].type == "D") dimenList = list[i].list;
    }

    let datasets = [];
    let labelList = timeList.length > 0 && timeList.map((item) => {
      let val = item.split("T");
      let value = val[0].split("-")[1] + "-" + val[0].split("-")[2] + " " + val[1].split(":")[0] + ":" + val[1].split(":")[1];
      return value;
    });

    if (dimenList.length > 0) {
      labelList = dimenList.map((item) => {return item;});
    }

    let dataList = {
        data : metricList,
    }
    datasets.push(dataList)

    return <PieChart chartId={"pieChart" + index} data={{datasets : datasets, labels : labelList}} legend={true}/>
  }

  return ""
}

const LineChartRender = (props) => {
  const { list, index } = props;

  if (list.length > 2) {
    let timeList = [];
    let dimenList = [];
    let metricKey = "";
    let valueMap = {};
    for (let i = 0; i < list.length; i++) {
      if (list[i].type == "V") valueMap = list[i].list;
      if (list[i].type == "M") metricKey = list[i].key;
      if (list[i].type == "T") timeList = list[i].list.reduce((a, b) => {if (a.indexOf(b) < 0) a.push(b); return a;}, []);
      if (list[i].type == "D") dimenList = list[i].list.reduce((a, b) => {if (a.indexOf(b) < 0) a.push(b); return a;}, []);
    }

    let datasets = [];
    let labelList = timeList.map((item) => {
      let val = item.split("T");
      let value = val[0].split("-")[1] + "-" + val[0].split("-")[2] + " " + val[1].split(":")[0] + ":" + val[1].split(":")[1];
      return value;
    });

    if (dimenList.length == 0) {
      let dataList = {
          data : timeList.map((item) => {return valueMap[item] || 0}),
          label : metricKey
      }
      datasets.push(dataList)
    } else {
      for (let i = 0; i < dimenList.length; i++) {
        let dataList = {
            data : timeList.map((item) => {return valueMap[dimenList[i] + "_"+item] || 0}),
            label : dimenList[i]
        }
        datasets.push(dataList)
      }
    }

    return <BasicCurveLineChart chartId={"basicCurveLineChart" + index} data={{datasets : datasets, labels : labelList}} legend={true}/>
  }

  return ""
}

const LineAreaChartRender = (props) => {
  const { list, index } = props;

  if (list.length > 2) {
    let timeList = [];
    let dimenList = [];
    let metricKey = "";
    let valueMap = {};

    for (let i = 0; i < list.length; i++) {
      if (list[i].type == "V") valueMap = list[i].list;
      if (list[i].type == "M") metricKey = list[i].key;
      if (list[i].type == "T") timeList = list[i].list.reduce((a, b) => {if (a.indexOf(b) < 0) a.push(b); return a;}, []);
      if (list[i].type == "D") dimenList = list[i].list.reduce((a, b) => {if (a.indexOf(b) < 0) a.push(b); return a;}, []);
    }

    let datasets = [];
    let labelList = timeList.map((item) => {
      let val = item.split("T");
      let value = val[0].split("-")[1] + "-" + val[0].split("-")[2] + " " + val[1].split(":")[0] + ":" + val[1].split(":")[1];
      return value;
    });

    if (dimenList.length == 0) {
      let dataList = {
          data : timeList.map((item) => {return valueMap[item] || 0}),
          label : metricKey
      }
      datasets.push(dataList)
    } else {
      for (let i = 0; i < dimenList.length; i++) {
        let dataList = {
            data : timeList.map((item) => {return valueMap[dimenList[i] + "_" + item] || 0}),
            label : dimenList[i]
        }
        datasets.push(dataList)
      }
    }

    return <BasicCurveLineAreaChart chartId={"basicCurveLineAreaChart" + index} data={{datasets : datasets, labels : labelList}} legend={true}/>
  }

  return ""
}

const HeatmapChartRender = (props) => {
  const { list, index } = props;

  if (list.length > 2) {
    let valueMap = {};
    let order = [];
    let timeFlag = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].type == "V") valueMap = list[i].list;
      if (list[i].type == "T") {order.push(list[i].key); timeFlag = true;}
      if (list[i].type == "D") order.push(list[i].key);
    }

    let datasets = [];
    let xLabels = list.filter(item => item.key == order[0])[0].list.reduce((a, b) => {if (a.indexOf(b) < 0) a.push(b); return a;}, []);
    let yLabels = list.filter(item => item.key == order[1])[0].list.reduce((a, b) => {if (a.indexOf(b) < 0) a.push(b); return a;}, []);

    if (!timeFlag || order[1] == "시간") {
      let tempLabels = xLabels;
      xLabels = yLabels;
      yLabels = tempLabels;
    }

    for (let i = 0; i < yLabels.length; i++) {
      datasets.push(xLabels.map((item) => {return Number(valueMap[yLabels[i] + "_" + item] || 0)}));
    }

    if (timeFlag == true) {
      xLabels = xLabels.map((item) => {
          let val = item.split("T");
          let value = val[0].split("-")[1] + "-" + val[0].split("-")[2] + " " + val[1].split(":")[0] + ":" + val[1].split(":")[1];
          return value;
        }
      )
    }

    return <HeatMapChart chartId={"heatMapChart" + index} data={{datasets : datasets, xLabels : xLabels, yLabels : yLabels}}/>
  }

  return ""
}

const BarChartRender = (props) => {
  const { list, index } = props;

  if (list.length > 2) {
    let metricKey = "";
    let valueMap = {};
    let order = [];
    
    for (let i = 0; i < list.length; i++) {
      if (list[i].type == "V") valueMap = list[i].list;
      if (list[i].type == "M") metricKey = list[i].key;
      if (list[i].type == "T") order.push(list[i].key);
      if (list[i].type == "D") order.push(list[i].key);
    }

    let datasets = [];

    let labelList = list.filter(item => item.key == order[0])[0].list.map((item) => {
      if (order[0] == "시간") {
        let val = item.split("T");
        let value = val[0].split("-")[1] + "-" + val[0].split("-")[2] + " " + val[1].split(":")[0] + ":" + val[1].split(":")[1];
        return value;
      }
      return item;
    });
    labelList = labelList.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);

    let firstArr = list.filter(item => item.key == order[0])[0].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
    let secondArr = [];

    if (order.length > 1) {
      secondArr = list.filter(item => item.key == order[1])[0].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
    }

    if (order[1] == "시간") {
      firstArr = [];
      secondArr = [];
      firstArr = list.filter(item => item.key == order[1])[0].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
      if (order.length > 1) {
        secondArr = list.filter(item => item.key == order[0])[0].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
      }
    }

    if (order.length == 1) {
      let dataList = {
        data : firstArr.map((item) => { return valueMap[item] || 0 }),
        label : metricKey
      }
      datasets.push(dataList)
    } else {
      for (let i = 0; i < secondArr.length; i++) {
        let dataList = {
          data : firstArr.map((item) => { return valueMap[secondArr[i] + "_" + item] || 0 }),
          label : secondArr[i]
        }
        datasets.push(dataList)
      }
    }

    return <ActiveStackedColumnChart chartId={"activeStackedColumnChart" + index} data={{datasets : datasets, labels : labelList}} legend={true}/>;
  }

  return ""
}

export default connect((state) => ({
  dash: state.dash
}), (dispatch) => ({
  doVisualizeList(pageData) { dispatch(visualizeList(pageData)) },
  doLoadItem(item_id, type, time, selectedTab) { dispatch(loadItem(item_id, type, time, selectedTab)) },
  doChangeEditable(flag) { dispatch(changeEditable(flag)) },
  doSaveDashboard(reqData) { dispatch(saveDashboard(reqData)) },
  doUpdateDashboard(reqData) { dispatch(updateDashboard(reqData)) },
  doLoadItems(dash_id, time) { dispatch(loadItems(dash_id, time)) },
  doResetData() { dispatch(resetData()) },
  doTimeSetting(timeObj) { dispatch(timeSetting(timeObj)) },
  doRemoveGrid(idx) { dispatch(removeGrid(idx)) },
  doSelectDashboarItemTab(tabName) { dispatch(selectDashboarItemTab(tabName)) },
  doCustomComponentPagingList(pageData) { dispatch(customComponentPagingList(pageData)) },
  doLoadCustomComponentList() { dispatch(loadCustomComponentList()) },
  doRemoveGridForId(id) { dispatch(removeGridForId(id)) },
  doReloadData(gridList, timeObj) { dispatch(reloadData(gridList, timeObj))},
  doUpdateDashboardRefresh(dash_id, refresh, interval, unit) { dispatch(updateDashboardRefresh(dash_id, refresh, interval, unit))}
}))(DashboardMaker);

