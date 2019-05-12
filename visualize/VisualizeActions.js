import API from '../common/API';

export const DATASOURCELIST = "visualize/DATASOURCELIST";
export const DATASOURCEDETAIL = "visualize/DATASOURCEDETAIL";
export const CARDINALLIST = "visualize/CARDINALLIST";
export const METRICLIST = "visualize/METRICLIST";
export const CODELIST = "visualize/CODELIST";
export const CREATEMETRIC = "visualize/CREATEMETRIC";
export const FILTERTOPNLIST = "visualize/FILTERTOPNLIST";
export const CHANGEFIELD = "visualize/CHANGEFIELD";
export const CHARTCHECK = "visualize/CHARTCHECK";
export const CHARTSELECT = "visualize/CHARTSELECT";
export const RESULTLIST = "visualize/RESULTLIST";
export const ADDLIST = "visualize/ADDLIST";
export const REMOVELIST = "visualize/REMOVELIST";
export const LOADCHART = "visualize/LOADCHART";
export const CHARTLIST = "visualize/CHARTLIST";
export const SETTIME = "visualize/SETTIME";
export const COMPLETEDELETEMETRIC = "visualize/COMPLETEDELETEMETRIC";
export const CHANGE_AGGREGATION_TYPE = "visualize/CHANGE_AGGREGATION_TYPE";
export const SELECT_POST_AGGREGATION_METRIC = "visualize/SELECT_POST_AGGREGATION_METRIC";
export const REMOVE_POST_AGGREGATION_METRIC = "visualize/REMOVE_POST_AGGREGATION_METRIC";
export const SET_FIRST_METRIC_SORTING = "visualize/SET_FIRST_METRIC_SORTING";
export const DISPLAY_SEARCH_QUERY = "visualize/DISPLAY_SEARCH_QUERY";

export const datasourceList = (callback) => (dispatch) => {
    let url = '/analytics/management/data-sources';
    return API().get(url).then(res => {
        dispatch({
            type: DATASOURCELIST,
            payload: res.data
        });
        callback();
    });
}

export const datasourceDetail = (id, callback) => (dispatch) => {
    dispatch({
        type: DATASOURCEDETAIL,
        payload: id
    });
    callback();
}

export const cardinalList = (reqData) => (dispatch) => {
  API().post(`/rest/visualize/requestAnalytics`, reqData).then(res => {
    dispatch({
      type: CARDINALLIST,
      payload: res.data.druidQueryResult ? res.data.druidQueryResult.datas[0] : []
    });
  })
}

export const filterTopnList = (reqData, data) => (dispatch) => {
  API().post(`/rest/visualize/requestAnalytics`, reqData).then(res => {
    dispatch({
      type: FILTERTOPNLIST,
      payload: {
          result : res.data.druidQueryResult.datas,
          key : reqData.dimensions[1],
          value : reqData.metric,
          data : data
      }
    });
  })
}

export const visualizeDatas = (reqData, selectMetricList) => (dispatch) => {
  let visualizeRequest = { "analyticsQueryRequest" : reqData,
                           "selectMetricList" : selectMetricList };
  API().post(`/rest/visualize/visualizeDatas`, visualizeRequest).then(res => {
    dispatch({
      type: RESULTLIST,
      payload: {
        result : res.data ? res.data : []
      }  
    });
  })
}  

export const addList = (item ,type) => (dispatch) => {
    dispatch({
        type: ADDLIST,
        payload: {
            item : item,
            type : type
        }
    });
    dispatch(chartCheck());
}

export const removeList = (index, type) => (dispatch) => {
    dispatch({
        type: REMOVELIST,
        payload: {
            index : index,
            type : type
        }
    });
    dispatch(chartCheck());
}

export const chartCheck = () => (dispatch) => {
    return dispatch({
        type: CHARTCHECK
    });
}

export const chartSelect = (index) => (dispatch) => {
    dispatch({
        type: CHARTSELECT,
        payload: index
    });
    dispatch(chartCheck());
}

export const changeField = (item) => (dispatch) => {
    dispatch({
        type: CHANGEFIELD,
        payload: item
    });
    dispatch(chartCheck());
}
export const metricList = (id) => (dispatch) => {
    return API().get('/rest/visualize/list?id='+id).then(res => {
        dispatch({
            type: METRICLIST,
            payload: res.data
        });
    });
}

