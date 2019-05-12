import React from 'react'
import graph from "juijs-graph";
import CustomTheme from "../theme/custom";
import BubbleBrush from "juijs-chart/src/brush/bubble";
import TooltipWidget from "juijs-chart/src/widget/tooltip";
import { getTextSize, getMaxDomainValue } from "../util/svg";

let chartObject = {};

class BubbleChart extends React.Component {

    constructor(props){
        super(props);
    }

    chartInfo = () => {
        let chartDatas = [];
        let maxLabelWidth = 0;
        let maxData = 0;
        let maxDomainValue = 0;
        let paddingLeft = 15;
        let paddingRight = 15;
        let qCnt = 1;

        for (let i = 0; i < this.props.data.length; i++) {
            if (this.props.data[i].value > maxData) {
                maxData = this.props.data[i].value;
            }
        }  

        for (let i = 0; i < this.props.data.length; i++) {
            let data = this.props.data[i];
            let dataMap = {};
            if (data.label) {
                dataMap.label = data.label;
            } else {
                dataMap.label = " ";
            }
            dataMap.value = data.value;
            dataMap.scale = Math.round((data.value / maxData) * 100);
            chartDatas.push(dataMap);
            let rect = getTextSize(data.label, {
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
            maxDomainValue : maxDomainValue,
            paddingLeft : paddingLeft,
            paddingRight : paddingRight,
            qCnt : qCnt
        });
    } 

    componentDidMount = () => {
        let chartInfo = this.chartInfo();

        this.graphReady(this.props.chartId, chartInfo.chartDatas, this.props.yFormat, 
                        chartInfo.paddingLeft, chartInfo.paddingRight, chartInfo.qCnt,
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
            let yFormat = this.props.yFormat;
            chartObject[this.props.chartId].get("padding").left = chartInfo.paddingLeft;
            chartObject[this.props.chartId].get("padding").right = chartInfo.paddingRight;
            chartObject[this.props.chartId].axis(0).update(chartInfo.chartDatas);
            chartObject[this.props.chartId].axis(0).set("x", {
                type : "fullblock",
                domain : "label",
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
            chartObject[this.props.chartId].render(true);
        }  
    }

    resizeRender = (width, height) => {
        chartObject[this.props.chartId].setSize(width, height);
        chartObject[this.props.chartId].render(true);
    };

    graphUse = () => {
        graph.use(CustomTheme, BubbleBrush, TooltipWidget);
    };

    graphReady = (idChart, datas, yFormat, paddingLeft, paddingRight, qCnt, maxDomainValue) => {
        this.graphUse();

        graph.ready([ "chart.builder" ], (builder) => {
            chartObject[idChart] = builder(`#${idChart}`, {
                padding :  {
                    top : 32,
                    right : paddingRight,
                    buttom : 15,
                    left : paddingLeft
                },
                theme : "custom",
                axis : {
                    x : {
                        type : "block",
                        domain : "label",
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
                    type : "bubble",
                    min : 0,
                    max : 50,
                    target : "value",
                    scaleKey : "scale",
                    showText : false
                }],
                style: {
                    gridXFontColor: "#8C8C8C",
                    gridYFontColor: "#5C5C5C",
                    gridXFontSize : 13,
                    gridYFontSize : 13,
                    gridXAxisBorderWidth: 1,
                    gridYAxisBorderWidth: 1,
                },
                widget : [{
                    type : "tooltip",
                    orient : "top",
                    format : function(k, v) {
                        return k.label + " : " + new Intl.NumberFormat('ko-KR').format(k[v]);
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

export default BubbleChart;

