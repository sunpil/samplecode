import React from 'react'
import graph from "juijs-graph";
import CustomTheme from "../theme/custom";
import BubbleBrush from "juijs-chart/src/brush/bubble";
import TooltipWidget from "juijs-chart/src/widget/tooltip";
import TitleWidget from "juijs-chart/src/widget/title";
import { getTextSize, getMaxDomainValue } from "../util/svg";

let chartObject = {};

class RangeBubbleChart extends React.Component {

    constructor(props){
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
        let maxXValue = 1;
        let maxYValue = 1;
        let paddingLeft = 25;
        
        for (let i = 0; i < this.props.data.datasets.length; i++) {
            let dataset = this.props.data.datasets[i];
            if (dataset.data[0].x > maxXValue) {
                maxXValue = dataset.data[0].x;
            }
            if (dataset.data[0].y > maxYValue) {
                maxYValue = dataset.data[0].y;
            }
            chartDatas.push(dataset.data[0]);
        };

        if (maxXValue > 0) {
            maxXValue = getMaxDomainValue(maxXValue);
        }

        if (maxYValue > 0) {
            maxYValue = getMaxDomainValue(maxYValue);
            let format = "";
            if (this.props.yFormat) {
                format = this.props.yFormat(maxYValue);
            } else {
                format = new Intl.NumberFormat('ko-KR').format(maxYValue);
            }
            let rect = getTextSize(format, {
                fontSize : 13
            });
            paddingLeft = Math.ceil(rect.width) + 30;
        }

        return ({ 
            chartDatas : chartDatas,
            maxXValue : maxXValue,
            maxYValue : maxYValue,
            paddingLeft : paddingLeft,
            yTitleDx : -(paddingLeft + 20)
        });
    } 

    componentDidMount = () => {
        let chartInfo = this.chartInfo();

        this.graphReady(this.props.chartId, chartInfo.chartDatas, chartInfo.maxXValue, 
                        chartInfo.maxYValue, this.props.yFormat, this.props.tooltipFormat, 
                        chartInfo.paddingLeft, this.props.paddingRight, this.props.xTitle, 
                        this.props.yTitle, chartInfo.yTitleDx);

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
            let yTitle = this.props.yTitle;
            chartObject[this.props.chartId].get("padding").left = chartInfo.paddingLeft;
            chartObject[this.props.chartId].axis(0).update(chartInfo.chartDatas);
            chartObject[this.props.chartId].axis(0).set("x", {
                type : "range",
                domain : [0, chartInfo.maxXValue],
                key : "x",
                line : true
            });
            chartObject[this.props.chartId].axis(0).set("y", {
                type : "range",
                domain : [0, chartInfo.maxYValue],
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
            chartObject[this.props.chartId].updateWidget(2, {
                type : "title",
                text : yTitle.title,
                align : "start",
                orient : "center",
                dx : chartInfo.yTitleDx,
                dy : yTitle.dy
            });
            chartObject[this.props.chartId].render(true);
        }
    }

    resizeRender = (width, height) => {
        chartObject[this.props.chartId].setSize(width, height);
        chartObject[this.props.chartId].render(true);
    };

    graphUse = () => {
        graph.use(CustomTheme, BubbleBrush, TooltipWidget, TitleWidget);
    };

    graphReady = (idChart, datas, maxXValue, maxYValue, yFormat, tooltipFormat, 
                  paddingLeft, paddingRight, xTitle, yTitle, yTitleDx) => {
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
                        type : "range",
                        domain : [0, maxXValue],
                        key : "x",
                        line : true
                    },
                    y : {
                        type : "range",
                        domain : [0, maxYValue],
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
                    target : "y",
                    scaleKey : "r",
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
                        if (tooltipFormat) {
                            return tooltipFormat(k, v);
                        } else {
                            return k.label + " : " + new Intl.NumberFormat('ko-KR').format(k.v);
                        }    
                    }
                }, {
                    type : "title",
                    text : xTitle.title,
                    dy : xTitle.dy
                }, {
                    type : "title",
                    text : yTitle.title,
                    align : "start",
                    orient : "center",
                    dx : yTitleDx,
                    dy : yTitle.dy
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

export default RangeBubbleChart;