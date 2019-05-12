import React from 'react';
import graph from "juijs-graph";
import CustomTheme from "../theme/custom";
import BarBrush from "juijs-chart/src/brush/stackbar";
import LegendWidget from "juijs-chart/src/widget/legend";
import TooltipWidget from "juijs-chart/src/widget/tooltip";
import { getTextSize, getMaxDomainValue } from "../util/svg";

let chartObject = {};

class ActiveStackedBarChart extends React.Component {

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
        let paddingLeft = 50;
        let paddingRight = 15;

        for (let i = 0; i < this.props.data.labels.length; i++) {
            let dataMap = {
                dataTempKey : this.props.data.labels[i]
            };
            let addData = 0;
            for (let j = 0; j < this.props.data.datasets.length; j++) {
                dataMap[this.props.data.datasets[j].label] = this.props.data.datasets[j].data[i];
                addData += this.props.data.datasets[j].data[i];
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
            if (addData > maxData) {
                maxData = addData;
            }
            chartDatas.push(dataMap);
            let rect = getTextSize(this.props.data.labels[i], {
                fontSize : 13
            });
            if (rect.width > maxLabelWidth) {
                maxLabelWidth = rect.width;
            }
        }

        if (this.props.legend) {
            if (maxLegendWidth > 0) {
                paddingRight = Math.ceil(maxLegendWidth) + 30;
            }
        }

        let chartWidth = $(`#${this.props.chartId}`).width();

        if (maxLabelWidth > 0) {
            maxLabelWidth = Math.ceil(maxLabelWidth);
            paddingRight = paddingRight + maxLabelWidth + 10;
            let paddingRightPercent = paddingRight / (chartWidth - paddingLeft - paddingRight);
            if (paddingRightPercent > 0.45) {
                paddingRight = paddingRight * 0.45;
            }
            if (paddingRight < 50) {
                paddingRight = 50;
            }
        }

        if (maxData > 0) {
            maxDomainValue = getMaxDomainValue(maxData);
        }

        return ({ 
            chartDatas : chartDatas,
            targets : targets,
            maxDomainValue : maxDomainValue,
            paddingLeft : paddingLeft,
            paddingRight : paddingRight
        });
    } 

    componentDidMount = () => {
        let chartInfo = this.chartInfo();

        this.graphReady(this.props.chartId, chartInfo.chartDatas, chartInfo.targets, 
                        this.props.legend, this.props.xFormat, this.props.tooltipFormat,
                        chartInfo.paddingLeft, chartInfo.paddingRight, this.props.step, 
                        chartInfo.maxDomainValue);

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
            let xFormat = this.props.xFormat;
            let step = this.props.step;
            chartObject[this.props.chartId].get("padding").left = chartInfo.paddingLeft;
            chartObject[this.props.chartId].get("padding").right = chartInfo.paddingRight;
            chartObject[this.props.chartId].axis(0).update(chartInfo.chartDatas);
            chartObject[this.props.chartId].axis(0).set("x", {
                type : "range",
                domain : [0, chartInfo.maxDomainValue],
                format : function(d) {
                    if (xFormat) {
                        return xFormat(d);
                    } else {
                        return new Intl.NumberFormat('ko-KR').format(d);
                    }
                },
                line : true,
                orient : "bottom",
                step : (step ? step : 7)
            });
            chartObject[this.props.chartId].updateBrush(0, {
                type : "stackbar",
                target : chartInfo.targets,
                minSize : 20
            });
            chartObject[this.props.chartId].render(true);
        }  
    }

    resizeRender = (width, height) => {
        chartObject[this.props.chartId].setSize(width, height);
        chartObject[this.props.chartId].render(true);
    };

    graphUse = () => {
        graph.use(CustomTheme, BarBrush, LegendWidget, TooltipWidget);
    };

    graphReady = (idChart, datas, targets, legend, xFormat, tooltipFormat, paddingLeft, 
                  paddingRight, step, maxDomainValue) => {
        this.graphUse();

        graph.ready([ "chart.builder" ], (builder) => {
            chartObject[idChart] = builder(`#${idChart}`, {
                padding :  {
                    top : 15,
                    right : paddingRight,
                    buttom : 15,
                    left : paddingLeft
                },
                theme : "custom",
                axis : {
                    x : {
                        type : "range",
                        domain : [0, maxDomainValue],
                        format : function(d) {
                            if (xFormat) {
                                return xFormat(d);
                            } else {
                                return new Intl.NumberFormat('ko-KR').format(d);
                            }
                        },
                        line : true,
                        orient : "bottom",
                        step : (step ? step : 7)
                    },
                    y : {
                        type : "block",
                        domain : "dataTempKey",
                        line : true,
                        orient : "right"
                    },
                    area : {
                        width : "100%",
                        height : "100%"
                    },
                    data : datas
                },
                brush : {
                    type : "stackbar",
                    target : targets,
                    minSize : 20
                },
                style: {
                    gridXFontColor : "#8C8C8C",
                    gridYFontColor : "#5C5C5C",
                    gridXFontSize : 13,
                    gridYFontSize : 13,
                    gridXAxisBorderWidth : 1,
                    gridYAxisBorderWidth : 1
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
                        if (tooltipFormat) {
                            return tooltipFormat(k, v);
                        } else {
                            return k.dataTempKey + " " + v + " : " + new Intl.NumberFormat('ko-KR').format(k[v]);
                        }
                    }
                }],
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

export default ActiveStackedBarChart;