export const createMetric = (reqData) => (dispatch) => {
    return API().post('/rest/visualize/create', reqData).then(res => {
        if(res.data.success){
            dispatch(metricList(reqData.datasource_id));
        }
    });
}

export const deleteMetric = (id, name) => (dispatch) => {
    return API().delete('/rest/visualize/delete?id='+id+"&name="+name).then(res => {
        if(res.data.success){
            dispatch({
                type: COMPLETEDELETEMETRIC,
                payload : name
            })
            dispatch(metricList(id));
        }
    });
}

export const saveChart = (reqData) => (dispatch) => {
    return API().post('/rest/visualize/save', reqData).then(res => {
        dispatch(chartList());
    });
}

export const removeChartData = (id) => (dispatch) => {
    return API().delete('/rest/visualize/deleteData?id='+id).then(res => {
        dispatch(chartList());
    });
}

export const chartList = () => (dispatch) => {
    return API().get('/rest/visualize/chartList').then(res => {
        dispatch({
            type: CHARTLIST,
            payload: res.data
        });
    });
}

export const loadChart = (id, callback) => (dispatch) => {
    return API().get('/rest/visualize/load?id='+id).then(res => {
        
        let data = res.data;
        dispatch(datasourceDetail(data["data-source"], ()=>{}));
        dispatch(metricList(data["data-source"]));

        let condition = data["search-condition"];

        let filterArray = [];
        
        if(condition.filters.filter != null){
            for(let i=0;i<condition.filters.filter.length;i++){
                let fil = condition.filters.filter[i];                
                filterArray.push({
                    dimension: fil.dimension,
                    value: {
                        key: fil.value,
                        value: fil.text ? fil.text : fil.value
                    },
                    type: "EQUALS",
                    filters : []
                });
            }
        }

        let stTime = condition.period.start;
        let edTime = condition.period.end;

        let fromDate = stTime.split("T")[0];
        let toDate = edTime.split("T")[0];
        let fromTime = stTime.split("T")[1].split(".")[0];
        let toTime = edTime.split("T")[1].split(".")[0];

        let fields = data["select-fields"].field;

        let fieldArray = [];

        if(fields != null){
            for(let i=0;i<fields.length;i++){
                if(fields[i].type == "TIME"){
                    fieldArray.push({
                        id:"시간",
                        order:fields[i].value,
                        count:fields[i].granularity
                    });
                }else{
                    fieldArray.push({
                        id:fields[i].value,
                        order:fields[i].measure,
                        count:fields[i].limit
                    });
                }
            }
        }

        let metrics = data["select-measures"].measure;
        let metricArray = [];
        let chartArray = [];
        let arr = [];
        let drawable = true;

        if(metrics != null){
            API().get('/rest/visualize/list?id='+data["data-source"]).then(res => {
                let metricList = res.data;
                for(let i=0;i<metrics.length;i++){
                    for(let j=0;j<metricList.length;j++){
                        if(metricList[j]["metric_name"] == metrics[i].value){
                            let metric = {
                                type:metricList[j]["aggr_type"],
                                name:metricList[j]["metric_name"],
                                fieldName:metricList[j]["metric_value"]
                            }
                            if (metrics[i].orderBy) {
                                metric.orderBy = metrics[i].orderBy
                            }
                            metricArray.push(metric);
                            break;
                        }
                    }
                }
                arr = getActiveChartArray(fieldArray, metricArray);
                let nameArray = ["총합", "테이블", "그리드", "선형", "범위", "막대", "원형", "히트맵"]
                for(let i=0;i<arr.length;i++){
                    chartArray.push({
                        flag:arr[i],
                        name:nameArray[i]
                    });
                }
                drawable = (arr[data.type] == "1"? true: false)

                dispatch({
                    type: LOADCHART,
                    payload: {
                        fromDate : fromDate,
                        fromTime : fromTime,
                        toDate : toDate,
                        toTime : toTime,
                        searchFilterFieldList : filterArray,
                        selectFieldList : fieldArray,
                        query : condition.query ? condition.query.value : null,
                        selectedChart : data.type,
                        selectMetricList : metricArray,
                        chartStateArray : chartArray,
                        chartDrawable : drawable
                    }
                });
                
                callback();
            });
        }
    });
}

