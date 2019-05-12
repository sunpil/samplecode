import React from 'react';

import { datasourceList, codeList, datasourceDetail, 
         cardinalList, filterTopnList, visualizeDatas,
         metricList, createMetric, deleteMetric,
         changeField, chartCheck, chartSelect, addList, removeList,
         saveChart, loadChart, chartList, removeChartData, timeSetting, 
         changeAggregationType, selectPostAggregationMetric, removePostAggregationMetric,
         setFirstMetricSorting, displaySearchQuery, getGroupByFilter } from '../VisualizeActions';
import { connect } from 'react-redux';
import UiValidate from '../../../components/forms/validation/UiValidate';
import DualListBox from '../components/DualListBox';

import VisualizeChart from "./VisualizeChart";
import TimeSetting from '../components/TimeSetting';

import { smallBox, SmartMessageBox } from "../../../components/utils/actions/MessageActions";
import '../css/style.css';

import { extractValue } from '../../common/MapFunctionUtil';

import ChartWrapper from "../../../hsuxd/components/ChartWrapper";
import ModalHeader from '../../common/components/ModalHeader'

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

class VisualizeMain extends React.Component {

  constructor() {
    super();
    this.selectedFilterList = [];
  }

  componentDidMount() {
    this.props.doTimeSetting();
    this.props.doDatasourceList(()=>{
      this.props.doCardinalList(this.makeCardinalRequestData());
      this.props.doMetricList($("#_datasourceSelect").val());
      this.props.doChartList();
    });
    this.props.docodeList(true);
    this.props.doChartCheck();
  }

  makeGroupbyStructure = (list) => {
    let dataSourceId = $("#_datasourceSelect").val();
    let stDate = this.props.visual.fromDate+"T"+this.props.visual.fromTime+".000Z";
    let edDate = this.props.visual.toDate+"T"+this.props.visual.toTime+".000Z";

    let reqData = {
      type : "GROUPBY",
      dataSourceId : dataSourceId,
      startTime : stDate,
      endTime : edDate,
      queryGranularity : "ALL",
      dimensions: [],
      aggregations : []
    };

    let filterList = [];
    if((typeof(list) != "undefined")){
      filterList = list;
    }else{
      filterList = this.props.visual.searchFilterFieldList
    }
    if(filterList.length > 0){
      reqData["filter"] = {
        "type" : "AND",
        "filters" : []
      }

      let l = [];
      for(let i=0;i<filterList.length;i++){
        const filter = filterList[i].value
        if(i==0){
          const filter = filterList[i].value
          l.push({
            "key" : filterList[i].dimension,
            "value" : [filter.key]
          })
        }else{
          let flag = false;
          for(let j=0;j<l.length;j++){
            if(filterList[i].dimension == l[j].key){
              l[j].value.push(filter.key);
              flag = true;
              break;
            }
          }

          if(!flag){            
            l.push({
              "key" : filterList[i].dimension,
              "value" : [filter.key]
            })
          }
        }
      }
      
      for(let i=0;i<l.length;i++){
        let valueList = [];
        for(let j=0;j<l[i].value.length;j++){
          const val = extractValue(l[i].value[j])
          valueList.push({
            "dimension":l[i].key,
            "value":val,
            "type":"EQUALS",
            "filters":[]})
        }
        reqData.filter.filters.push({
          "type" : "OR",
          "filters" : valueList
        })
      }
    }
    const {_query} = this.refs
    if (_query) {
      const query = _query.value
      if (query) {
        reqData.query = query
      }
    }
    return reqData;
  }

  makeTopnStructure = () => {
    let dataSourceId = $("#_datasourceSelect").val();
    let stDate = this.props.visual.fromDate+"T"+this.props.visual.fromTime+".000Z";
    let edDate = this.props.visual.toDate+"T"+this.props.visual.toTime+".000Z";
    return {
      type : "TOPN",
      dataSourceId : dataSourceId,
      startTime : stDate,
      endTime : edDate,
      queryGranularity : "ALL",
      dimensions: [],
      threshold : "10",
      metric : "",
      aggregations : []
    }
  }

  makeCardinalRequestData = (list, detail) => {
    let reqData = this.makeGroupbyStructure(list);

    let detailObj = {};

    if((typeof(detail) != "undefined")){
      detailObj = detail;
    }else{
      detailObj = this.props.visual.datasourceDetail
      }
      if (detailObj.dimensions) {
        for(let i=0;i<detailObj.dimensions.length;i++){
          reqData.aggregations.push({
            "type" : "CARDINALITY",
            "name" : detailObj.dimensions[i].name,
            "fieldName" : detailObj.dimensions[i].name
          });
        }
    }

    if (reqData.dataSourceId == null)
      reqData.dataSourceId = detailObj.id
    return reqData;
  }

  setFilter = (reqData) => {
    
  }

  loadDatasource = (e) => {
    this.props.doDatasourceDetail(e.target.value, ()=>{
      this.props.doMetricList($("#_datasourceSelect").val());
    });
  }

  removeSelectFieldTag = (index) => {
    this.props.doRemoveList(index, 1);
  }

  removeSearchFilterTag = (index) => {
    this.props.doRemoveList(index, 0);
  }

  removeSelectMetricTag = (index) => {
    this.props.doRemoveList(index, 2);
  }

  addTimeSelect = () => {
    const { _fieldForm } = this.refs;

    let newItem = {
      id : "시간",
      order : "__time",
      count : _fieldForm._timeGranual.value
    }
    this.props.doAddList(newItem,1);
  }

