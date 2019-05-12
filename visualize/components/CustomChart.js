import React, { Component } from 'react';
import Chart from 'chart.js'
export default class CustomChart extends Component {
	static defaultProps = {
		legend: true,
		legend_position: "right",
		stack: false,
		xAxesDisplay: true,
		yAxesDisplay: true,
		yAxesPosition: "left"
	}
	state = {
		chart: null
	}
	componentDidMount() {
		this.renderChart(this.props.data,
			this.props.type,
			this.props.stack,
			this.props.legend,
			this.props.legend_position,
			this.props.xAxesDisplay,
			this.props.yAxesDisplay,
			this.props.yAxesPosition)
	}
	componentDidUpdate() {
		this.UpdateChart(this.state.data,this.state.chart)
	}
	renderChart = (data, type, stack, legend, legend_position, xAxesDisplay, yAxesDisplay, yAxesPosition) => {
		const ctx = this.refs._custom
		let config ={}
		if(type!=='pie' && type!=='doughnut'){
			config = {
				type: type, // bar, HorizontalBar
				data: data, // ChartData
				options: {
					title: {
						display: false,
						text: ''
					},
					legend: {
						display: legend, // true or false
						position: legend_position, // top,bottom, ....
						fullWidth: false
					},
					tooltips: {
						mode: 'index',
						intersect: false
					},
					responsive: true,
					scales :{
						xAxes: [{
							stacked: stack, 	// true => stackedBar , false => grouped Bar
							display: xAxesDisplay // true or false
						}],
						yAxes: [{
							stacked: stack, // true => stackedBar , false => grouped Bar
							display: yAxesDisplay, // true or false
							position: yAxesPosition // y축 위치 (left or Right)
						}]
					
				}
			}
			}
		}
		else {
			config ={
				type: type, // bar, HorizontalBar
				data: data, // ChartData
				options: {
					title: {
						display: false,
						text: ''
					},
					legend: {
						display: legend, // true or false
						position: legend_position, // top,bottom, ....
						fullWidth: false
					},
					tooltips: {
						mode: 'index',
						intersect: false
					},
					responsive: true
			}
			}
		}
		const myBar = new Chart(ctx, config);
		this.setState({
			chart: myBar
		})
	}
	UpdateChart = (data,chart) => {
		let newChart = chart;
		newChart.data = data;
		newChart.update();
	}
	static getDerivedStateFromProps(nextProps) {
		return {
			data: nextProps.data
		}
	}
	render() {
		return (
			<canvas width={this.props.width} height={this.props.height} ref="_custom" style={this.props.style}></canvas>
		);
	}
}


