import React from 'react'

import BasicCurveLineChart from "../../common/components/charts/BasicCurveLineChart";
import BasicCurveLineAreaChart from "../../common/components/charts/BasicCurveLineAreaChart";
import PieChart from "../../common/components/charts/PieChart";
import ActiveStackedColumnChart from "../../common/components/charts/ActiveStackedColumnChart";
import HeatMapChart from "../../common/components/charts/HeatMapChart";
import '../css/style.css';
import { extractKey } from "../../common/MapFunctionUtil"
import API from '../../common/API';
import { smallBox } from '../../../components/utils/actions/MessageActions';

export default class VisualizeChart extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.visual.chartDrawable && this.props.visual.metricList.length > 0) this.drawChart(this.props.visual.selectedChart, this.props.visual);
  }

  drawChart = (num, next) => {
    if (next.chartDrawable) {
      switch (Number(num)) {
        case 0:
          this.loadSum(next);
          break;
        case 1:
          this.loadTableChart(next);
          break;
        case 2:
          this.loadGridChart(next);
          break;
        case 3:
          this.loadLineChart(next);
          break;
        case 4:
          this.loadLineAreaChart(next);
          break;
        case 5:
          this.loadBarChart(next);
          break;
        case 6:
          this.loadPieChart(next);
          break;
        case 7:
          this.loadHitmapChart(next);
          break;
        default:
          this.loadSum(next);
          break;
      }
    }
  }

  buildAggregation = (query, metricList, selectMetricList) => {
    let hasArithmetic = false
    let aggregationNameList = []
    let aggregations = []
    let postAggregations = []
    selectMetricList.map((item) => {
      if (item.type !== 'ARITHMETIC') {
        if (aggregationNameList.indexOf(item.name) == -1) {
          aggregations.push({
            "type": item.type,
            "name": item.name,
            "fieldName": item.fieldName
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
    this.buildLimitSpec(query, selectMetricList[0])
    return query
  }

  buildLimitSpec = (groupby, selectMetric) => {
    if (selectMetric) {
      if (selectMetric.orderBy) {
        if (selectMetric.type !== 'ARITHMETIC') {
          groupby.limit = {
            type: "default",
            columns: [{
              dimension: selectMetric.name,
              direction: selectMetric.orderBy
            }]
          }
        }
      }
    }
  }
  makeGroupByQuery = (next, filter) => {
    if (filter) {
      if (filter == "") {
        smallBox({
          title: " 검색 실패.",
          content: `<i class='fa fa-clock-o'></i> <i>cause : 조건에 해당하는 데이터가 없습니다</i>`,
          color: "#C90000",
          iconSmall: "fa fa-thumbs-up bounce animated",
          timeout: 4000
        })
        return
      }
      let groupby = this.buildAggregation(this.props.getGroupbyStructure(), next.metricList, next.selectMetricList);
      let fieldList = next.selectFieldList;
      groupby.dimensions = fieldList.map(f => {
        if (f.id == "시간") {
          groupby.queryGranularity = f.count
          return f.order
        }
        else return f.id
      })
      if (fieldList.length == 1 && fieldList[0].id == "시간") { }
      else
        groupby.filter = filter
      return groupby;
    }
    else {
      let groupby = this.buildAggregation(this.props.getGroupbyStructure(), next.metricList, next.selectMetricList);
      let fieldList = next.selectFieldList;
      groupby.dimensions = fieldList.map(f => {
        if (f.id == "시간") {
          groupby.queryGranularity = f.count
          return f.order
        }
        else return f.id
      })
      return groupby;
    }
  }

  requestAnalyticsCallback = (reqData, callback) => {
    API().post(`/rest/visualize/requestAnalytics`, reqData).then(res => {
      callback(res.data.druidQueryResult.datas);
    })
  }

  loadSum = (next) => {
    let groupby = this.buildAggregation(this.props.getGroupbyStructure(), next.metricList, next.selectMetricList);
    this.props.doVisualizeDatas(groupby, next.selectMetricList);
  }

  loadTableChart = (next) => {
    const queries = this.makeTopStructures(next)
    if (queries.length != 0) {
      this.props.doGetGroupByFilter(queries, (filter) => {
        const groupby = this.makeGroupByQuery(next, filter)
        this.props.doVisualizeDatas(groupby, next.selectMetricList);
      })
    }
    else {
      const groupby = this.makeGroupByQuery(next)
      this.props.doVisualizeDatas(groupby, next.selectMetricList);
    }
  }

  loadGridChart = (next) => {
    const queries = this.makeTopStructures(next)
    if (queries.length != 0) {
      this.props.doGetGroupByFilter(queries, (filter) => {
        const groupby = this.makeGroupByQuery(next, filter)
        this.props.doVisualizeDatas(groupby, next.selectMetricList);
      })
    }
    else {
      const groupby = this.makeGroupByQuery(next)
      this.props.doVisualizeDatas(groupby, next.selectMetricList);
    }
  }

  loadHitmapChart = (next) => {
    const queries = this.makeTopStructures(next)
    if (queries.length != 0) {
      this.props.doGetGroupByFilter(queries, (filter) => {
        const groupby = this.makeGroupByQuery(next, filter)
        this.props.doVisualizeDatas(groupby, next.selectMetricList);
      })
    }
    else {
      const groupby = this.makeGroupByQuery(next)
      this.props.doVisualizeDatas(groupby, next.selectMetricList);
    }
  }

  loadLineChart = (next) => {
    const queries = this.makeTopStructures(next)
    if (queries.length != 0) {
      this.props.doGetGroupByFilter(queries, (filter) => {
        const groupby = this.makeGroupByQuery(next, filter)
        this.props.doVisualizeDatas(groupby, next.selectMetricList);
      })
    }
    else {
      const groupby = this.makeGroupByQuery(next)
      this.props.doVisualizeDatas(groupby, next.selectMetricList);
    }
  }

  loadLineAreaChart = (next) => {
    const queries = this.makeTopStructures(next)
    if (queries.length != 0) {
      this.props.doGetGroupByFilter(queries, (filter) => {
        const groupby = this.makeGroupByQuery(next, filter)
        this.props.doVisualizeDatas(groupby, next.selectMetricList);
      })
    }
    else {
      const groupby = this.makeGroupByQuery(next)
      this.props.doVisualizeDatas(groupby, next.selectMetricList);
    }
  }

  loadPieChart = (next) => {
    const queries = this.makeTopStructures(next)
    if (queries.length != 0) {
      this.props.doGetGroupByFilter(queries, (filter) => {
        const groupby = this.makeGroupByQuery(next, filter)
        this.props.doVisualizeDatas(groupby, next.selectMetricList);
      })
    }
    else {
      const groupby = this.makeGroupByQuery(next)
      this.props.doVisualizeDatas(groupby, next.selectMetricList);
    }
  }

  loadBarChart = (next) => {
    const queries = this.makeTopStructures(next)
    if (queries.length != 0) {
      this.props.doGetGroupByFilter(queries, (filter) => {
        const groupby = this.makeGroupByQuery(next, filter)
        this.props.doVisualizeDatas(groupby, next.selectMetricList);
      })
    }
    else {
      const groupby = this.makeGroupByQuery(next)
      this.props.doVisualizeDatas(groupby, next.selectMetricList);
    }
  }
  makeTopStructures = (next) => {
    const queries = []
    let fieldList = next.selectFieldList
    fieldList.map((f) => {
      let topn = this.props.getTopNStructure()
      if (f.order != "__time") {
        topn.dimensions.push(f.id)
        topn.threshold = f.count
        topn.metric = f.order
        const spec = next.metricList.filter((item) => { if (item.metric_name === f.order) return item })
        const filter = {
          type: "OR",
          filters: next.searchFilterFieldList.map(condition => {
            return {
              dimension: condition.dimension,
              value: condition.value.key ? condition.value.key : condition.dimension,
              type: condition.type
            }
          })
        }
        topn = this.buildAggregation(topn, next.metricList, [{
          type: spec[0].aggr_type,
          name: spec[0].metric_name,
          fieldName: spec[0].metric_value
        }])
        if (filter.filters.length > 0)
          topn.filter = filter
        queries.push(topn)
      }
    })
    return queries
  }
  makeFilterGroup = (dimension, resultList) => {
    let resultFilterArray = [];

    if (resultList.length == 1) {
      const key = extractKey(resultList[0][dimension])
      return {
        dimension: dimension,
        value: key,
        type: "EQUALS",
        filters: []
      }
    } else {
      for (let i = 0; i < resultList.length; i++) {
        const key = extractKey(resultList[i][dimension])
        resultFilterArray.push({
          dimension: dimension,
          value: key,
          type: "EQUALS",
          filters: []
        })
      }
      return {
        "type": "OR",
        "filters": resultFilterArray
      }
    }
  }

  buildGroupByFilterSpec = (query, dimension, resultList) => {
    if (resultList && resultList.length > 0) {
      if (resultList.length == 1) {
        let filter = {
          "type": "AND",
          "filters": []
        }

        if (typeof (query["filter"]) != "undefined") {
          filter.filters.push(this.makeFilterGroup(dimension, resultList))
          filter.filters.push(query["filter"])
        } else {
          filter = this.makeFilterGroup(dimension, resultList)
        }
        query.filter = filter;
      } else {
        let filter = {
          "type": "AND",
          "filters": []
        }
        filter.filters.push(this.makeFilterGroup(dimension, resultList))
        if (typeof (query["filter"]) != "undefined") {
          filter.filters.push(query["filter"])
        }
        query.filter = filter;
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let next = nextProps.visual;
    let now = this.props.visual;
    if ((now.chartDrawable == false && next.chartDrawable == true) || now.selectedChart != next.selectedChart ||
      now.searchFilterFieldList.length != next.searchFilterFieldList.length ||
      now.selectFieldList.length != next.selectFieldList.length || now.selectMetricList.length != next.selectMetricList.length ||
      now.fromDate != next.fromDate || now.toDate != next.toDate || now.fromTime != next.fromTime || now.toTime != next.toTime ||
      now.metricList.length != next.metricList.length) {
      if (next.metricList.length > 0) {
        this.drawChart(next.selectedChart, next)
      }
    } else {
      if (now.selectFieldList.length > 0 && next.selectFieldList.length > 0) {
        let list1 = now.selectFieldList;
        let list2 = next.selectFieldList;
        for (let i = 0; i < list1.length; i++) {
          if (list1[i].order != list2[i].order || list1[i].count != list2[i].count) {
            this.drawChart(next.selectedChart, next);
            break;
          }
        }
      }
      if (now.selectMetricList.length > 0 && next.selectMetricList.length > 0) {
        for (let i = 0; i < now.selectMetricList.length; i++) {
          if (now.selectMetricList[i].orderBy != next.selectMetricList[i].orderBy) {
            this.drawChart(next.selectedChart, next);
            break;
          }
        }
      }
    }
  }

  render() {
    if (this.props.visual.chartDrawable) {
      switch (Number(this.props.visual.selectedChart)) {
        case 0:
          return <TableChartRender list={this.props.visual.resultList} />
        case 1:
          return <TableChartRender list={this.props.visual.resultList} />
        case 2:
          return <GridChartRender list={this.props.visual.resultList} />
        case 3:
          return <LineChartRender list={this.props.visual.resultList} />
        case 4:
          return <LineAreaChartRender list={this.props.visual.resultList} />
        case 5:
          return <BarChartRender list={this.props.visual.resultList} />
        case 6:
          return <PieChartRender list={this.props.visual.resultList} />
        case 7:
          return <HeatmapChartRender list={this.props.visual.resultList} />
        default:
          return <div></div>
      }
    } else {
      return <div></div>
    }
  }
}

const GridChartRender = (props) => {
  const { list } = props;

  if (list.length > 2) {
    let valueMap = {};
    let order = [];
    let timeFlag = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].type == "V") valueMap = list[i].list;
      if (list[i].type == "T") { order.push(list[i].key); timeFlag = true; }
      if (list[i].type == "D") order.push(list[i].key);
    }

    if (order.length != 2) return ""

    let datasets = [];
    let xLabels = list.filter(item => item.key == order[0])[0].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
    let yLabels = list.filter(item => item.key == order[1])[0].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);

    if (!timeFlag || order[1] == "시간") {
      let tempLabels = xLabels;
      xLabels = yLabels;
      yLabels = tempLabels;
    }

    for (let i = 0; i < yLabels.length; i++) {
      datasets.push(xLabels.map((item) => { return valueMap[yLabels[i] + "_" + item] || '-' }))
    }

    if (timeFlag == true) {
      xLabels = xLabels.map((item) => {
        let val = item.split("T");
        let value = val[0].split("-")[1] + "-" + val[0].split("-")[2] + " " + val[1].split(":")[0] + ":" + val[1].split(":")[1];
        return value;
      }
      )
    }

    return (
      <table className="table fieldUnselected">
        <tbody>
          <tr>
            <td>&nbsp;</td>
            {xLabels.map((item, idx) => { return <td key={idx}>{item}</td> })}
          </tr>
          {
            yLabels.map((item, idx) => {
              return <tr key={idx}>
                <td>{item}</td>
                {
                  datasets[idx].length > 0 && datasets[idx].map((data, idx2) => {
                    return <td key={idx2}>{data}</td>
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
  if (list.length > 0) {
    return (
      <div>
        <table className="table">
          <tbody>
            <tr>
              {
                list.map((item, idx) => {
                  if (item.type != "V") {
                    return <td style={{ fontWeight: "bold" }} key={idx}>{item.key}</td>
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
                      if (item.type == "T") {
                        let val = value.split("T");
                        let timevalue = val[0].split("-")[1] + "-" + val[0].split("-")[2] + " " + val[1].split(":")[0] + ":" + val[1].split(":")[1];
                        return <td key={idx}>{timevalue || '-'}</td>
                      } else {
                        if (item.type != "V") {
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
  const { list } = props;

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
      labelList = dimenList.map((item) => { return item; });
    }

    let dataList = {
      data: metricList
    }
    datasets.push(dataList)

    return <PieChart chartId="pieChart" data={{ datasets: datasets, labels: labelList }} legend={true} />
  }

  return ""
}

const LineChartRender = (props) => {
  const { list } = props;

  if (list.length > 2) {
    let timeList = [];
    let dimenList = [];
    let metricKey = "";
    let valueMap = {};
    for (let i = 0; i < list.length; i++) {
      if (list[i].type == "V") valueMap = list[i].list;
      if (list[i].type == "M") metricKey = list[i].key;
      if (list[i].type == "T") timeList = list[i].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
      if (list[i].type == "D") dimenList = list[i].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
    }

    let datasets = [];
    let labelList = timeList.map((item) => {
      let val = item.split("T");
      let value = val[0].split("-")[1] + "-" + val[0].split("-")[2] + " " + val[1].split(":")[0] + ":" + val[1].split(":")[1];
      return value;
    });

    if (dimenList.length == 0) {
      let dataList = {
        data: timeList.map((item) => { return valueMap[item] || 0 }),
        label: metricKey
      }
      datasets.push(dataList)
    } else {
      for (let i = 0; i < dimenList.length; i++) {
        let dataList = {
          data: timeList.map((item) => { return valueMap[dimenList[i] + "_" + item] || 0 }),
          label: dimenList[i]
        }
        datasets.push(dataList)
      }
    }

    return <BasicCurveLineChart chartId="basicCurveLineChart" data={{ datasets: datasets, labels: labelList }} legend={true} />
  }

  return ""
}

const LineAreaChartRender = (props) => {
  const { list } = props;

  if (list.length > 2) {
    let timeList = [];
    let dimenList = [];
    let metricKey = "";
    let valueMap = {};

    for (let i = 0; i < list.length; i++) {
      if (list[i].type == "V") valueMap = list[i].list;
      if (list[i].type == "M") metricKey = list[i].key;
      if (list[i].type == "T") timeList = list[i].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
      if (list[i].type == "D") dimenList = list[i].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
    }

    let datasets = [];
    let labelList = timeList.map((item) => {
      let val = item.split("T");
      let value = val[0].split("-")[1] + "-" + val[0].split("-")[2] + " " + val[1].split(":")[0] + ":" + val[1].split(":")[1];
      return value;
    });

    if (dimenList.length == 0) {
      let dataList = {
        data: timeList.map((item) => { return valueMap[item] || 0 }),
        label: metricKey
      }
      datasets.push(dataList)
    } else {
      for (let i = 0; i < dimenList.length; i++) {
        let dataList = {
          data: timeList.map((item) => { return valueMap[dimenList[i] + "_" + item] || 0 }),
          label: dimenList[i]
        }
        datasets.push(dataList)
      }
    }

    return <BasicCurveLineAreaChart chartId="basicCurveLineAreaChart" data={{ datasets: datasets, labels: labelList }} legend={true} />
  }

  return ""
}

const HeatmapChartRender = (props) => {
  const { list } = props;

  if (list.length > 2) {
    let valueMap = {};
    let order = [];
    let timeFlag = false;

    for (let i = 0; i < list.length; i++) {
      if (list[i].type == "V") valueMap = list[i].list;
      if (list[i].type == "T") { order.push(list[i].key); timeFlag = true; }
      if (list[i].type == "D") order.push(list[i].key);
    }

    let datasets = [];
    let xLabels = list.filter(item => item.key == order[0])[0].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
    let yLabels = list.filter(item => item.key == order[1])[0].list.reduce((a, b) => { if (a.indexOf(b) < 0) a.push(b); return a; }, []);

    if (!timeFlag || order[1] == "시간") {
      let tempLabels = xLabels;
      xLabels = yLabels;
      yLabels = tempLabels;
    }

    for (let i = 0; i < yLabels.length; i++) {
      datasets.push(xLabels.map((item) => { return Number(valueMap[yLabels[i] + "_" + item] || 0) }));
    }

    if (timeFlag == true) {
      xLabels = xLabels.map((item) => {
        let val = item.split("T");
        let value = val[0].split("-")[1] + "-" + val[0].split("-")[2] + " " + val[1].split(":")[0] + ":" + val[1].split(":")[1];
        return value;
      }
      )
    }

    return <HeatMapChart chartId="heatMapChart" data={{ datasets: datasets, xLabels: xLabels, yLabels: yLabels }} />
  }

  return ""
}

const BarChartRender = (props) => {
  const { list } = props;

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
        data: firstArr.map((item) => { return valueMap[item] || 0 }),
        label: metricKey
      }
      datasets.push(dataList)
    } else {
      for (let i = 0; i < secondArr.length; i++) {
        let dataList = {
          data: firstArr.map((item) => { return valueMap[secondArr[i] + "_" + item] || valueMap[item + "_" + secondArr[i]] || 0 }),
          label: secondArr[i]
        }
        datasets.push(dataList)
      }
    }

    return <ActiveStackedColumnChart chartId="activeStackedColumnChart" data={{ datasets: datasets, labels: labelList }} legend={true} />
  }

  return ""
}

