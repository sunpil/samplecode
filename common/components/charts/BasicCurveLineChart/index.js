import React from 'react';
import graph from "juijs-graph";
import CustomTheme from "../theme/custom";
import LineBrush from "juijs-chart/src/brush/line";
import ScatterBrush from "juijs-chart/src/brush/scatter";
import LegendWidget from "juijs-chart/src/widget/legend";
import TooltipWidget from "juijs-chart/src/widget/tooltip";
import { getTextSize, getMaxDomainValue } from "../util/svg";

let chartObject = {};
let activeIndex = 0;

class BasicCurveLineChart extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.props.data) === JSON.stringify(nextProps.data)) {
            return false;
        } else {
            return true;
        }
    }

    chartInfo = () => {
        let chartDatas = [];
        let targets = [];
        let maxLegendWidth = 0;
        let maxLabelWidth = 0;
        let maxData = 0;
        let maxDomainValue = 0;
        let paddingLeft = 15;
        let paddingRight = 15;
        let qCnt = 1;

        for (let i = 0; i < this.props.data.labels.length; i++) {
            let dataMap = {
                timeTempKey : this.props.data.labels[i]
            };
            for (let j = 0; j < this.props.data.datasets.length; j++) {
                dataMap[this.props.data.datasets[j].label] = this.props.data.datasets[j].data[i];
                if (this.props.data.datasets[j].data[i] > maxData) {
                    maxData = this.props.data.datasets[j].data[i];
                }
                if (i === 0) {
                    targets.push(this.props.data.datasets[j].label);
                    if (this.props.legend) {
                        let rect = getTextSize(this.props.data.datasets[j].label, {
                            fontSize : 12
                        });
                        if (rect.width > maxLegendWidth) {
                            maxLegendWidth = rect.width;
                        }
                    }  
                }
            };
            chartDatas.push(dataMap);
            let rect = getTextSize(this.props.data.labels[i], {
                fontSize : 13
            });
            if (rect.width > maxLabelWidth) {
                maxLabelWidth = rect.width;
            }
        }

        if (maxData > 0) {
            maxDomainValue = getMaxDomainValue(maxData);
            let format = "";
            if (this.props.yFormat) {
                format = this.props.yFormat(maxDomainValue);
            } else {
                format = new Intl.NumberFormat('ko-KR').format(maxDomainValue);
            }
            let rect = getTextSize(format, {
                fontSize : 13
            });
            paddingLeft = Math.ceil(rect.width) + 30;
        }

        if (this.props.legend) {
            if (maxLegendWidth > 0) {
                paddingRight = Math.ceil(maxLegendWidth) + 40;
            }
        }

        if (maxLabelWidth > 0) {
            let chartWidth = $(`#${this.props.chartId}`).width();
            maxLabelWidth = Math.ceil(maxLabelWidth);
            let pCnt = Math.floor((chartWidth - paddingLeft - paddingRight) / maxLabelWidth);
            if (pCnt > 0) {
                qCnt = Math.ceil(chartDatas.length / pCnt);
            }
        }

        return ({ 
            chartDatas : chartDatas,
            targets : targets,
            maxDomainValue : maxDomainValue,
            paddingLeft : paddingLeft,
            paddingRight : paddingRight,
            qCnt : qCnt
        });
    } 

    componentDidMount = () => {
        let chartInfo = this.chartInfo();

        this.graphReady(this.props.chartId, chartInfo.chartDatas, this.props.data.labels, 
                        chartInfo.targets, this.props.legend, this.props.yFormat, 
                        this.props.clickCallback, chartInfo.paddingLeft, chartInfo.paddingRight, 
                        chartInfo.qCnt, chartInfo.maxDomainValue);

        if (this.props.onRef) {
            this.props.onRef(this);
        }
    };

    componentWillUnmount = () => {
        if (this.props.onRef) {
            this.props.onRef(null);
        }  
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        let chartInfo = this.chartInfo();

        if (chartObject && chartObject[this.props.chartId]) {
            let yFormat = this.props.yFormat;
            chartObject[this.props.chartId].get("padding").left = chartInfo.paddingLeft;
            chartObject[this.props.chartId].get("padding").right = chartInfo.paddingRight;
            chartObject[this.props.chartId].axis(0).update(chartInfo.chartDatas);
            chartObject[this.props.chartId].axis(0).set("x", {
                type : "fullblock",
                domain : this.props.data.labels,
                format : function(d, cnt) {
                    if (cnt % chartInfo.qCnt === 0) {
                        return d;
                    } else {
                        return " ";
                    }
                },
                line : true
            });
            chartObject[this.props.chartId].axis(0).set("y", {
                type : "range",
                domain : [0, chartInfo.maxDomainValue],
                format : function(d) {
                    if (yFormat) {
                        return yFormat(d);
                    } else {
                        return new Intl.NumberFormat('ko-KR').format(d);
                    }
                },
                line : true,
                orient : "left"
            });
            chartObject[this.props.chartId].updateBrush(0, {
                type : "line",
                active : (this.props.clickCallback ? activeIndex : null),
                activeEvent : (this.props.clickCallback ? "click" : null),
                target : chartInfo.targets,
                symbol : "curve"
            });
            chartObject[this.props.chartId].updateBrush(1, {
                type : "scatter",
                target : chartInfo.targets,
                hide : false
            });
            chartObject[this.props.chartId].render(true);
        }  
    }

    resizeRender = (width, height) => {
        chartObject[this.props.chartId].setSize(width, height);
        chartObject[this.props.chartId].render(false);
    };

    graphUse = () => {
        graph.use(CustomTheme, LineBrush, ScatterBrush, LegendWidget, TooltipWidget);
    };

    graphReady = (idChart, datas, labels, targets, legend, yFormat, clickCallback, 
                  paddingLeft, paddingRight, qCnt, maxDomainValue) => {
        this.graphUse();

        graph.ready([ "chart.builder" ], (builder) => {
            chartObject[idChart] = builder(`#${idChart}`, {
                padding : {
                    top : 32,
                    right : paddingRight,
                    buttom : 15,
                    left : paddingLeft
                },
                theme : "custom",
                axis : {
                    x : {
                        type : "fullblock",
                        domain : labels,
                        format : function(d, cnt) {
                            if (cnt % qCnt === 0) {
                                return d;
                            } else {
                                return " ";
                            }
                        },
                        line : true
                    },
                    y : {
                        type : "range",
                        domain : [0, maxDomainValue],
                        format : function(d) {
                            if (yFormat) {
                                return yFormat(d);
                            } else {
                                return new Intl.NumberFormat('ko-KR').format(d);
                            }
                        },
                        line : true,
                        orient : "left"
                    },
                    area : {
                        width : "100%",
                        height : "100%"
                    },
                    data : datas
                },
                brush : [{
                    type : "line",
                    active : (clickCallback ? activeIndex : null),
                    activeEvent : (clickCallback ? "click" : null),
                    target : targets,
                    symbol : "curve"
                }, {
                    type : "scatter",
                    target : targets,
                    hide : false
                }],
                style: {
                    gridXFontColor: "#8C8C8C",
                    gridYFontColor: "#5C5C5C",
                    gridXFontSize : 13,
                    gridYFontSize : 13,
                    gridXAxisBorderWidth: 1,
                    gridYAxisBorderWidth: 1
                },
                widget : [{
                      type : "legend",
                      orient : "right",
                      format : function(k) {
                          if (legend) {
                              return k;
                          } else {
                              return "";
                          }
                      },
                      icon : (legend ? null : "")
                  }, {
                      type : "tooltip",
                      orient : "top",
                      format : function(k, v) {
                          return k.timeTempKey + " " + v + " : " + new Intl.NumberFormat('ko-KR').format(k[v]);
                      },
                      brush : 1
                  }
                ],
                event : {
                    "mousedown" : function(d) {
                        if (clickCallback) {
                            activeIndex = d.dataIndex;
                            clickCallback(d);
                        }
                    }
                },
                render : false
            });
        });
    };

    render() {
        return (
            <div style={{width: "100%", height: "99%"}}>
                <div id={this.props.chartId} style={{width: "100%", height: "100%"}}/>
            </div>
        )
    }
}

export default BasicCurveLineChart;
