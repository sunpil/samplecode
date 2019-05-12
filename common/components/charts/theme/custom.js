export default {
    name: "chart.theme.custom",
    extend: null,
    component: function () {
        var themeColors = [
            "#4B8BF2",
            "#62CDBF",
            "#DB6C8B",
            "#F0C967",
            "#DD8443",
            "#9C3F8C",
            "#429387",
            "#2852B0",
            "#4D0A87",
            "#845932",
            "#7977C2",
            "#7BBAE7",
            "#FFC000",
            "#FF7800",
            "#87BB66",
            "#1DA8A0",
            "#929292",
            "#555D69",
            "#0298D5",
            "#FA5559",
            "#F5A397",
            "#06D9B6",
            "#C6A9D9",
            "#6E6AFC",
            "#E3E766",
            "#C57BC3",
            "#DF328B",
            "#96D7EB",
            "#839CB5",
            "#9228E4"
        ];

        return {
            fontFamily : "arial,Tahoma,verdana",
            backgroundColor : "#fff",
            colors : themeColors,

            // Axis styles
            axisBackgroundColor : "#fff",
            axisBackgroundOpacity : 0,
            axisBorderColor : "#fff",
            axisBorderWidth : 0,
            axisBorderRadius : 0,

            // Grid styles
            gridXFontSize : 11,
            gridYFontSize : 11,
            gridZFontSize : 10,
            gridCFontSize : 11,
            gridXFontColor : "#333",
            gridYFontColor : "#333",
            gridZFontColor : "#333",
            gridCFontColor : "#333",
            gridXFontWeight : "normal",
            gridYFontWeight : "normal",
            gridZFontWeight : "normal",
            gridCFontWeight : "normal",
            gridXAxisBorderColor : "#bfbfbf",
            gridYAxisBorderColor : "#bfbfbf",
            gridZAxisBorderColor : "#bfbfbf",
            gridXAxisBorderWidth : 2,
            gridYAxisBorderWidth : 2,
            gridZAxisBorderWidth : 2,

            // Full 3D 전용 테마
            gridFaceBackgroundColor: "#dcdcdc",
            gridFaceBackgroundOpacity: 0.3,

            gridActiveFontColor : "#ff7800",
            gridActiveBorderColor : "#ff7800",
            gridActiveBorderWidth : 1,
            gridPatternColor : "#ababab",
            gridPatternOpacity : 0.1,
            gridBorderColor : "#ebebeb",
            gridBorderWidth : 1,
            gridBorderDashArray : "none",
            gridBorderOpacity : 1,
            gridTickBorderSize : 3,
            gridTickBorderWidth : 1.5,
            gridTickPadding : 5,

            // Brush styles
            tooltipPointRadius : 5, // common
            tooltipPointBorderWidth : 1, // common
            tooltipPointFontWeight : "bold", // common
            tooltipPointFontSize : 11,
            tooltipPointFontColor : "#333",
            barFontSize : 11,
            barFontColor : "#333",
            barBorderColor : "none",
            barBorderWidth : 0,
            barBorderOpacity : 0,
            barBorderRadius : 3,
            barPointBorderColor : "#fff",
            barDisableBackgroundOpacity : 0.4,
            barStackEdgeBorderWidth : 1,
            gaugeBackgroundColor : "#ececec",
            gaugeArrowColor : "#a9a9a9",
            gaugeFontColor : "#666666",
            gaugeFontSize : 20,
            gaugeFontWeight : "bold",
            gaugeTitleFontSize : 12,
            gaugeTitleFontWeight : "normal",
            gaugeTitleFontColor : "#333",
            gaugePaddingAngle : 2,
            bargaugeBackgroundColor : "#ececec",
            bargaugeFontSize : 11,
            bargaugeFontColor : "#333333",
            pieBorderColor : "#ececec",
            pieBorderWidth : 1,
            pieOuterFontSize : 11,
            pieOuterFontColor : "#333",
            pieOuterLineColor : "#a9a9a9",
            pieOuterLineSize : 8,
            pieOuterLineRate : 1.3,
            pieOuterLineWidth : 0.7,
            pieInnerFontSize : 11,
            pieInnerFontColor : "#333",
            pieActiveDistance : 5,
            pieNoDataBackgroundColor : "#E9E9E9",
            pieTotalValueFontSize : 36,
            pieTotalValueFontColor : "#dcdcdc",
            pieTotalValueFontWeight : "bold",
            pieDisableBackgroundOpacity: 0.5,
            areaBackgroundOpacity : 0.5,
            areaSplitBackgroundColor : "#929292",
            bubbleBackgroundOpacity : 0.5,
            bubbleBorderWidth : 1,
            bubbleFontSize : 12,
            bubbleFontColor : "#fff",
            candlestickBorderColor : "#000",
            candlestickBackgroundColor : "#fff",
            candlestickInvertBorderColor : "#ff0000",
            candlestickInvertBackgroundColor : "#ff0000",
            ohlcBorderColor : "#000",
            ohlcInvertBorderColor : "#ff0000",
            ohlcBorderRadius : 5,
            lineBorderWidth : 2,
            lineBorderDashArray : "none",
            lineBorderOpacity : 1,
            lineDisableBorderOpacity : 0.3,
            linePointBorderColor : "#fff",
            lineSplitBorderColor : null,
            lineSplitBorderOpacity : 0.5,
            pathBackgroundOpacity : 0.5,
            pathBorderWidth : 1,
            scatterBorderColor : "#fff",
            scatterBorderWidth : 1,
            scatterHoverColor : "#fff",
            waterfallBackgroundColor : "#87BB66",
            waterfallInvertBackgroundColor : "#FF7800",
            waterfallEdgeBackgroundColor : "#7BBAE7",
            waterfallLineColor : "#a9a9a9",
            waterfallLineDashArray : "0.9",
            focusBorderColor : "#FF7800",
            focusBorderWidth : 1,
            focusBackgroundColor : "#FF7800",
            focusBackgroundOpacity : 0.1,
            pinFontColor : "#FF7800",
            pinFontSize : 10,
            pinBorderColor : "#FF7800",
            pinBorderWidth : 0.7,
            topologyNodeRadius : 12.5,
            topologyNodeFontSize : 14,
            topologyNodeFontColor : "#fff",
            topologyNodeTitleFontSize : 11,
            topologyNodeTitleFontColor : "#333",
            topologyEdgeWidth : 1,
            topologyActiveEdgeWidth : 2,
            topologyHoverEdgeWidth : 2,
            topologyEdgeColor : "#b2b2b2",
            topologyActiveEdgeColor : "#905ed1",
            topologyHoverEdgeColor : "#d3bdeb",
            topologyEdgeFontSize : 10,
            topologyEdgeFontColor : "#666",
            topologyEdgePointRadius : 3,
            topologyEdgeOpacity : 1,
            topologyTooltipBackgroundColor : "#fff",
            topologyTooltipBorderColor : "#ccc",
            topologyTooltipFontSize : 11,
            topologyTooltipFontColor : "#333",

            timelineTitleFontSize: 10,
            timelineTitleFontColor: "#333",
            timelineTitleFontWeight: 700,
            timelineColumnFontSize: 10,
            timelineColumnFontColor: "#333",
            timelineColumnBackgroundColor: "#fff",
            timelineHoverRowBackgroundColor: "#f4f0f9",
            timelineEvenRowBackgroundColor: "#f8f8f8",
            timelineOddRowBackgroundColor: "#fff",
            timelineActiveBarBackgroundColor: "#9262cf",
            timelineActiveBarFontColor: "#fff",
            timelineActiveBarFontSize: 9,
            timelineHoverBarBackgroundColor: null,
            timelineLayerBackgroundOpacity: 0.15,
            timelineActiveLayerBackgroundColor: "#A75CFF",
            timelineActiveLayerBorderColor: "#caa4f5",
            timelineHoverLayerBackgroundColor: "#DEC2FF",
            timelineHoverLayerBorderColor: "#caa4f5",
            timelineVerticalLineColor: "#f0f0f0",
            timelineHorizontalLineColor: "#ddd",

            // hudColumnGridPointRadius: 7,
            // hudColumnGridPointBorderColor: "#868686",
            // hudColumnGridPointBorderWidth: 2,
            // hudColumnGridFontColor: "#868686",
            // hudColumnGridFontSize: 12,
            // hudColumnGridFontWeight: "normal",
            // hudColumnLeftBackgroundColor: "#3C3C3C",
            // hudColumnRightBackgroundColor: "#838383",
            // hudBarGridFontColor: "#868686",
            // hudBarGridFontSize: 16,
            // hudBarGridLineColor: "#868686",
            // hudBarGridLineWidth: 1,
            // hudBarGridLineOpacity: 0.8,
            // hudBarGridBackgroundColor: "#868686",
            // hudBarGridBackgroundOpacity: 0.5,
            // hudBarTextLineColor: "#B2A6A6",
            // hudBarTextLineWidth: 1.5,
            // hudBarTextLinePadding: 12,
            // hudBarTextLineFontColor: "#868686",
            // hudBarTextLineFontSize: 13,
            // hudBarBackgroundOpacity: 0.6,
            // hudBarTopBackgroundColor: "#bbb",
            // hudBarBottomBackgroundColor: "#3C3C3C",

            heatmapBackgroundColor: "#fff",
            heatmapBackgroundOpacity: 1,
            heatmapHoverBackgroundOpacity: 0.2,
            heatmapBorderColor: "#000",
            heatmapBorderWidth: 0.5,
            heatmapBorderOpacity: 1,
            heatmapFontSize: 11,
            heatmapFontColor: "#000",

            pyramidLineColor: "#fff",
            pyramidLineWidth: 1,
            pyramidTextLineColor: "#a9a9a9",
            pyramidTextLineWidth: 1,
            pyramidTextLineSize: 30,
            pyramidTextFontSize: 10,
            pyramidTextFontColor: "#333",

            heatmapscatterBorderWidth: 0.5,
            heatmapscatterBorderColor: "#fff",
            heatmapscatterActiveBackgroundColor: "#fff",

            treemapNodeBorderWidth: 0.5,
            treemapNodeBorderColor: "#333",
            treemapTextFontSize: 11,
            treemapTextFontColor: "#333",
            treemapTitleFontSize: 12,
            treemapTitleFontColor: "#333",

            arcEqualizerBorderColor: "#fff",
            arcEqualizerBorderWidth: 1,
            arcEqualizerFontSize: 13,
            arcEqualizerFontColor: "#333",
            arcEqualizerBackgroundColor: "#a9a9a9",

            flameNodeBorderWidth: 0.5,
            flameNodeBorderColor: "#fff",
            flameDisableBackgroundOpacity: 0.4,
            flameTextFontSize: 11,
            flameTextFontColor: "#333",

            selectBoxBackgroundColor: "#666",
            selectBoxBackgroundOpacity: 0.1,
            selectBoxBorderColor: "#666",
            selectBoxBorderOpacity: 0.2,

            // Widget styles
            titleFontColor : "#333",
            titleFontSize : 13,
            titleFontWeight : "normal",
            legendFontColor : "#333",
            legendFontSize : 12,
            legendSwitchCircleColor : "#fff",
            legendSwitchDisableColor : "#c8c8c8",
            tooltipFontColor : "#333",
            tooltipFontSize : 12,
            tooltipBackgroundColor : "#fff",
            tooltipBackgroundOpacity : 0.7,
            tooltipBorderColor : null,
            tooltipBorderWidth : 2,
            tooltipLineColor : null,
            tooltipLineWidth : 0.7,
            scrollBackgroundSize : 7,
            scrollBackgroundColor : "#dcdcdc",
            scrollThumbBackgroundColor : "#b2b2b2",
            scrollThumbBorderColor : "#9f9fa4",
            zoomBackgroundColor : "#ff0000",
            zoomFocusColor : "#808080",
            zoomScrollBackgroundSize : 45,
            zoomScrollButtonSize : 18,
            zoomScrollAreaBackgroundColor : "#fff",
            zoomScrollAreaBackgroundOpacity : 0.7,
            zoomScrollAreaBorderColor : "#d4d4d4",
            zoomScrollAreaBorderWidth : 1,
            zoomScrollAreaBorderRadius : 3,
            zoomScrollGridFontSize : 10,
            zoomScrollGridTickPadding : 4,
            zoomScrollBrushAreaBackgroundOpacity : 0.7,
            zoomScrollBrushLineBorderWidth : 1,
            crossBorderColor : "#a9a9a9",
            crossBorderWidth : 1,
            crossBorderOpacity : 0.8,
            crossBalloonFontSize : 11,
            crossBalloonFontColor : "#fff",
            crossBalloonBackgroundColor : "#000",
            crossBalloonBackgroundOpacity : 0.5,
            dragSelectBackgroundColor : "#7BBAE7",
            dragSelectBackgroundOpacity : 0.3,
            dragSelectBorderColor : "#7BBAE7",
            dragSelectBorderWidth : 1,

            guidelineBorderColor : "#a9a9a9",
            guidelineBorderWidth : 1,
            guidelineBorderOpacity : 0.8,
            guidelineBalloonFontSize : 11,
            guidelineBalloonFontColor : "#fff",
            guidelineBalloonBackgroundColor : "#000",
            guidelineBalloonBackgroundOpacity : 0.5,
            guidelineBorderDashArray : "2,2",
            guidelinePointRadius : 3,
            guidelinePointBorderColor : "#fff",
            guidelinePointBorderWidth : 1,
            guidelineTooltipFontColor : "#333",
            guidelineTooltipFontSize : 12,
            guidelineTooltipPointRadius : 3,
            guidelineTooltipBackgroundColor : "#fff",
            guidelineTooltipBackgroundOpacity : 0.7,
            guidelineTooltipBorderColor : "#a9a9a9",
            guidelineTooltipBorderWidth : 1,

            // mapPathBackgroundColor : "#67B7DC",
            // mapPathBackgroundOpacity : 1,
            // mapPathBorderColor : "#fff",
            // mapPathBorderWidth : 1,
            // mapPathBorderOpacity : 1,
            // mapBubbleBackgroundOpacity : 0.5,
            // mapBubbleBorderWidth : 1,
            // mapBubbleFontSize : 11,
            // mapBubbleFontColor : "#fff",
            // mapSelectorHoverColor : "#5a73db",
            // mapSelectorActiveColor : "#CC0000",
            // mapFlightRouteAirportSmallColor : "#CC0000",
            // mapFlightRouteAirportLargeColor : "#000",
            // mapFlightRouteAirportBorderWidth : 2,
            // mapFlightRouteAirportRadius : 8,
            // mapFlightRouteLineColor : "#ff0000",
            // mapFlightRouteLineWidth : 1,
            // mapWeatherBackgroundColor : "#fff",
            // mapWeatherBorderColor : "#a9a9a9",
            // mapWeatherFontSize : 11,
            // mapWeatherTitleFontColor : "#666",
            // mapWeatherInfoFontColor : "#ff0000",
            // mapCompareBubbleMaxLineColor : "#fff",
            // mapCompareBubbleMaxLineDashArray : "2,2",
            // mapCompareBubbleMaxBorderColor : "#fff",
            // mapCompareBubbleMaxFontSize : 36,
            // mapCompareBubbleMaxFontColor : "#fff",
            // mapCompareBubbleMinBorderColor : "#ffff00",
            // mapCompareBubbleMinFontSize : 24,
            // mapCompareBubbleMinFontColor : "#000",
            // mapControlButtonColor : "#3994e2",
            // mapControlLeftButtonImage : "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI9poMcdXpOKTujw0pGjAgA7",
            // mapControlRightButtonImage : "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI8JycvonomSKhksxBqbAgA7",
            // mapControlTopButtonImage : "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI+pCmvd2IkzUYqw27yfAgA7",
            // mapControlBottomButtonImage : "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI+pyw37TDxTUhhq0q2fAgA7",
            // mapControlHomeButtonImage : "data:image/gif;base64,R0lGODlhCwALAPABAAAAAAAAACH5BAUAAAEALAAAAAALAAsAAAIZjI8ZoAffIERzMVMxm+9KvIBh6Imb2aVMAQA7",
            // mapControlUpButtonImage : "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAISjI8ZoMhtHpQH2HsV1TD29SkFADs=",
            // mapControlDownButtonImage : "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIMjI+py+0BopSv2qsKADs=",
            // mapControlScrollColor : "#000",
            // mapControlScrollLineColor : "#fff",
            // mapMinimapBackgroundColor : "transparent",
            // mapMinimapBorderColor : "transparent",
            // mapMinimapBorderWidth : 1,
            // mapMinimapPathBackgroundColor : "#67B7DC",
            // mapMinimapPathBackgroundOpacity : 0.5,
            // mapMinimapPathBorderColor : "#67B7DC",
            // mapMinimapPathBorderWidth : 0.5,
            // mapMinimapPathBorderOpacity : 0.1,
            // mapMinimapDragBackgroundColor : "#7CC7C3",
            // mapMinimapDragBackgroundOpacity : 0.3,
            // mapMinimapDragBorderColor : "#56B4AF",
            // mapMinimapDragBorderWidth : 1,

            // Polygon Brushes
            polygonColumnBackgroundOpacity: 0.6,
            polygonColumnBorderOpacity: 0.5,
            polygonScatterRadialOpacity: 0.7,
            polygonScatterBackgroundOpacity: 0.8,
            polygonLineBackgroundOpacity: 0.6,
            polygonLineBorderOpacity: 0.7,

            // Animation Brushes
            bubbleCloudFontColor: "#fff",
            bubbleCloudFontSize: 11,
            bubbleCloudFontWeight: "bold"
        }
    }
}