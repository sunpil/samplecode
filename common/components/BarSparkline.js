import 'script-loader!smartadmin-plugins/bower_components/relayfoods-jquery.sparkline/dist/jquery.sparkline.js'

import React from 'react'
import {findDOMNode} from 'react-dom'


export default class BarSparkline extends React.Component {

  barChart($el) {
    const width = this.props.barWidth;

    let barColor = $el.data('sparkline-bar-color') || $el.css('color') || '#0000f0';
    let sparklineHeight = $el.data('sparkline-height') || '26px';
    let sparklineBarWidth = $el.data('sparkline-barwidth') || 5;
    let sparklineBarSpacing = $el.data('sparkline-barspacing') || 2;
    let sparklineNegBarColor = $el.data('sparkline-negbar-color') || '#A90329';
    let sparklineStackedColor = $el.data('sparkline-barstacked-color') || ["#A90329", "#0099c6", "#98AA56", "#da532c", "#4490B1", "#6E9461", "#990099", "#B4CAD3"];

    $el.sparkline(this.props.values || 'html', {
      barColor: barColor,
      type: 'bar',
      height: sparklineHeight,
      barWidth: width,
      barSpacing: sparklineBarSpacing,
      stackedBarColor: sparklineStackedColor,
      negBarColor: sparklineNegBarColor,
      zeroAxis: 'true',
      tooltipFormat: '시간: {{offset:offset}}, 값: {{value}}',
      tooltipValueLookups: {
        'offset': this.props.time.map((t) => {
            return moment(t.t).format("YYYY년 MM월 DD일 HH시 mm분");
        })
        }
    });
  }

  drawElement(el) {
    const $el = $(el);
    const sparklineType = $el.data('sparkline-type') || 'bar';

    if (sparklineType == 'bar') {
      this.barChart($el)
    }
  }

  drawSparklines() {
    const container = findDOMNode(this);

    if (this.props.values) {
      this.drawElement(container)

    } else {
      const containers = $(container).find('.sparkline:not(:has(>canvas))');
      [].forEach.call(containers, (it)=> {
        this.drawElement(it)
      });
    }
  }

  componentDidUpdate() {
    this.drawSparklines();
  }

  componentDidMount() {
    this.drawSparklines();
  }

  render() {
    const classNames = this.props.className + " sparkline";
    return (
      <div className={classNames}>{this.props.children}</div>
    )
  }
}

export class Sparkline extends BarSparkline {
}