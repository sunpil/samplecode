import {
    DASHBOARDLIST,
    VISUALIZELIST,
    LOADITEM,
    CHANGEEDITABLE,
    RESETDATA,
    SELECTDASHBOARD,
    SETTIME,
    REMOVEGRID,
    LOAD_CUSTOM_COMPONENT,
    SELECT_DASHBOARD_ITEM_TAB,
    CUSTOM_COMPONENT_PAGING,
    REMOVE_GRID_FOR_ID,
    ALLGROUPLIST,
    SET_REFRESH
} from './DashboardActions'

const initialState = {
    dash_id : "add",
    dashboardList: [],
    dashboard : {},
    gridList:[],
    layoutList:[],
    visualizeList: [],
    visualPagenation : {
        totalCount:"",
        totalPage:"",
        currentPage:"",
        listSize:""
    },
    editable : false,
    fromDate : "",
    fromTime : "",
    toDate : "",
    toTime : "",
    customComponentList: [],    
    selectedDashboardItemTab: "visualize",
    customComponentPagingList: [],
    customComponentPagenation : {
        totalCount:"",
        totalPage:"",
        currentPage:"",
        listSize:""
    },
    allGroupList : []
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case ALLGROUPLIST:
            return {...state, allGroupList : action.payload}
        case REMOVEGRID: 
            return {
                ...state,
                gridList : state.gridList.filter(item => item !== state.gridList[action.payload]),
                layoutList : state.layoutList.filter(item => item !== state.layoutList[action.payload])
            }
        case SETTIME:
            return {
                ...state, ...action.payload
            }
        case SELECTDASHBOARD:
            return {
                ...state,
                dashboard : action.payload
            }
        case RESETDATA:
            return {
                ...state,
                dashboard : {},
                gridList : [],
                layoutList : []
            }
        case CHANGEEDITABLE:
            return {
                ...state, editable : action.payload,
                layoutList : state.layoutList.map((item) => {
                    return {...item,
                    static:action.payload,
                    isDraggable:action.payload,
                    isResizable:action.payload}
                })
            }
        case DASHBOARDLIST:
            return {
                ...state,
                dashboardList : action.payload
            }
        case VISUALIZELIST:
            return {
                ...state,
                visualizeList: action.payload.result,
                visualPagenation: action.payload,
            }
        case LOADITEM:
            if(state.gridList.filter(item => item.id == action.payload.id).length < 1){
                return {
                    ...state,
                    gridList : state.gridList.concat({
                        itemType : action.payload.itemType,
                        chartType : action.payload.chartType,
                        id : action.payload.id,
                        name : action.payload.name,
                        allList : action.payload.allList,
                        static_date : action.payload.static_date,
                        start : action.payload.stTime,
                        end : action.payload.edTime,
                        path : action.payload.path,
                        analyticsSpec : action.payload.analyticsSpec,
                        visualSpec : action.payload.visualSpec,
                    }),
                    layoutList : state.layoutList.concat({
                        i : action.payload.layout.i || action.payload.id,
                        x : Number(action.payload.layout.x) || 0,
                        y : Number(action.payload.layout.y) || 0,
                        w : Number(action.payload.layout.w) || 3,
                        h : Number(action.payload.layout.h) || 3,
                        static:state.editable
                    })
                }
            }
        case LOAD_CUSTOM_COMPONENT:
            return {
                ...state,
                customComponentList : action.payload,
            }
        case SELECT_DASHBOARD_ITEM_TAB:
            return {
                ...state,
                selectedDashboardItemTab : action.payload,
            }
        case CUSTOM_COMPONENT_PAGING:
            return {
                ...state,
                customComponentPagingList: action.payload.result,
                customComponentPagenation: action.payload,
            }
        case REMOVE_GRID_FOR_ID:
            return {
                ...state,
                gridList : state.gridList.filter(item => item.id !== action.payload),
                layoutList : state.layoutList.filter(item => item.id !== action.payload)
            }
        case SET_REFRESH:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    refresh : action.payload.refresh,
                    refresh_interval : action.payload.refresh_interval,
                    refresh_unit : action.payload.refresh_unit
                }   
            }
        default:
            return state;
    }
}

export default reducer;