  addField = (id) => {
    if(!this.props.visual.metricList || this.props.visual.metricList == [] ||
      this.props.visual.metricList.length == 0){
      smallBox({
          title: "경고",
          content: `<i class='fa fa-clock-o'></i> <i>측정 값이 존재하지 않습니다.</i>`,
          color: "#a90329",
          iconSmall: "fa fa-thumbs-down bounce animated",
          timeout: 4000
      });
    }else{
      let newItem = {
        id : id,
        order : this.props.visual.metricList[0].metric_name,
        count : 10
      }
      this.props.doAddList(newItem,1);
    }    
  }

  changeField = (key) => {
    if(key == "시간")return;
    const { _dimensionModalForm } = this.refs;
    _dimensionModalForm.dimensionKey.value = key;
    $("#changeDimensionModal").modal("show");
  }

  selectMetric = (name, type, value) => {
    let newItem = {
      type:type,
      name:name,
      fieldName:value
    }
    this.props.doAddList(newItem,2);
  }

  revmoeMetric = (name) => {
    let check = confirm('정말로 삭제하시겠습니까?');
    if (!check) return;
    this.props.doDeleteMetric($("#_datasourceSelect").val(), name);
  }

  getSelectedFilterList = (data) => {
    this.selectedFilterList = [];
    for(let i=0;i<data.length;i++){      
      const text = data[i].text.split(" ------- ")
      this.selectedFilterList.push({
        "key": data[i].value,
        "value" : text[0]
      });
    }
  }

  showChart = () => {
    this.props.doChartCheck();
  }

  timeSetting = (timeObj) => {
    this.props.doTimeSetting(timeObj);
    let stDate = timeObj["fromDate"]+"T"+timeObj["fromTime"]+":00.000Z";
    let edDate = timeObj["toDate"]+"T"+timeObj["toTime"]+":00.000Z";
    let reqData = this.makeCardinalRequestData();
    reqData.startTime = stDate;
    reqData.endTime = edDate;
    this.props.doCardinalList(reqData);
  }

  onChangeAggrType = (e) => {
    this.props.doChangeAggregationType(e.target.value)
  }

  onSelectPostAggrMetric = (e) => {
    e.preventDefault();
    if (this.props.visual.selectedPostAggrMetricList.indexOf(e.target.value) == -1)
      this.props.doSelectPostAggregationMetric(e.target.value);
  }

  onRemovePostAggrMetric = (idx) => {
    this.props.doRemovePostAggregationMetric(idx);
  }

  sortModalPopup = (item) => {    
    if (item.type !== 'ARITHMETIC') 
      $("#metricSortingModal").modal();
    else {
      SmartMessageBox({
          title: "<i class='fa fa-ban' style='color:red'></i> 경고",
          content: "ARITHMETIC 유형 측정 값은 정렬 설정을 할 수 없습니다.",
          buttons: '[Ok]'
      }, () => {
      });
    }
  }

  metricSortingModalSubmit = (e) => {
    e.preventDefault();
    const { _metricSortingModalForm } = this.refs;    
    this.props.doSetFirstMetricSorting(_metricSortingModalForm.sorting.value)
    $("#metricSortingModal").modal("hide")
  }

