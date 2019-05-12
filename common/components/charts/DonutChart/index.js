import React from 'react'
import graph from "juijs-graph";
import CustomPieTheme from "../theme/customPie";
import DonutBrush from "juijs-chart/src/brush/donut";
import LegendWidget from "juijs-chart/src/widget/legend";
import TooltipWidget from "juijs-chart/src/widget/tooltip";
import { getTextSize } from "../util/svg";

let chartObject = {};

class DonutChart extends React.Component {

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
        let chartDatas = {};
        let maxLegendWidth = 0;
        let paddingLeft = 15;
        let paddingRight = 15;

        for (let i = 0; i < this.props.data.labels.length; i++) {
            let label = this.props.data.labels[i];
            chartDatas[label] = this.props.data.datasets[0].data[i];
            let rect = getTextSize(label, {
                fontSize : 12
            });
            if (rect.width > maxLegendWidth) {
                maxLegendWidth = rect.width;
            }
        }

        if (this.props.legend) {
            if (maxLegendWidth > 0) {
                paddingRight = Math.ceil(maxLegendWidth) + 40;
            }
        }

        return ({ 
            chartDatas : chartDatas,
            paddingLeft : paddingLeft,
            paddingRight : paddingRight
        });
    } 

    componentDidMount = () => {
        let chartInfo = this.chartInfo();

        this.graphReady(this.props.chartId, chartInfo.chartDatas, this.props.legend,
                        chartInfo.paddingLeft, chartInfo.paddingRight);

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
            chartObject[this.props.chartId].get("padding").left = chartInfo.paddingLeft;
            chartObject[this.props.chartId].get("padding").right = chartInfo.paddingRight;
            chartObject[this.props.chartId].axis(0).update(chartInfo.chartDatas);
            chartObject[this.props.chartId].render(true);
        }  
    }

    resizeRender = (width, height) => {
        chartObject[this.props.chartId].setSize(width, height);
        chartObject[this.props.chartId].render(true);
    };

    graphUse = () => {
        graph.use(CustomPieTheme, DonutBrush, LegendWidget, TooltipWidget);
    };

    graphReady = (idChart, datas, legend, paddingLeft, paddingRight) => {
        this.graphUse();

        graph.ready([ "chart.builder" ], (builder) => {
            chartObject[idChart] = builder(`#${idChart}`, {
                padding :  {
                    top : 32,
                    right : paddingRight,
                    bottom : 25,
                    left : paddingLeft
                },
                theme : "customPie",
                axis : {
                    data: [datas],
                },
                brush : {
                    type : "donut",
                    size : 100
                },
                style : {
                    pieInnerFontColor: "#ffffff"
                },
                widget : [{
                    type : "tooltip",
                    orient : "top",
                    format : function(d, k) {
                        return k + " : " + new Intl.NumberFormat('ko-KR').format(d[k]);
                    }
                }, {
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

export default DonutChart;
