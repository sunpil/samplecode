import React from 'react'
import graph from "juijs-graph";
import CustomTheme from "../theme/custom";
import HeatmapBrush from "juijs-chart/src/brush/heatmap";
import TooltipWidget from "juijs-chart/src/widget/tooltip";
import { getTextSize } from "../util/svg";

let chartObject = {};

class HeatMapChart extends React.Component {

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
        let maxXLabelWidth = 0;
        let maxYLabelWidth = 0;
        let paddingLeft = 15;
        let paddingRight = 15;
        let qCnt = 1;

        let totalDatasets = this.props.data.datasets.reduce((totalDatasets, dataset) => {
            totalDatasets = totalDatasets.concat(dataset);
            return totalDatasets;
        }, []); 

        const maxValue = Math.max(...totalDatasets);

        for (let i = 0; i < this.props.data.xLabels.length; i++) {
            let rect = getTextSize(this.props.data.xLabels[i], {
                fontSize : 13
            });
            if (rect.width > maxXLabelWidth) {
                maxXLabelWidth = rect.width;
            }
            for(let j = 0; j < this.props.data.yLabels.length; j++) {
              if (i === 0) {
                  rect = getTextSize(this.props.data.yLabels[j], {
                      fontSize : 13
                  });
                  if (rect.width > maxYLabelWidth) {
                      maxYLabelWidth = rect.width;
                  }
              }
              chartDatas.push({
                  x : i,
                  y : j,
                  value : this.props.data.datasets[j][i],
                  maxValue : maxValue
              })
            }
        }

        if (maxYLabelWidth > 0) {
            paddingLeft = Math.ceil(maxYLabelWidth) + 10;
            paddingLeft = paddingLeft < 50 ? 50 : paddingLeft;
        }

        if (maxXLabelWidth > 0) {
            let chartWidth = $(`#${this.props.chartId}`).width();
            maxXLabelWidth = Math.ceil(maxXLabelWidth);
            let pCnt = Math.floor((chartWidth - paddingLeft - paddingRight) / maxXLabelWidth);
            if (pCnt > 0) {
                qCnt = Math.ceil(this.props.data.xLabels.length / pCnt);
            }
        }

        return ({ 
            chartDatas : chartDatas,
            paddingLeft : paddingLeft,
            paddingRight : paddingRight,
            qCnt : qCnt
        });
    } 

    componentDidMount = () => {
        let chartInfo = this.chartInfo();

        this.graphReady(this.props.chartId, chartInfo.chartDatas, this.props.data.xLabels, 
                        this.props.data.yLabels, chartInfo.paddingLeft, chartInfo.paddingRight, 
                        chartInfo.qCnt);

        if (this.props.onRef) {
            this.props.onRef(this);
        }
    };

    RGBAToHexA = (r, g, b, a) => {
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);
        a = Math.round(a * 255).toString(16);

        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        if (a.length == 1)
            a = "0" + a;

        return "#" + r + g + b + a;
    };

    componentWillUnmount = () => {
        if (this.props.onRef) {
            this.props.onRef(null);
        }  
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        let xLabels = this.props.data.xLabels;
        let yLabels = this.props.data.yLabels;
        let chartInfo = this.chartInfo();

        if (chartObject && chartObject[this.props.chartId]) {
            chartObject[this.props.chartId].get("padding").left = chartInfo.paddingLeft;
            chartObject[this.props.chartId].get("padding").right = chartInfo.paddingRight;
            chartObject[this.props.chartId].axis(0).update(chartInfo.chartDatas);
            chartObject[this.props.chartId].axis(0).set("x", {
                type : "block",
                domain : this.props.data.xLabels,
                format : function(d, cnt) {
                    if (cnt % chartInfo.qCnt === 0) {
                        return d;
                    } else {
                        return " ";
                    }
                },
                line : "solid",
                key : "x"
            });
            chartObject[this.props.chartId].axis(0).set("y", {
                type : "block",
                domain : this.props.data.yLabels,
                line : "solid",
                key : "y"
            });
            chartObject[this.props.chartId].updateWidget(0, {
                type : "tooltip",
                orient : "top",
                format : function(k, v) {
                    return xLabels[k.x] + " " + yLabels[k.y] + " : " + new Intl.NumberFormat('ko-KR').format(k[v]);
                }
            });
            chartObject[this.props.chartId].render(true);
        }  
    };

    resizeRender = (width, height) => {
        chartObject[this.props.chartId].setSize(width, height);
        chartObject[this.props.chartId].render(true);
    };

    graphUse = () => {
        graph.use(CustomTheme, HeatmapBrush, TooltipWidget);
    };

    graphReady = (idChart, datas, xLabels, yLabels, paddingLeft, paddingRight, qCnt) => {
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
                        domain : xLabels,
                        format : function(d, cnt) {
                            if (cnt % qCnt === 0) {
                                return d;
                            } else {
                                return " ";
                            }
                        },
                        line : "solid",
                        key : "x"
                    },
                    y : {
                        type : "block",
                        domain : yLabels,
                        line : "solid",
                        key : "y"
                    },
                    area : {
                        width : "100%",
                        height : "100%"
                    },
                    data : datas
                },
                brush : {
                    type : "heatmap",
                    target : "value",
                    colors : (d) => {
                        let colorsValue = (d.maxValue === 0) ? 0 : Number((d.value / d.maxValue).toFixed(2));
                        return this.RGBAToHexA(72,132,227, colorsValue);
                    },
                    format : function() {
                        return "";
                    }
                },
                style: {
                    gridXFontSize : 13,
                    gridYFontSize : 13,
                    heatmapBorderColor: "#e7e7e7",
                    heatmapHoverBackgroundOpacity: "1",
                    heatmapFontSize : 13
                },
                widget : [{
                    type : "tooltip",
                    orient : "top",
                    format : function(k, v) {
                        return xLabels[k.x] + " " + yLabels[k.y] + " : " + new Intl.NumberFormat('ko-KR').format(k[v]);
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

export default HeatMapChart;