  render() {
    let dimension_count_arr = [];
    for(let i=1;i<=100;i++){
      dimension_count_arr.push(i);
    }    
    return (
      <div >
          <div className="defaultPage">
              <header className="traceHeader dashboard-top-toolbar">
                  <div>
                      <h2>통계 시각화</h2>
                      <h4>통계 처리된 데이터에서 원하는 항목만을 선택하여 차트 등을 구성합니다.</h4>
                  </div>
                  <div className="traceHeader-action">
                  <TimeSetting
                      fromDate={this.props.visual.fromDate}
                      fromTime={this.props.visual.fromTime}
                      toDate={this.props.visual.toDate}
                      toTime={this.props.visual.toTime}
                      setting={(timeObj) => {
                        this.timeSetting(timeObj);
                      }}
                  />
                  </div>
              </header>
              <main className="dashboard-main padding-top-zero">
                  <div className="optionsBox">
                      <div className="form-group">
                          <label className="control-label search-label">데이터 소스</label>
                          <div>
                              <div className="icon-addon addon-md">
                                  <select className="form-control" onChange={(e)=>this.loadDatasource(e)} id="_datasourceSelect"
                                          defaultValue={this.props.visual.datasourceDetail?this.props.visual.datasourceDetail.id:""}>
                                      {
                                          this.props.visual.datasourceList && this.props.visual.datasourceList.map((item) => {
                                              return <option key={item.id} value={item.id}
                                                             selected={item.id == this.props.visual.datasourceDetail.id?true:false}>{item.name}</option>
                                          })
                                      }
                                  </select>
                              </div>
                          </div>
                      </div>
                      <div className="separator"></div>
                      <div className="form-group">
                          <label className="control-label search-label">검색 필터</label>
                          <div className="display-flex-row">
                              <div className="bootstrap-tagsinput tagsinputWrapper" id="_searchFilterTagInput" style={{width:"calc(100% - 75px)"}}>
                                  {
                                      this.props.visual.searchFilterFieldList && this.props.visual.searchFilterFieldList.length > 0 &&
                                      this.props.visual.searchFilterFieldList.map((item, idx) => {
                                          const strVal = extractValue(item.value)
                                          return <span className="tag label label-info" key={idx}>
                                                    {item.dimension+":"+strVal}
                                                    <span data-role='remove' onClick={() => this.removeSearchFilterTag(idx)}/>
                                                  </span>
                                      })
                                  }
                              </div>
                              <div style={{width:75, paddingLeft: 5}}>
                                {this.props.visual.displaySearchQuery ?
                                  <a className="btn btn-xcon btn-xcon-blue" onClick={() => this.props.doDisplaySearchQuery(false)}>
                                    쿼리 <i className="material-icons">remove_circle_outline</i>
                                  </a> :
                                  <a className="btn btn-xcon btn-xcon-blue" onClick={() => this.props.doDisplaySearchQuery(true)}>
                                    쿼리 <i className="material-icons">add_circle_outline</i>
                                  </a>}
                              </div>
                          </div>
                      </div>
                  </div>
                  {
                    this.props.visual.displaySearchQuery ?
                    <div className="optionsBox">
                        <input className="form-control" type="text" name="query" ref="_query" placeholder="ex) PROTOCOL_TYPE = '0' and THREAT_LEVEL = 'HIGH'"/>
                    </div>
                    : null
                  }
                  <div className="optionsBox">
                      <div className="form-group">
                          <label className="control-label search-label">선택 필드</label>
                          <div>
                              <div className="bootstrap-tagsinput tagsinputWrapper" id="_selectFieldTagInput">
                                  {
                                      this.props.visual.selectFieldList && this.props.visual.selectFieldList.length > 0 &&
                                      this.props.visual.selectFieldList.map((item, idx) => {
                                          return <span className="tag label label-info" key={item.id}>
                                    <span className="pointer" onClick={()=>this.changeField(item.id)}>{item.id}</span>
                                    ({item.count})
                                    <span data-role='remove' onClick={() => this.removeSelectFieldTag(idx)}/>
                                  </span>
                                      })
                                  }
                              </div>
                          </div>
                      </div>
                      <div className="separator"></div>
                      <div className="form-group">
                          <label className="control-label search-label">선택 측정 값</label>
                          <div>
                              <div className="bootstrap-tagsinput tagsinputWrapper" id="_selectMetricTagInput">
                                  {
                                      this.props.visual.selectMetricList && this.props.visual.selectMetricList.length > 0 &&
                                      this.props.visual.selectMetricList.map((item, idx) => {
                                          return <span className="tag label label-info" key={idx}>
                                    { idx === 0 ?
                                        <span className="pointer" onClick={() => {this.sortModalPopup(item)}}>{item.name}</span>
                                        :
                                        <span>{item.name}</span>
                                    }
                                              <span data-role='remove' onClick={() => this.removeSelectMetricTag(idx)}/>
                                  </span>
                                      })
                                  }
                              </div>
                          </div>
                      </div>
                    </div>
                    <div className="row" style={{paddingTop: 28}}>
                        <div className="col-xs-12">
                            <ChartWrapper type="chart" title="시각화">
                                <div className="row traceDetail">
                                    <div className="col-xs-3 traceDetail-aside visualize-field-fix">
                                      <header className="visualize-field-header">
                                        필드
                                      </header>
                                      <div className="widget-body" style={{paddingTop:20}}>
                                        <div className="default-table">
                                          <label>선택필드</label>
                                          <form ref="_fieldForm">
                                            <table className="table table-condensed">
                                              <tbody>
                                                <tr key="_time">
                                                  <td className="border-left-right-zero" onClick={() => this.addTimeSelect()}>
                                                    <i className="fa fa-plus-circle"/>
                                                  </td>
                                                  <td className="border-left-right-zero">시간</td>
                                                  <td className="border-left-right-zero">
                                                    <select name="_timeGranual" style={{position:"absolute", marginLeft:"-70px", marginTop:"-5px"}}>
                                                    {
                                                        this.props.visual.timecodeList && this.props.visual.timecodeList.map((item) => {
                                                            return <option key={item.id} value={item.id}>{item.value}</option>
                                                        })
                                                    }
                                                    </select>
                                                  </td>
                                                </tr>
                                                  {
                                                    this.props.visual.datasourceDetail && this.props.visual.datasourceDetail.dimensions &&
                                                    this.props.visual.datasourceDetail.dimensions.map((item, idx) => {
                                                        let cardinal = "";

                                                        if(typeof(this.props.visual.cardinalMap) != "undefined"){
                                                            cardinal = this.props.visual.cardinalMap[item.name];
                                                            if (typeof(cardinal) != "undefined")cardinal = Math.floor(Number(cardinal));
                                                            else cardinal="-";
                                                        }else{
                                                            cardinal="-";
                                                        }

                                                        return (
                                                            <tr key={idx}>
                                                                <td className="border-left-right-zero" style={{cursor: "pointer"}} onClick={() => this.addField(item.name)}>
                                                                  <i className="fa fa-plus-circle"/>
                                                                </td>
                                                                <td className="border-left-right-zero">{item.name}({item.label})</td>
                                                                <td className="border-left-right-zero" style={{cursor: "pointer"}} onClick={() => this.openSearchFieldModal(item.name)}><a style={{textDecoration:"underline"}}>{cardinal}</a></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                              </tbody>
                                            </table>
                                          </form>
                                        </div>
                                        <div>
                                          <header className="visualize-field-header">
                                            <div className="row">
                                              <div style={{width:"calc(100% - 75px)", paddingLeft:10}}>측정 값</div>
                                              <div style={{width:65}}>
                                                <button className="btn btn-xcon btn-xcon-grey" data-toggle="modal" data-target="#addMetricModal" style={{margin:"-6px", fontSize:11}}>
                                                  추가 <i className="material-icons">add_circle_outline</i>
                                                </button>
                                              </div>
                                            </div>
                                          </header>
                                          <label style={{marginTop:20}}>
                                            선택필드
                                          </label>
                                          <table className="table table-condensed">
                                            <tbody>
                                            {
                                                this.props.visual.metricList && this.props.visual.metricList.length > 0 &&
                                                this.props.visual.metricList.map((item, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="border-left-right-zero" style={{cursor: "pointer"}} onClick={() => this.selectMetric(item.metric_name, item.aggr_type, item.metric_value)}>
                                                              <i className="fa fa-plus-circle"/>
                                                            </td>
                                                            <td className="border-left-right-zero">{item.metric_name}</td>
                                                            <td className="border-left-right-zero" style={{textAlign:"right", cursor: "pointer"}} onClick={() => this.revmoeMetric(item.metric_name)}><i className="fa fa-trash-o pointer" style={{paddingRight:15}}/></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xs-9" style={{paddingRight:0}}>
                                        <header>
                                            <h2>시각화</h2>
                                        </header>
                                        <div className="visualizeToolAction">
                                            <button className="btn btn-xcon btn-xcon-blue" data-toggle="modal" data-target="#selectChartModal">
                                                시각화&nbsp;&nbsp;
                                                <i className="material-icons reverse">
                                                    playlist_add
                                                </i>
                                            </button>
                                            <button className="btn btn-xcon btn-xcon-grey" data-toggle="modal" data-target="#saveModal">
                                                저장하기&nbsp;&nbsp;
                                                <i className="material-icons">
                                                    move_to_inbox
                                                </i>
                                            </button>
                                            <button className="btn btn-xcon btn-xcon-grey" data-toggle="modal" data-target="#loadModal">
                                                불러오기&nbsp;&nbsp;
                                                <i className="material-icons">
                                                    person_add
                                                </i>
                                            </button>
                                        </div>
                                        <div className="widget-body" style={{height: 850}}>
                                        {
                                          this.props.visual.chartDrawable == true ?
                                            <VisualizeChart name={this.props.visual.chartStateArray[this.props.visual.selectedChart].name} visual={this.props.visual}
                                                            getTopNStructure={this.makeTopnStructure} getGroupbyStructure={this.makeGroupbyStructure}
                                                            doVisualizeDatas={this.props.doVisualizeDatas}
                                                            doGetGroupByFilter={this.props.doGetGroupByFilter}
                                                            searchFilterList = {this.props.visual.searchFilterFieldList}/> :
                                            <div className="warningBox">
                                              <i className="material-icons-outlined" style={{color: "#2449A3"}}>info</i>
                                              <p>필드가 존재하지 않거나, 시각화 할 수 없는 필드의 조합입니다. 필드를 재설정 해주세요.</p>
                                            </div>
                                          }
                                        </div>
                                    </div>
                                </div>
                            </ChartWrapper>
                        </div>
                    </div>

                      <div className="modal fade" id="saveModal" tabIndex="-1" role="dialog" aria-hidden="true">
                          <div className="modal-dialog" >
                              <div className="modal-content">
                                  <div className="modal-header">
                                    <ModalHeader icon="fa fa-cube fa-fw" title="시각화 저장"/>
                                  </div>
                                  <div className="modal-body" style={{height:"130px", marginBottom:"50px"}}>
                                      <div className="row">
                                      <UiValidate options={validateOptions}>
                                          <form className="col-md-12" ref="_saveModalForm" onSubmit={this.saveModalsubmit} id="saveModalForm">
                                              <div className="row form-group">
                                                  <div className="col-md-12">
                                                      <label className="control-label">시각화 명 : </label>
                                                      <input type="text" className="form-control" name="visualize_name" data-smart-validate-input="" data-required="" />
                                                  </div>
                                              </div>
                                              <div className="row form-group buttonGroupFooter">
                                                  <button type="submit" className="btn btn-xcon btn-xcon-blue">완료</button>
                                              </div>
                                          </form>
                                      </UiValidate>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="modal fade" id="addMetricModal" tabIndex="-1" role="dialog" aria-hidden="true">
                          <div className="modal-dialog" >
                              <div className="modal-content">
                                  <div className="modal-header">
                                    <ModalHeader icon="fa fa-cube fa-fw" title="측정 값 추가"/>
                                  </div>
                                  <div className="modal-body" style={{overflowY:"auto", minHeight:"290px", maxHeight:"470px", marginBottom:"50px"}}>
                                      <div className="row">
                                      <UiValidate options={validateOptions}>
                                          <form className="col-md-12" ref="_metricModalForm" onSubmit={this.metricModalsubmit} id="addMetricModalForm">
                                                  <div className="row form-group">
                                                      <div className="col-md-12">
                                                          <label className="control-label">측정 값 명 : </label>
                                                          <input type="text" className="form-control" name="metric_name" data-smart-validate-input="" data-required="" />
                                                      </div>
                                                  </div>
                                                  <div className="row form-group">
                                                      <div className="col-md-12">
                                                          <label className="control-label">집계 유형 : </label>
                                                          <select className="form-control" name="aggr_type" onChange={this.onChangeAggrType}>
                                                          {
                                                              this.props.visual.aggrcodeList && this.props.visual.aggrcodeList.map((item, idx) => {
                                                                  return <option key={idx} value={item.id}>{item.value}</option>
                                                              })
                                                          }
                                                          </select>
                                                      </div>
                                                  </div>
                                                  { this.props.visual.selectAggrType !== "ARITHMETIC" ?
                                                    <div className="row form-group">
                                                        <div className="col-md-12">
                                                            <label className="control-label">값 필드 : </label>
                                                            <select className="form-control" name="metric_value">
                                                            {
                                                                this.props.visual.datasourceDetail && this.props.visual.datasourceDetail.metrics &&
                                                                this.props.visual.datasourceDetail.metrics.map((item, idx) => {
                                                                    return <option key={idx} value={item.type+"___"+item.name}>{item.label}</option>
                                                                })
                                                            }
                                                            </select>
                                                        </div>
                                                    </div> : 
                                                    <div>
                                                      <div className="row form-group">
                                                          <div className="col-md-12">
                                                              <label className="control-label">연산자 : </label>
                                                              <select className="form-control" name="operator">
                                                              {
                                                                  this.props.visual.operatorCodeList && this.props.visual.operatorCodeList.map((item, idx) => {
                                                                      return <option key={idx} value={item.id}>{item.value}</option>
                                                                  })
                                                              }
                                                              </select>
                                                          </div>
                                                      </div>
                                                      <div className="row form-group">
                                                          <div className="col-md-12">
                                                              <label className="control-label">대상 측정값 : </label>
                                                              <select className="form-control" name="targetMetrics" onChange={this.onSelectPostAggrMetric}>
                                                              {
                                                                  this.props.visual.metricList && this.props.visual.metricList.map((item, idx) => {
                                                                      if (item.aggr_type !== 'ARITHMETIC')
                                                                          return <option key={idx} value={item.metric_name}>{item.metric_name}</option>
                                                                  })
                                                              }
                                                              </select>
                                                          </div>
                                                      </div>
                                                      <div className="row form-group">
                                                          <div className="col-md-12">
                                                              <div className="bootstrap-tagsinput">
                                                              {
                                                                  this.props.visual.selectedPostAggrMetricList && this.props.visual.selectedPostAggrMetricList.length > 0 &&
                                                                  this.props.visual.selectedPostAggrMetricList.map((item, idx) => {
                                                                      return <span className="tag label label-info" key={idx}>{item}
                                                                          <span data-role='remove' onClick={() => this.onRemovePostAggrMetric(idx)} />
                                                                      </span>
                                                                  })
                                                              }
                                                              </div>
                                                          </div>
                                                      </div>
                                                    </div>
                                                  }
                                              <div className="row form-group buttonGroupFooter">
                                                  <button type="submit" className="btn btn-xcon btn-xcon-blue">완료</button>
                                              </div>
                                          </form>
                                      </UiValidate>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="modal fade" id="changeDimensionModal" tabIndex="-1" role="dialog" aria-hidden="true">
                          <div className="modal-dialog" >
                              <div className="modal-content">
                                  <div className="modal-header">
                                    <ModalHeader icon="fa fa-cube fa-fw" title="최대치 설정"/>
                                  </div>
                                  <div className="modal-body" style={{height:"180px", marginBottom:"50px"}}>
                                      <div className="row">
                                          <form className="col-md-12" ref="_dimensionModalForm" onSubmit={this.dimensionModalsubmit} id="changeDimensionModalForm">
                                              <div className="row form-group">
                                                  <div className="col-md-12">
                                                      <label className="control-label">정렬 : </label>
                                                      <select className="form-control" name="dimension_order">
                                                      {
                                                          this.props.visual.metricList && this.props.visual.metricList.length > 0 &&
                                                          this.props.visual.metricList.map((item, idx) => {
                                                              return <option key={idx} value={item.metric_name}>{item.metric_name}</option>
                                                          })
                                                      }
                                                      </select>
                                                  </div>
                                                  <input type="text" name="dimensionKey" defaultValue=""  style={{display:"none"}}/>
                                              </div>
                                              <div className="row form-group">
                                                  <div className="col-md-12">
                                                      <label className="control-label">최대치 : </label>
                                                      <select className="form-control" name="dimension_count" defaultValue="10">
                                                      {
                                                          dimension_count_arr.map((item) => {
                                                              return <option key={item} value={item}>{item}</option>
                                                          })
                                                      }
                                                      </select>
                                                  </div>
                                              </div>
                                              <div className="row form-group buttonGroupFooter">
                                                  <button type="submit" className="btn btn-xcon btn-xcon-blue">완료</button>
                                              </div>
                                          </form>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="modal fade" id="searchFilterModal" tabIndex="-1" role="dialog" aria-hidden="true">
                          <div className="modal-dialog" >
                              <div className="modal-content">
                                  <div className="modal-header">
                                    <ModalHeader icon="fa fa-cube fa-fw" title="검색 필터 추가"/>
                                  </div>
                                  <div className="modal-body" style={{height:"280px", marginBottom:"50px"}}>
                                      <div className="row">
                                          <form className="col-md-12" ref="_searchFilterModalForm" onSubmit={this.searchFilterModalsubmit} id="searchFilterModalForm">
                                              <fieldset>
                                                  <div className="row">
                                                      <div className="col-md-3">정렬</div>
                                                      <div className="col-md-3">최대치</div>
                                                      <div className="col-md-6"></div>
                                                  </div>
                                                  <div className="row form-group">
                                                      <div className="col-md-3">
                                                          <input type="text" name="searchFilterKey" defaultValue="" style={{display:"none"}}/>
                                                          <select className="form-control" name="searchFilterMetric">
                                                          {
                                                              this.props.visual.metricList && this.props.visual.metricList.length > 0 &&
                                                              this.props.visual.metricList.map((item, idx) => {
                                                                  return <option key={idx} value={idx}>{item.metric_name}</option>
                                                              })
                                                          }
                                                          </select>
                                                      </div>
                                                      <div className="col-md-3">
                                                          <select className="form-control" defaultValue="10" name="searchFilterCount">
                                                          {
                                                              dimension_count_arr.map((item) => {
                                                                  return <option key={item} value={item}>{item}</option>
                                                              })
                                                          }
                                                          </select>
                                                      </div>
                                                      <div className="col-md-4">
                                                          <input type="text" className="form-control" name="searchFilterText" placeholder="" />
                                                      </div>
                                                      <div className="col-md-2">
                                                          <button className="btn btn-xcon btn-xcon-grey" onClick={(e)=>{this.searchFieldModalLoadData(e)}}>
                                                              검색&nbsp;&nbsp;
                                                              <i className="material-icons">
                                                                  search
                                                              </i>
                                                          </button>
                                                      </div>
                                                  </div>
                                              </fieldset>
                                              {
                                                  this.props.visual.filterTopNList && this.props.visual.filterTopNList.length > 0 ?
                                                      <DualListBox
                                                          selectList={this.props.visual.filterTopNList}
                                                          getSelectedItemList={this.getSelectedFilterList}
                                                          keyName={this.props.visual.selectedFilter.key}
                                                          valueName={this.props.visual.selectedFilter.value}/> : ""
                                              }
                                              <div className="row form-group buttonGroupFooter">
                                                  <button type="submit" className="btn btn-xcon btn-xcon-blue">완료</button>
                                              </div>
                                          </form>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="modal fade" id="loadModal" tabIndex="-1" role="dialog" aria-hidden="true">
                          <div className="modal-dialog" >
                              <div className="modal-content">
                                  <div className="modal-header">
                                    <ModalHeader icon="fa fa-cube fa-fw" title="시각화 불러오기"/>
                                  </div>
                                  <div className="modal-body" style={{overflowY:"auto", maxHeight:"310px", marginBottom:"50px"}}>
                                      <div className="row">
                                      <UiValidate options={validateOptions}>
                                          <form className="col-md-12" ref="_loadModalForm" onSubmit={this.saveModalsubmit} id="loadModalForm">
                                            <div className="row form-group">
                                                <div className="col-md-12">
                                                    <table className="table modal-table">
                                                      <thead>
                                                        <tr>
                                                          <th style={{width:"90%", fontSize:14}}>시각화 명</th>
                                                          <th style={{width:"10%"}}></th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {
                                                            this.props.visual.chartList && this.props.visual.chartList.length > 0 &&
                                                            this.props.visual.chartList.map((item, idx) => {
                                                                return (
                                                                    <tr key={idx}>
                                                                        <td style={{fontSize:14}}><span className="pointer" onClick={()=>this.loadChartData(item.vis_id)}>{item.vis_name}</span></td>
                                                                        <td style={{fontSize:14, width:"10%", textAlign:"right"}}>
                                                                            <i className="fa fa-trash-o pointer" style={{fontSize:14}} onClick={()=>this.removeChartData(item.vis_id)} />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                      </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                          </form>
                                      </UiValidate>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="modal fade" id="selectChartModal" tabIndex="-1" role="dialog" aria-hidden="true">
                          <div className="modal-dialog" style={{ width: "202px" }}>
                              <div className="modal-content">
                                  {
                                      this.props.visual.chartStateArray.length > 0 && this.props.visual.chartStateArray.map((item, idx) => {
                                          return <button key={idx} className={
                                              (item.flag=="1" && idx==this.props.visual.selectedChart)?
                                                  "btn btn-default chart-select-button active":(item.flag=="0"?
                                                  "btn btn-default chart-select-button disabled":"btn btn-default chart-select-button")}
                                                         onClick={()=>this.changeChart(idx)}>
                                              <img src={"assets/img/chart/"+idx+".svg"} style={{width:"74px",height:"73px"}} title={item.name}/>
                                              <br/>{item.name}
                                          </button>
                                      })
                                  }
                              </div>
                          </div>
                      </div>

                      <div className="modal fade" id="metricSortingModal" tabIndex="-1" role="dialog" aria-hidden="true">
                          <div className="modal-dialog" >
                              <div className="modal-content">
                                  <div className="modal-header">
                                    <ModalHeader icon="fa fa-wrench fa-fw" title="정렬 설정"/>
                                  </div>
                                  <div className="modal-body" style={{height:"110px", marginBottom:"50px"}}>
                                      <div className="row">
                                          <form className="col-md-12" ref="_metricSortingModalForm" onSubmit={this.metricSortingModalSubmit} id="metricSortingModalForm">
                                              <fieldset>
                                                  <div className="row form-group">
                                                      <div className="col-md-12">
                                                          <label className="control-label">정렬 : </label>
                                                          <select className="form-control" name="sorting">
                                                              {
                                                                  this.props.visual.sortTypes && this.props.visual.sortTypes.length > 0 &&
                                                                  this.props.visual.sortTypes.map((item, idx) => {
                                                                      return <option key={idx} value={item.id}>{item.value}</option>
                                                                  })
                                                              }
                                                          </select>
                                                      </div>
                                                  </div>
                                              </fieldset>
                                              <div className="row form-group buttonGroupFooter">
                                                  <button type="submit" className="btn btn-xcon btn-xcon-blue">완료</button>
                                              </div>
                                          </form>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                </main>
            </div>
        </div>
    )
  }

  removeChartData = (id) => {
    let check = confirm('해당 시각화를 사용하는 대시보드가 있는 경우, 대시보드에서 해당 시각화도 같이 삭제됩니다. 정말로 삭제하시겠습니까?');
    if (!check) return;
    this.props.doRemoveChartData(id);
  }

  loadChartData = (id) => {
    this.props.doLoadChart(id, ()=>{
      this.props.doMetricList($("#_datasourceSelect").val());
    });
    $("#loadModal").modal("hide")
  }

  changeChart = (index) => {
    this.props.doChartSelect(index);
    $("#selectChartModal").modal("hide")
  }

  makeSearchFilterRequestData = (field, data) => {
    const {_searchFilterModalForm} = this.refs;
    let selectedMetric = this.props.visual.metricList[_searchFilterModalForm.searchFilterMetric.value];

    let reqData = this.makeTopnStructure();

    reqData.dimensions.push("__time");
    reqData.dimensions.push(field);

    reqData.threshold = _searchFilterModalForm.searchFilterCount.value;
    reqData.metric = selectedMetric.metric_name;

    if (selectedMetric.aggr_type !== 'ARITHMETIC') {
      reqData.aggregations.push({
        type : selectedMetric.aggr_type,
        name : selectedMetric.metric_name,
        fieldName : selectedMetric.metric_value
      })
    } else {
      let fields = selectedMetric.post_aggregation_fields.split(',')
      fields.map((item) => {
        let metric = this.props.visual.metricList.filter((m) => { if (m.metric_name == item) return m})
        reqData.aggregations.push({
          type : metric[0].aggr_type,
          name : metric[0].metric_name,
          fieldName : metric[0].metric_value
        })
      })
      reqData.postAggregations = [{
        "name" : selectedMetric.metric_name,
        "operator" : selectedMetric.operator,
        "fields" : fields
      }]
    }
    this.props.doFilterTopnList(reqData, data);
    this.showChart();
  }

  searchFieldModalLoadData = (e) => {
    e.preventDefault();
    const {_searchFilterModalForm} = this.refs;
    this.makeSearchFilterRequestData(_searchFilterModalForm.searchFilterKey.value, _searchFilterModalForm.searchFilterText.value);
  }

  openSearchFieldModal = (id) => {
    if(!this.props.visual.metricList || this.props.visual.metricList == [] ||
      this.props.visual.metricList.length == 0){
      smallBox({
          title: "경고",
          content: `<i class='fa fa-clock-o'></i> <i>측정 값이 존재하지 않습니다.</i>`,
          color: "#a90329",
          iconSmall: "fa fa-thumbs-down bounce animated",
          timeout: 4000
      });
    }else{
      this.makeSearchFilterRequestData(id);
      const {_searchFilterModalForm} = this.refs;
      _searchFilterModalForm.searchFilterKey.value = id;
      $("#searchFilterModal").modal("show");
    } 
  }

  saveModalsubmit = (e) => {
    e.preventDefault();

    if(this.props.visual.chartDrawable == false){
      smallBox({
          title: "경고",
          content: `<i class='fa fa-clock-o'></i> <i>저장 할 데이터가 유효하지 않습니다.</i>`,
          color: "#a90329",
          iconSmall: "fa fa-thumbs-down bounce animated",
          timeout: 4000
      });
      return;
    }

    const { _saveModalForm, _query } = this.refs;
    let name = _saveModalForm.visualize_name.value;
    let dataSourceId = $("#_datasourceSelect").val();    
    let qureyValue = null;
    if (_query) {
      if (_query.value) {
        qureyValue = _query.value
      }
    }
    let stDate = this.props.visual.fromDate+"T"+this.props.visual.fromTime+".000Z";
    let edDate = this.props.visual.toDate+"T"+this.props.visual.toTime+".000Z";

    let filterList = this.props.visual.searchFilterFieldList;
    let fieldList = this.props.visual.selectFieldList;
    let metricList = this.props.visual.selectMetricList;
    let newFilterList = [];
    let newFieldList = [];
    let newMetricList = [];

    if(filterList.length > 0){
      for(let i=0;i<filterList.length;i++){
        const filter = filterList[i].value
        newFilterList.push({
          dimension : filterList[i].dimension,
          value : filter.key,
          text : filter.value
        })
      }
    }

    if(fieldList.length > 0){
      for(let i=0;i<fieldList.length;i++){
        if(fieldList[i].id == "시간"){
          newFieldList.push({
            value: fieldList[i].order,
            type: "TIME",
            granularity: fieldList[i].count,
            measure:"",
            limit:""
          })
        }else{
          newFieldList.push({
            value: fieldList[i].id,
            type: "DIMENSION",
            limit: fieldList[i].count,
            granularity: "",
            measure:fieldList[i].order
          })
        }
      }
    }

    if(metricList.length > 0){
      for(let i=0;i<metricList.length;i++){
        let metric = {
          value: metricList[i].name,
        }
        if (metricList[i].orderBy)
          metric.orderBy = metricList[i].orderBy
        newMetricList.push(metric)
      }
    }

    let reqData = {
      "search-condition" : {
        "period": {
            "value": this.props.visual.option != "" ? this.props.visual.option:"",
            "type": this.props.visual.type != "" ? this.props.visual.type:"FIXED",
            "start": stDate,
            "end": edDate
        },
        "filters": {
            "filter": newFilterList
        },
        "query": {
            "value": qureyValue
        }
      },
      "select-fields": {
          "field": newFieldList
      },
      "select-measures": {
          "measure": newMetricList
      },
      "name": name,
      "type": this.props.visual.selectedChart,
      "data-source": dataSourceId
    }

    this.props.doSaveChart(reqData);

    
    $("#saveModal").modal("hide");
  }

  componentWillReceiveProps(nextProps) {
    let next = nextProps.visual;
    let now = this.props.visual;

    if(now.searchFilterFieldList.length != next.searchFilterFieldList.length){
      this.props.doCardinalList(this.makeCardinalRequestData(next.searchFilterFieldList));
    }

    if((now.datasourceDetail == {} && next.datasourceDetail != {}) || now.datasourceDetail.id != next.datasourceDetail.id){
      this.props.doCardinalList(this.makeCardinalRequestData(next.searchFilterFieldList, next.datasourceDetail));
    }    
  }

  searchFilterModalsubmit = (e) => {
    e.preventDefault();
    for(let i=0;i<this.selectedFilterList.length;i++){
      this.props.doAddList({
        dimension : this.props.visual.selectedFilter.key,
        value : this.selectedFilterList[i],
        type : "EQUALS",
        filters : []
      }, 0)
    }
    $("#searchFilterModal").modal("hide");
  }

  dimensionModalsubmit = (e) => {
    e.preventDefault();
    const { _dimensionModalForm } = this.refs;

    let newItem = {
      id : _dimensionModalForm.dimensionKey.value,
      order : _dimensionModalForm.dimension_order.value,
      count : _dimensionModalForm.dimension_count.value
    }
    this.props.doChangeField(newItem);
    $("#changeDimensionModal").modal("hide");
  }

  metricModalsubmit = (e) => {
    e.preventDefault();
    let isValid = $("#addMetricModalForm").valid();
    if (!isValid)
       return;

    const { _metricModalForm } = this.refs;
    
    let reqData = {
      datasource_id : $("#_datasourceSelect").val(),
      metric_name : _metricModalForm.metric_name.value,
      aggr_type : _metricModalForm.aggr_type.value
    }

    if (_metricModalForm.aggr_type.value === 'ARITHMETIC') {
      reqData['metric_type'] = 'DOUBLE';
      reqData['metric_value'] = 'DUMMY';
      reqData['operator'] = _metricModalForm.operator.value;
      let targetMetrics = '';
      this.props.visual.selectedPostAggrMetricList.map((item) => {
        if (targetMetrics === '') {
          targetMetrics = item
        } else {
          targetMetrics = targetMetrics + ',' + item
        }
      });
      reqData['post_aggregation_fields'] = targetMetrics;
    } else {
      let arr = _metricModalForm.metric_value.value.split("___");
      reqData['metric_type'] = arr[0];
      reqData['metric_value'] = arr[1];
    }
    this.props.doCreateMetric(reqData);
    _metricModalForm.metric_name.value ="";
    $("#addMetricModal").modal("hide");
  }
}

export default connect((state) => ({
  visual: state.visual,
  words:state.auth.words
}), (dispatch) => ({
  doDatasourceList(callback) { dispatch(datasourceList(callback)) },
  doDatasourceDetail(id, callback) { dispatch(datasourceDetail(id, callback)) },
  doCardinalList(reqData) { dispatch(cardinalList(reqData)) },
  doFilterTopnList(reqData, data) { dispatch(filterTopnList(reqData, data)) },
  doVisualizeDatas(reqData, selectMetricList) { dispatch(visualizeDatas(reqData, selectMetricList)) },
  docodeList(flag) { dispatch(codeList(flag)) },
  doChartCheck() { dispatch(chartCheck()) },
  doChangeField(item) { dispatch(changeField(item)) },
  doAddList(item, type) { dispatch(addList(item, type)) },
  doRemoveList(index, type) { dispatch(removeList(index, type)) },
  doMetricList(id) { dispatch(metricList(id)) },
  doChartSelect(index) { dispatch(chartSelect(index)) },
  doDeleteMetric(id, name) { dispatch(deleteMetric(id, name)) },
  doCreateMetric(reqData) { dispatch(createMetric(reqData)) },
  doSaveChart(reqData) { dispatch(saveChart(reqData)) },
  doLoadChart(id, callback) { dispatch(loadChart(id, callback)) },
  doChartList() { dispatch(chartList()) },
  doTimeSetting(timeObj) { dispatch(timeSetting(timeObj)) },
  doRemoveChartData(id) { dispatch(removeChartData(id)) },
  doChangeAggregationType(aggrType) { dispatch(changeAggregationType(aggrType)) },
  doSelectPostAggregationMetric(metricName) { dispatch(selectPostAggregationMetric(metricName))},
  doRemovePostAggregationMetric(index) { dispatch(removePostAggregationMetric(index))},
  doSetFirstMetricSorting(sortType) { dispatch(setFirstMetricSorting(sortType))},
  doDisplaySearchQuery(isShow) { dispatch(displaySearchQuery(isShow))},
  doGetGroupByFilter(queries,callback){dispatch(getGroupByFilter(queries,callback))}
}))(VisualizeMain);
