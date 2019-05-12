import API from '../common/API'
import { extractKey, extractValue } from '../common/MapFunctionUtil'

import {getMenuList} from '../../components/navigation/NavigationActions'

export const DASHBOARDLIST = "dashboard/DASHBOARDLIST";
export const SELECTDASHBOARD = "dashboard/SELECTDASHBOARD";
export const LOADITEM = "dashboard/LOADITEM";
export const VISUALIZELIST = "dashboard/VISUALIZELIST";
export const CHANGEEDITABLE = "dashboard/CHANGEEDITABLE";
export const RESETDATA = "dashboard/RESETDATA";
export const SETTIME = "dashboard/SETTIME";
export const REMOVEGRID = "dashboard/REMOVEGRID";
export const LOAD_CUSTOM_COMPONENT = "dashboard/LOAD_CUSTOM_COMPONENT";
export const SELECT_DASHBOARD_ITEM_TAB = "dashboard/SELECT_DASHBOARD_ITEM_TAB";
export const CUSTOM_COMPONENT_PAGING = "dashboard/CUSTOM_COMPONENT_PAGING";
export const REMOVE_GRID_FOR_ID = "dashboard/REMOVE_GRID_FOR_ID";
export const ALLGROUPLIST = "dashboard/ALLGROUPLIST";
export const SET_REFRESH = "dashboard/SET_REFRESH"

export const dashboardList = () => (dispatch) => {
    let url = '/rest/dashboard/dashboardList';
    return API().get(url).then(res => {
        dispatch({
            type: DASHBOARDLIST,
            payload: res.data
        });
    });
}

export const changeEditable = (flag) => (dispatch) => {
    dispatch({
        type: CHANGEEDITABLE,
        payload: flag
    });
}

export const saveDashboard = (reqData) => (dispatch) => {
    let url = '/rest/dashboard/createDashboard';
    return API().post(url, reqData).then(res => {
        dispatch(dashboardList());
        dispatch(getMenuList(false))
    });
}

export const updateDashboard = (reqData) => (dispatch) => {
    let url = '/rest/dashboard/updateDashboard';
    return API().put(url, reqData).then(res => {
        dispatch(dashboardList());
    });
}

export const resetData = () => (dispatch) => {
    dispatch({
        type: RESETDATA
    });
}

export const deleteDashboard = (dash_id) => (dispatch) => {
    let url = '/rest/dashboard/delete?dash_id='+dash_id;
    return API().delete(url).then(res => {
        dispatch(dashboardList());
        dispatch(getMenuList(false))
    });
}

