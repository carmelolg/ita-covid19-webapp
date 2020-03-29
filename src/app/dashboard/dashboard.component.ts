import { Component, AfterViewInit, OnInit } from '@angular/core';

import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
declare var require: any;

const data: any = require('./data.json');

export interface Chart {
	type: ChartType;
	data: Chartist.IChartistData;
	options?: any;
	responsiveOptions?: any;
	events?: ChartEvent;
}

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
	ngAfterViewInit() { }

	constructor(private http: HttpClient, public datepipe: DatePipe) { }

	cityLabels = [];
	cityValues = [];
	barChart1: Chart;
	ngOnInit() {

		this.http.get<any>("https://ita-covid19.herokuapp.com/provincia/Torino/stats").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					this.cityLabels.push(innerDate);
					this.cityValues.push(item.value);
				});
			}
		});

		// Barchart
		this.barChart1 = {
			type: 'Line',
			data: {
				labels: this.cityLabels,
				series: [
					{
						data: this.cityValues
					}
				]
			},
			responsiveOptions: [
				[
					'screen and (min-width: 640px)',
					{
						axisX: {
							labelInterpolationFnc: function (
								value: number,
								index: number
							): string {
								return index % 1 === 0 ? `${value}` : null;
							}
						}
					}
				]
			]
		};

	}



	// This is for the donute chart
	donuteChart1: Chart = {
		type: 'Pie',
		data: data['Pie'],
		options: {
			donut: true,
			height: 260,
			showLabel: false,
			donutWidth: 20
		}
	};
}
