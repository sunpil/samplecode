import {
    DATASOURCELIST,
    CODELIST,
    DATASOURCEDETAIL,
    CARDINALLIST,
    METRICLIST,
    FILTERTOPNLIST,
    CHANGEFIELD,
    CHARTCHECK,
    CHARTSELECT,
    RESULTLIST,
    ADDLIST,
    SETTIME,
    LOADCHART,
    CHARTLIST,
    REMOVELIST,
    COMPLETEDELETEMETRIC,
    CHANGE_AGGREGATION_TYPE,
    SELECT_POST_AGGREGATION_METRIC,
    REMOVE_POST_AGGREGATION_METRIC,
    SET_FIRST_METRIC_SORTING,
    DISPLAY_SEARCH_QUERY
} from './VisualizeActions';

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

const initialState = {
    datasourceList: [],
    datasourceDetail : {},
    timecodeList: [],
    aggrcodeList: [],
    cardinalMap: {},
    metricList:[],
    selectFieldList:[],
    selectMetricList:[],
    filterTopNList:[],
    selectedFilter : {
        key : "",
        value : ""
    },
    searchFilterFieldList:[],
    selectedChart : 0,
    chartStateArray : [0,0,0,0,0,0,0,0],
    chartDrawable : false,
    resultList:[],
    chartList:[],
    fromDate : "",
    fromTime : "",
    toDate : "",
    toTime : "",
    option : "",
    type : "",
    selectAggrType : null,
    operatorCodeList: [],
    selectedPostAggrMetricList: [],
    sortTypes: [],
    dimensionLabelMap : {},
    displaySearchQuery: false,
    query: null
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case SETTIME:
            return {
                ...state, ...action.payload
            }
        case LOADCHART:
            return {
                ...state,
                ...action.payload,
                displaySearchQuery: action.payload.query ? true : false
            }
        case CHARTLIST:
            return {
                ...state,
                chartList: action.payload
            }
        case DATASOURCELIST:
            return {
                ...state,
                datasourceList: action.payload,
                dimensionLabelMap : (action.payload.length > 0 && action.payload[0].dimensions.length > 0 ? 
                                     action.payload[0].dimensions.reduce((map, obj) => (map[obj.name] = obj.label, map), {}):{})
            }
        case DATASOURCEDETAIL:
            let detail = {};
            for(let i=0;i<state.datasourceList.length;i++){
                if(state.datasourceList[i].id == action.payload){
                    detail = state.datasourceList[i];
                    break;
                }
            }
            return {
                ...state,
                datasourceDetail : detail,
                dimensionLabelMap : (detail && detail.dimensions.length > 0 ? 
                                     detail.dimensions.reduce((map, obj) => (map[obj.name] = obj.label, map), {}):{}),
                selectedChart : 0,
                searchFilterFieldList : [],
                selectMetricList : [],
                selectFieldList : [],
                resultList : []
            }
        case CARDINALLIST:
            return {
                ...state,
                cardinalMap : action.payload
            }
        case FILTERTOPNLIST:
            let nList = action.payload.result;
            if((typeof(action.payload.data) != "undefined") && action.payload.data != ""){
                nList = action.payload.result.filter(item => item[action.payload.key] == action.payload.data)
            }
            return {
                ...state,
                filterTopNList:nList,
                selectedFilter : {
                    key : action.payload.key,
                    value : action.payload.value
                }
            }
        case COMPLETEDELETEMETRIC:
            return {
                ...state,
                selectMetricList : state.selectMetricList.filter(item => item.name !== action.payload)
            }
        case RESULTLIST:
            return {
                ...state,
                resultList:action.payload.result
            }
        case CHANGEFIELD:
            let fieldList = state.selectFieldList;
            let index = -1;
            for(let i=0;i<fieldList.length;i++){
                if(fieldList[i].id == action.payload.id)index = i;
            }
            return {
                ...state,
                selectFieldList : [
                    ...fieldList.slice(0, index),
                    {
                        ...fieldList[index],
                        order: action.payload.order,
                        count : action.payload.count
                    },
                    ...fieldList.slice(index+1, fieldList.length)
                ]
            }
        case METRICLIST:
            return {
                ...state,
                metricList : action.payload,
                selectedPostAggrMetricList: []
            }
        case CODELIST:
            return {
                ...state,
                timecodeList: action.payload.code,
                aggrcodeList: action.payload.aggr.code,
                operatorCodeList : action.payload.operator.code,
                sortTypes: action.payload.sortType.code
            }
        case CHARTSELECT:
            return {
                ...state,
                selectedChart : action.payload,
                chartDrawable : false
            }
        case ADDLIST:
            let type = action.payload.type;
            let item = action.payload.item;
            if(type == 0){
                let list = state.searchFilterFieldList.filter(fil => 
                                fil.dimension == item.dimension && 
                                fil.value.key == item.value.key);
                if(list.length < 1){
                    return {
                        ...state,
                        searchFilterFieldList :state.searchFilterFieldList.concat(item),
                        filterTopNList:[],
                        selectedFilter : {
                            key : "",
                            value : ""
                        }
                    }
                }
            }else if(type == 1){                
                let list = state.selectFieldList.filter(fil => 
                    fil.id == item.id);
                if(list.length < 1){
                    return {
                        ...state,
                        selectFieldList : state.selectFieldList.concat(item)
                    }
                }
            }else{
                let list = state.selectMetricList.filter(fil => 
                    fil.name == item.name);
                if(list.length < 1){
                    return {
                        ...state,
                        selectMetricList :state.selectMetricList.concat(item)
                    }
                }
            }
        case REMOVELIST:
            let list = [];
            if(action.payload.type == 0){
                list = state.searchFilterFieldList;
                return {
                    ...state,
                    searchFilterFieldList : list.filter(item => item !== state.searchFilterFieldList[action.payload.index])
                }
            }else if(action.payload.type == 1){
                list = state.selectFieldList;
                return {
                    ...state,
                    selectFieldList : list.filter(item => item !== state.selectFieldList[action.payload.index])
                }
            }else{
                list = state.selectMetricList;
                return {
                    ...state,
                    selectMetricList : list.filter(item => item !== state.selectMetricList[action.payload.index])
                }
            } 
        case CHARTCHECK:
            let arr = getActiveChartArray(state.selectFieldList, state.selectMetricList);
            let nameArray = ["총합", "테이블", "그리드", "선형", "범위", "막대", "원형", "히트맵"]
            let chartArray = [];
            for(let i=0;i<arr.length;i++){
                chartArray.push({
                    flag:arr[i],
                    name:nameArray[i]
                });
            }         
            return {
                ...state,
                chartStateArray : chartArray,
                chartDrawable : arr[state.selectedChart] == "1"? true: false
            }
        case CHANGE_AGGREGATION_TYPE:
            return {
                ...state,
                selectAggrType : action.payload
            }
        case SELECT_POST_AGGREGATION_METRIC:
            let spamList = state.selectedPostAggrMetricList;
            spamList.push(action.payload)
            return {
                ...state,
                selectedPostAggrMetricList : spamList
            }
        case REMOVE_POST_AGGREGATION_METRIC:
            let rpamList = state.selectedPostAggrMetricList;            
            return {
                ...state,
                selectedPostAggrMetricList : rpamList.filter((item) => item !== state.selectedPostAggrMetricList[action.payload])
            }
        case SET_FIRST_METRIC_SORTING:
            return {
                ...state,
                selectMetricList: [
                    {
                        ...state.selectMetricList[0],
                        orderBy : action.payload
                    },
                    ...state.selectMetricList.slice(1, state.selectMetricList.length)
                ]
            }
        case DISPLAY_SEARCH_QUERY:
            const query = action.payload == false ? null : state.query
            return {
                ...state,
                displaySearchQuery: action.payload,
                query: query
            }
        default:
            return state;
    }
}

export default reducer;