export const timeSetting = (timeObj) => (dispatch) => {
    if((typeof(timeObj) != "undefined")){
        dispatch({
            type: SETTIME,
            payload: {
                fromDate : timeObj["fromDate"],
                fromTime : timeObj["fromTime"]+":00",
                toDate : timeObj["toDate"],
                toTime : timeObj["toTime"]+":00"
            }
        });
    }else{
        let currentDate = new Date();
        dispatch({
            type: SETTIME,
            payload: {
                fromDate : getDate(currentDate, 7),
                fromTime : getTime(currentDate),
                toDate : getDate(currentDate),
                toTime : getTime(currentDate)
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
    return (hours<10?"0"+hours:hours) + ':' + (minutes<10?"0"+minutes:minutes) +":00";
}

export const removeGrid = (index) => (dispatch) => {
    dispatch({
        type: REMOVEGRID,
        payload: index
    });
}

export const loadItem = (item_id, type, time, selectedTab) => (dispatch) => {
    let staticDate = null
    if(type == "FIXED") {
        staticDate = "N"
    } else {
        staticDate = "Y"
    }
    if (selectedTab === 'visualize') {
        let url = '/rest/dashboard/loadItem?item_id='+item_id;
        return API().get(url).then(res => {
            if(res.status == 200){
                API().get('/rest/visualize/list?id='+res.data.visual["data-source"]).then(res2 => {
                    if(res2.status == 200){
                        res.data["item_id"] = item_id
                        res.data["static_date"] = staticDate
                        res.data["time"] = time;
                        res.data["item_type"] = 'V'
                        loadData(res.data, dispatch, res2);
                    }
                });
            }
        });
    } else {
        return API().get('/rest/dashboard/custom-component?componentId='+ item_id).then(res2 => {
            res2.data['item_id'] = item_id
            res2.data['static_date'] = staticDate
            res2.data['time'] = time
            res2.data["item_type"] = 'C'
            loadCustomComponent(res2.data, dispatch)
        })
    }
}

function loadCustomComponent(data, dispatch) {
    dispatch({
        type : LOADITEM,
        payload : buildLoadItemStructure(data, dispatch)
    })
}

function buildLoadItemStructure(data, dispatch) {
    let start = "";
    let end = "";    
    if(data.static_date === "Y"){        
        start = data["time"].split("/")[0]
        end = data["time"].split("/")[1]        
    } else {
        let currentDate = new Date();
        start = getDate(currentDate, 7) + "T" + getTime(currentDate) + ".000Z"
        end = getDate(currentDate) + "T" + getTime(currentDate) + ".000Z"
    }
    if(start == "T.000Z"){
        let currentDate = new Date();
        start = getDate(currentDate, 7) + "T" + getTime(currentDate) + ".000Z"
        end = getDate(currentDate) + "T" + getTime(currentDate) + ".000Z"
    }

    return {
        datasource : data.datasource,
        filter : data.filter,
        field : data.field,
        metric : data.metric,
        type : data.type,
        itemType : data.item_type,
        start : start,
        end : end,
        id : data.item_id + '_' + data.item_type,
        name : data.name,
        dispatch : dispatch,
        static_date : data.static_date,
        path : data.path,
        layout : {
            i : data.item_id + '_' + data.item_type,
            x : data.coord_x,
            y : data.coord_y,
            w : data.width,
            h : data.height
        },
        stTime : start.substr(0,10) + " " + start.substr(11,8),
        edTime : end.substr(0,10) + " " + end.substr(11,8),
        metricList : data.metricList,
        query : data.query
    }
}

export const loadItems = (dash_id, time) => (dispatch) => {
    API().get('/rest/dashboard/dashboardList').then(res => {
        dispatch({
            type : SELECTDASHBOARD,
            payload : res.data.filter(item => item.dash_id == dash_id)[0]
        })
    });
    
    let url = '/rest/dashboard/loadItems?dash_id='+dash_id;
    return API().get(url).then(res => {
        if(res.status == 200){
            let dataArr = res.data;
            for(let i=0;i<dataArr.length;i++){
                dataArr[i]["time"] = time;
                if (dataArr[i].item_type === 'V') {
                    API().get('/rest/dashboard/loadItem?item_id='+dataArr[i].item_id).then(res2 => {
                        dataArr[i]["vis_name"] = res2.data.vis_name;
                        dataArr[i]["vis_data"] = res2.data.vis_data;
                        dataArr[i]["visual"] = res2.data.visual;
                        API().get('/rest/visualize/list?id='+dataArr[i].visual["data-source"]).then(res3 => {
                            if(res3.status == 200){
                                loadData(dataArr[i], dispatch, res3);
                            }
                        }); 
                    });
                } else {
                    API().get('/rest/dashboard/custom-component?componentId='+ dataArr[i].item_id).then(res2 => {
                        dataArr[i]["name"] = res2.data.name
                        dataArr[i]["path"] = res2.data.path
                        loadCustomComponent(dataArr[i], dispatch)
                    })
                }
            }
        }
    });
}

function buildAggregation(query, metricList, selectMetricList) {
    let hasArithmetic = false
    let aggregationNameList = []
    let aggregations = []
    let postAggregations = []
    selectMetricList.map((item) => {
      if (item.type !== 'ARITHMETIC') {
        if (aggregationNameList.indexOf(item.name) == -1) {
            aggregations.push({
                type: item.type,
                name: item.name,
                fieldName: item.fieldName
            })
            aggregationNameList.push(item.name)
        }
      } else {
        hasArithmetic = true
        let arithmetic;
        metricList.map((metric) => {
          if (metric.metric_name === item.name)
            arithmetic = metric
        })
        let targetAggregations = arithmetic.post_aggregation_fields.split(',')
        targetAggregations.map((target) => {
          metricList.map((metric) => {
            if (metric.metric_name === target) {
                if (aggregationNameList.indexOf(metric.metric_name) == -1) {
                    aggregations.push({
                      type: metric.aggr_type,
                      name: metric.metric_name,
                      fieldName: metric.metric_value
                    })
                    aggregationNameList.push(metric.metric_name)
                }
            }
          })
        })
        postAggregations.push({
          name: arithmetic.metric_name,
          operator: arithmetic.operator,
          fields: targetAggregations
        })
      }
    })
    query.aggregations = aggregations
    if (hasArithmetic) {
        query['postAggregations'] = postAggregations
    }
    
    const firstMetric = selectMetricList[0]    
    let hasOrderBy = false
    if (firstMetric)
        hasOrderBy = firstMetric.hasOwnProperty('orderBy')
    if (hasOrderBy) {
        if (selectMetricList[0].type != 'ARITHMETIC') {
            query.limit = {
                type : "default",
                columns : [ {
                dimension: selectMetricList[0].name,
                direction: selectMetricList[0].orderBy
                }]
            }
        }
    }
    return query
}

function loadData(data, dispatch, res2){
    let visual = data.visual;
    let condition = visual["search-condition"];
    let filter;
    if(condition.filters.filter != null){
        if (condition.filters.filter.length > 1) {
            filter = []
            for(let i=0;i<condition.filters.filter.length;i++){
                let fil = condition.filters.filter[i];
                filterArray.push({
                    dimension: fil.dimension,
                    value: fil.value,
                    type: "EQUALS",
                    filters : []
                });
            }
        }
        else {
            filter = {
                dimension: condition.filters.filter[0].dimension,
                value: condition.filters.filter[0].value,
                type: "EQUALS",
                filters : []
            }
        }
    }
    let fields = visual["select-fields"].field;

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

    let metrics = visual["select-measures"].measure;
    let metricArray = [];

    if(metrics != null){
        let metricList = res2.data;
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
                }
            }
        }
    }

    data["datasource"] = visual["data-source"]
    data["filter"] = filter
    data["field"] = fieldArray
    data["metric"] = metricArray
    data["type"] = visual.type
    data["name"] = data.vis_name
    data["metricList"] = res2.data
    data["query"] = condition.query ? condition.query.value : null
    let vis = buildLoadItemStructure(data, dispatch)

    switch(Number(visual.type)){
        case 0:
            loadSum(vis);
            break;
        case 1:
            loadTableChart(vis);
            break;
        case 2:
            loadGridChart(vis);
            break;
        case 3:
            loadLineChart(vis);
            break;
        case 4:
            loadLineAreaChart(vis);
            break;
        case 5:
            loadBarChart(vis);
            break;
        case 6:
            loadPieChart(vis);
            break;
        case 7:
            loadHitmapChart(vis);
            break;
        default :
            loadSum(vis);
            break;
    }
}

function requestAnalyticsCallback(reqData, callback) {
    API().post('/rest/visualize/requestAnalytics', reqData).then(res => {
        callback(res.data.druidQueryResult.datas);
    });
}

function requestAnalytics(reqData, vis) {
    let visualizeRequest = { "analyticsQueryRequest" : reqData,
                             "selectMetricList" : vis.metric };
    API().post('/rest/visualize/visualizeDatas', visualizeRequest).then(res => {
        vis.dispatch({
            type: LOADITEM,
            payload: {
                itemType : 'V',
                chartType : vis.type,
                id : vis.id,
                name : vis.name,
                allList : res.data ? res.data : [],
                layout : vis.layout,
                static_date : vis.static_date,
                stTime : reqData.startTime.substr(0,10) + " " + reqData.startTime.substr(11,8),
                edTime : reqData.endTime.substr(0,10) + " " + reqData.endTime.substr(11,8),
                analyticsSpec : reqData,
                visualSpec : vis
            }
        });
    });
}

export const visualizeList = (pageData) => (dispatch) => {
    let pData = pageData;
    if(!pageData || pageData.size == "" || pageData.size == null){
        pData = {
            size : "10",
            page : "0"
        }
    }
    let url = '/rest/dashboard/visualizeList?size='+pData.size +'&page='+pData.page;
    return API().get(url).then(res => {
        dispatch({
            type: VISUALIZELIST,
            payload: {
                result : res.data.result,
                totalCount : res.data.totalCount,
                totalPage : res.data.totalPage,
                currentPage : res.data.currentPage,
                listSize : pData.size
            }
        });
    });
}


function loadSum(visual){
    let groupby = buildAggregation(makeGroupbyStructure(visual), visual.metricList, visual.metric);

    requestAnalytics(groupby, visual);
}

function loadTableChart(visual){
    let groupby = buildAggregation(makeGroupbyStructure(visual), visual.metricList, visual.metric);
    let fieldList = visual.field;
    let dimension = "";

    for(let i=0;i<fieldList.length;i++){
        if(fieldList[i].order == "__time"){
        groupby.dimensions.push(fieldList[i].order);
        groupby.queryGranularity = fieldList[i].count;
        } else {
        dimension = fieldList[i].id;
        groupby.dimensions.push(dimension);
        }
    }
    requestAnalytics(groupby, visual);
}

function loadGridChart(visual){
    let groupby = buildAggregation(makeGroupbyStructure(visual), visual.metricList, visual.metric);
    let fieldList = visual.field;

    let dimension = "";
    for(let i=0;i<fieldList.length;i++){
        if(fieldList[i].order == "__time"){
        groupby.dimensions.push(fieldList[i].order);
        groupby.queryGranularity = fieldList[i].count;
        } else {
        dimension = fieldList[i].id;
        groupby.dimensions.push(dimension);
        }
    }

    requestAnalytics(groupby, visual);
}

function loadHitmapChart(visual){
    let topn = makeTopnStructure(visual)
    let groupby = buildAggregation(makeGroupbyStructure(visual), visual.metricList, visual.metric);
    let fieldList = visual.field;
    let flag = false;
    let dimension = "";

    for(let i=0;i<fieldList.length;i++){
        if(fieldList[i].order == "__time"){
            flag = true;
            groupby.dimensions.push(fieldList[i].order);
            groupby.queryGranularity = fieldList[i].count;
        } else {
            dimension = fieldList[i].id;
            groupby.dimensions.push(dimension);
        }
    }

    if(flag){
        requestAnalyticsCallback(topn, (datas)=>{
            buildGroupByFilterSpec(groupby, dimension, datas)
            requestAnalytics(groupby, visual);
        })
    }else{
        let topnArray = makeTopnArrayStructure(visual);
        requestAnalyticsCallback(topnArray[0], (firstResult)=>{
            requestAnalyticsCallback(topnArray[1], (secondResult)=>{
                buildGroupByFilterSpec(groupby, topnArray[0].dimensions[0], firstResult)
                buildGroupByFilterSpec(groupby, topnArray[1].dimensions[0], secondResult)
                requestAnalytics(groupby, visual);
            });
        });
    }
}

function loadLineChart(visual){
  let topn = makeTopnStructure(visual)
  let groupby = buildAggregation(makeGroupbyStructure(visual), visual.metricList, visual.metric);
  let fieldList = visual.field;
  if(topn.dimensions.length == 1 && topn.dimensions[0] == "__time"){
      groupby.dimensions.push(fieldList[0].order);
      groupby.queryGranularity = fieldList[0].count;
      requestAnalytics(groupby, visual);
  }else{
      requestAnalyticsCallback(topn, (datas)=>{
          let dimension = "";

          for(let i=0;i<fieldList.length;i++){
              if(fieldList[i].order == "__time"){
                  groupby.dimensions.push(fieldList[i].order);
                  groupby.queryGranularity = fieldList[i].count;
              } else {
                  dimension = fieldList[i].id;
                  groupby.dimensions.push(dimension);
              }
          }

          buildGroupByFilterSpec(groupby, dimension, datas)
          requestAnalytics(groupby, visual);
      })
  }
}

function loadLineAreaChart(visual){
    let topn = makeTopnStructure(visual)
    let groupby = buildAggregation(makeGroupbyStructure(visual), visual.metricList, visual.metric);
    let fieldList = visual.field;
    if(topn.dimensions.length == 1 && topn.dimensions[0] == "__time"){
        groupby.dimensions.push(fieldList[0].order);
        groupby.queryGranularity = fieldList[0].count;
        requestAnalytics(groupby, visual);
    }else{
        requestAnalyticsCallback(topn, (datas)=>{
            let dimension = "";

            for(let i=0;i<fieldList.length;i++){
                if(fieldList[i].order == "__time"){
                    groupby.dimensions.push(fieldList[i].order);
                    groupby.queryGranularity = fieldList[i].count;
                } else {
                    dimension = fieldList[i].id;
                    groupby.dimensions.push(dimension);
                }
            }

            buildGroupByFilterSpec(groupby, dimension, datas)
            requestAnalytics(groupby, visual);
        })
    }
}

function loadPieChart(visual){
    let topn = makeTopnStructure(visual)
    let groupby = buildAggregation(makeGroupbyStructure(visual), visual.metricList, visual.metric);
    let fieldList = visual.field;

    if(topn.dimensions.length == 1 && topn.dimensions[0] == "__time"){
        groupby.dimensions.push(fieldList[0].order);
        requestAnalytics(groupby, visual);
    }else{
        requestAnalyticsCallback(topn, (datas)=>{
            let dimension = fieldList[0].id;
            groupby.dimensions.push(dimension);
            buildGroupByFilterSpec(groupby, dimension, datas)
            requestAnalytics(groupby, visual);
        })
    }
}

function loadBarChart(visual){
    let topn = makeTopnStructure(visual)
    let groupby = buildAggregation(makeGroupbyStructure(visual), visual.metricList, visual.metric);
    let fieldList = visual.field;
    let dimension = "";
    let flag = false;
    for(let i=0;i<fieldList.length;i++){
        if(fieldList[i].order == "__time"){
            flag = true
            groupby.dimensions.push(fieldList[i].order);
            groupby.queryGranularity = fieldList[i].count;
        } else {
            dimension = fieldList[i].id;
            groupby.dimensions.push(dimension);
        }
    }
    if(topn.dimensions.length == 1 && flag){
        requestAnalytics(groupby, visual);
    }else{
        if(topn.dimensions.length == 1 || flag){
            requestAnalyticsCallback(topn, (datas)=>{                                
                buildGroupByFilterSpec(groupby, dimension, datas)
                requestAnalytics(groupby, visual);
            })
        }else{
            let topnArray = makeTopnArrayStructure(visual);
            requestAnalyticsCallback(topnArray[0], (firstResult)=>{
                requestAnalyticsCallback(topnArray[1], (secondResult)=>{                    
                    buildGroupByFilterSpec(groupby, topnArray[0].dimensions[0], firstResult)
                    buildGroupByFilterSpec(groupby, topnArray[1].dimensions[0], secondResult)                    
                    requestAnalytics(groupby, visual);
                });
            });
        }
    }  

}

function makeGroupbyStructure(visual){

    let reqData = {
      type : "GROUPBY",
      dataSourceId : visual.datasource,
      startTime : visual.start,
      endTime : visual.end,
      queryGranularity : "ALL",
      dimensions: [],
      aggregations : []
    };
   

    if(visual.filter != null){        
        if(visual.filter.length > 0){
            if (visual.filter.length == 1) {
                reqData["filter"] = visual.filter
            } else {
                reqData["filter"] = {
                    "type" : "AND",
                    "filters" : []
                }
                visual.filter.map((item => {
                    reqData.filter.filters.push(item)    
                }))
            }

        }
    }

    if (visual.query != null) {
        reqData["query"] = visual.query
    }
    return reqData;
  }

  function buildTopnAggreagtion(topn, metricList, metricName) {
    let metric = metricList.filter((item) => {
        if (item.metric_name === metricName) {
            return item
        }
    })
    if ('ARITHMETIC' !== metric[0].aggr_type) {
        const ag = topn.aggregations.filter((item) => { if (item.name == metric[0].metric_name) return item})
        if (ag.length == 0) {
            topn.aggregations.push({
                name:metric[0].metric_name,
                type:metric[0].aggr_type,
                fieldName:metric[0].metric_value
            })
        }
    } else {
        const postAggregationFields = metric[0].post_aggregation_fields.split(',');
        postAggregationFields.map((item) => {
          metricList.map((metric) => {
            if (metric.metric_name === item) {
                const ag = topn.aggregations.filter((aggregation) => { if (aggregation.name == item) return aggregation})
                if (ag.length == 0) {
                    topn.aggregations.push({
                    type: metric.aggr_type,
                    name: metric.metric_name,
                    fieldName: metric.metric_value
                    })
                }
            }
          })
        })
        topn.postAggregations = [{
          name: metric[0].metric_name,
          operator: metric[0].operator,
          fields: postAggregationFields
        }]
    }
  }

  function makeTopnStructure(visual){
    let topn = {
      type : "TOPN",
      dataSourceId : visual.datasource,
      startTime : visual.start,
      endTime : visual.end,
      queryGranularity : "ALL",
      dimensions: [],
      threshold : "10",
      metric : "",
      aggregations : []
    }

    let fieldList = visual.field;
    visual.metric.map((item) => {
        buildTopnAggreagtion(topn, visual.metricList, item.name)
    })

    for(let i=0;i<fieldList.length;i++){
      if(fieldList[i].order == "__time"){
        topn.dimensions.push(fieldList[i].order);
      } else {
        topn.dimensions.push(fieldList[i].id);
        if(topn.threshold < fieldList[i].count)topn.threshold = fieldList[i].count;
        visual.metricList.map((item) => {
            if (item.metric_name == fieldList[i].order) {
                buildTopnAggreagtion(topn, visual.metricList, fieldList[i].order)
                topn.metric = fieldList[i].order
            }
        })
      }
    }

    return topn;
  }

  function makeFilterGroup(dimension, resultList){
    let resultFilterArray = [];

    if (resultList.length == 1) {
        const key = extractKey(resultList[0][dimension])
        return {
            dimension : dimension,
            value : key,
            type : "EQUALS",
            filters : []
        }
    } else {
        for(let i=0;i<resultList.length;i++){
            const key = extractKey(resultList[i][dimension])
            resultFilterArray.push({
              dimension : dimension,
              value : key,
              type : "EQUALS",
              filters : []
            })
        }
        return {
        "type" : "OR",
        "filters" : resultFilterArray
        }
    }    
  }

  function buildGroupByFilterSpec(query, dimension, resultList) {
     if (resultList && resultList.length > 0) {
        if (resultList.length == 1) {
            let filter = {
                "type" : "AND",
                "filters" : []
            }
            
            if(typeof(query["filter"]) != "undefined"){
                filter.filters.push(makeFilterGroup(dimension, resultList))
                filter.filters.push(query["filter"])
            } else {
                filter = makeFilterGroup(dimension, resultList)
            }
            query.filter = filter;
        } else {
            let filter = {
                "type" : "AND",
                "filters" : []
            }
            filter.filters.push(makeFilterGroup(dimension, resultList))
            if(typeof(query["filter"]) != "undefined"){
                filter.filters.push(query["filter"])
            }
            query.filter = filter;
        }
     }
  }

  function makeTopnArrayStructure(visual){
    let fieldList = visual.field;
    let topnList = [];

    for(let i=0;i<fieldList.length;i++){
        let topn = {
            type : "TOPN",
            dataSourceId : visual.datasource,
            startTime : visual.start,
            endTime : visual.end,
            queryGranularity : "ALL",
            dimensions: [],
            threshold : "10",
            metric : "",
            aggregations : visual.metric
        }
      topn.dimensions.push(fieldList[i].id);
      if(topn.threshold < fieldList[i].count)topn.threshold = fieldList[i].count;
      topn.metric = fieldList[i].order;

      topnList.push(topn)
    }

    return topnList;
    
  }

export const selectDashboarItemTab = (tabName) => (dispatch) => {
    dispatch({
        type: SELECT_DASHBOARD_ITEM_TAB,
        payload: tabName
    })
}

export const customComponentPagingList = (pageData) => (dispatch) => {
    let pData = pageData;
    if(!pageData || pageData.size == "" || pageData.size == null){
        pData = {
            size : "10",
            page : "0"
        }
    }
    let url = '/rest/dashboard/custom-component-paging?size='+pData.size +'&page='+pData.page;
    return API().get(url).then(res => {
        dispatch({
            type: CUSTOM_COMPONENT_PAGING,
            payload: {
                result : res.data.result,
                totalCount : res.data.totalCount,
                totalPage : res.data.totalPage,
                currentPage : res.data.currentPage,
                listSize : pData.size
            }
        });
    });
}

export const allGroupList = () => (dispatch) => {
    return API().get('/rest/auth-group/list').then(res => {
        dispatch({
            type: ALLGROUPLIST,
            payload: res.data.result
        });
    });
}

export const updateDashboardGroup = (dash_id, group_id) => (dispatch) => {
    return API().put('/rest/dashboard/updateDashboardGroup?dash_id='+dash_id+"&group_id="+group_id).then(res => {
        dispatch(dashboardList());
        dispatch(getMenuList(false));
    });
}

export const loadCustomComponentList = () => (dispatch) => {
    return API().get('/rest/dashboard/custom-component-list').then(res => {
        if (res.data) {
            let list = []
            res.data.map((item) => {
                list[item.component_id + ""] = {
                    name : item.name,
                    path : item.path
                }
            })

            dispatch({
                type: LOAD_CUSTOM_COMPONENT,
                payload : list
            })
        }
    })
}

export const removeGridForId = (id) => (dispatch) => {
    dispatch({
        type : REMOVE_GRID_FOR_ID,
        payload : id
    })
}

export const updateDashboardRefresh = (dash_id, refresh, interval, unit) => (dispatch) => {
    if (typeof(dash_id) != 'undefined') {
        let url = '/rest/dashboard/updateDashboardRefresh?dash_id='+ dash_id + '&refresh=' + refresh + '&refresh_interval='+interval+'&refresh_unit='+unit;
        API().put(url).then(res => {
            dispatch({
                type: SET_REFRESH,
                payload: {
                    refresh: refresh,
                    refresh_interval: interval,
                    refresh_unit: unit
                }
            })
        })
    }
}