export const codeList = () => (dispatch) => {
    let id = "TimeGranularity";
    return API().get('/rest/codelist/get?id='+id).then(res => {
        id="AggregationType";
        API().get('/rest/codelist/get?id='+id).then(res2 => {
            id="ArithmeticsOperator";
            API().get('/rest/codelist/get?id='+id).then(res3 => {
                id="SortType";
                API().get('/rest/codelist/get?id='+id).then(res4 => {
                    res.data.aggr = res2.data
                    res.data.operator = res3.data
                    res.data.sortType = res4.data
                    dispatch({
                        type: CODELIST,
                        payload: res.data
                    })
                })
            })
        })
    })
}

export const timeSetting = (timeObj) => (dispatch) => {
    
    if((typeof(timeObj) != "undefined")){
        dispatch({
            type: SETTIME,
            payload: {
                fromDate : timeObj["fromDate"],
                fromTime : timeObj["fromTime"]+":00",
                toDate : timeObj["toDate"],
                toTime : timeObj["toTime"]+":00",
                option : timeObj["option"],
                type : timeObj["type"],
            }
        });
    }else{
        let currentDate = new Date();
        dispatch({
            type: SETTIME,
            payload: {
                fromDate : getDate(currentDate, 1),
                fromTime : getTime(currentDate),
                toDate : getDate(currentDate),
                toTime : getTime(currentDate),
                option : "",
                type : ""
            }
        });
    }
    
}

function getDate(currentDate, beforeDay){
    if (beforeDay) {
        currentDate = new Date(currentDate.valueOf() - beforeDay * 24 * 60 * 60 * 1000);
    }
    let mm = currentDate.getMonth() + 1;
    let dd = currentDate.getDate();
    let yyyy = currentDate.getFullYear();
    return yyyy + "-" + (mm > 9 ? '' : '0') + mm + "-" + (dd > 9 ? '' : '0') + dd;
}

function getTime(currentDate, beforeMinute){
    if (beforeMinute) {
        currentDate = new Date(currentDate.valueOf() - 1000 * 60 * beforeMinute);
    }
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    return (hours > 9 ? '' : '0') +  hours + ':' + (minutes > 9 ? '' : '0') + minutes +":00";
}

function getActiveChartArray(fieldList, metricList){
    let timeFlag = false;
    let dimenCount = 0;
    let timeGranularity = "";

    if(metricList.length == 0) return [0,0,0,0,0,0,0,0];
    if(fieldList.length == 0) return [1,0,0,0,0,0,0,0];

    for(let i=0;i<fieldList.length;i++){
        if(fieldList[i].order =="__time"){
            timeFlag = true;
            timeGranularity = fieldList[i].count;
        }else dimenCount++;
    }

    if(metricList.length > 1 || dimenCount > 2 || (metricList.length == 1 && dimenCount > 1 && timeFlag))
        return [0,1,0,0,0,0,0,0];

    if(timeFlag){
        if(timeGranularity == "ALL"){
            if(dimenCount == 0) return [0,1,0,0,0,0,1,0];
            else return [0,1,1,0,0,0,0,0];
        }
    }

    if(dimenCount == 0) return [0,1,0,1,1,1,1,0];
    if(dimenCount == 2) return [0,1,1,0,0,1,0,1];
    if(timeFlag) return [0,1,1,1,1,1,0,1];
    else return [0,1,0,0,0,1,1,0];
}

export const changeAggregationType = (aggregationType) => (dispatch) => {
    dispatch({
        type: CHANGE_AGGREGATION_TYPE,
        payload: aggregationType
    })
}

export const selectPostAggregationMetric = (metricName) => (dispatch) => {
    dispatch({
        type: SELECT_POST_AGGREGATION_METRIC,
        payload: metricName
    })
}

export const removePostAggregationMetric = (index) => (dispatch) => {
    dispatch({
        type: REMOVE_POST_AGGREGATION_METRIC,
        payload: index
    })
}

export const setFirstMetricSorting = (sortType) => (dispatch) => {
    dispatch({
        type: SET_FIRST_METRIC_SORTING,
        payload: sortType
    })
    dispatch(chartCheck())
}

export const displaySearchQuery = (isShow) => (dispatch) => {
    dispatch({
        type: DISPLAY_SEARCH_QUERY,
        payload: isShow
    })
}

export const getGroupByFilter = (queries,callback) =>(dispatch)=>{
    API().post("/rest/visualize/topn-condition",queries).then(res=>{
        callback(res.data)
    })
}