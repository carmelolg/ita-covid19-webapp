import { Component, AfterViewInit, OnInit } from '@angular/core';

import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import ctPointLabels from 'chartist-plugin-pointlabels';
import { Chart } from '../shared/model/Chart';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
	ngAfterViewInit() { }

	constructor(private http: HttpClient, public datepipe: DatePipe) { }

	dataLabels = [];

	totalCasesValues = [];
	totalCasesIncreaseValues = [];
	totalCases: Chart;

	totalHospitalizedValues = [];
	totalHospitalizedIncreaseValues = [];
	totalHospitalized: Chart;


	totalDeadValues = [];
	totalDeadIncreaseValues = [];
	totalDead: Chart;


	totalTestsValues = [];
	totalTestsIncreaseValues = [];
	totalTests: Chart;


	totalIntensiveCareValues = [];
	totalIntensiveCareIncreaseValues = [];
	totalIntensiveCare: Chart;


	totalRecoveredValues = [];
	totalRecoveredIncreaseValues = [];
	totalRecovered: Chart;

	ngOnInit() {

		this.eraseAllData();

		this.createTotalCases();
	}

	private eraseAllData() {
		this.totalCases = null;
		this.totalDead = null;
		this.totalHospitalized = null;
		this.totalIntensiveCare = null;
		this.totalTests = null;
		this.totalRecovered = null;
	}

	private createTotalCases() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					this.dataLabels.push(innerDate);
					this.totalCasesValues.push(item.value);
					this.totalCasesIncreaseValues.push(item.increaseFromYesterday);
				});
				this.totalCases = this.createChart(this.totalCasesValues, this.totalCasesIncreaseValues);

				this.createTotalDead();
				this.createTotalHospitalized();
				this.createTotalIntensiveCare();
				this.createTotalTests();
				this.createTotalRecovered();
			}
		});

	}

	private createTotalHospitalized() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/hospitalized").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					// let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					// this.dataLabels.push(innerDate);
					this.totalHospitalizedValues.push(item.value);
					this.totalHospitalizedIncreaseValues.push(item.increaseFromYesterday);
				});
			}
			this.totalHospitalized = this.createChart(this.totalHospitalizedValues, this.totalHospitalizedIncreaseValues);
		});


	}


	private createTotalDead() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/dead").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					// let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					// this.dataLabels.push(innerDate);
					this.totalDeadValues.push(item.value);
					this.totalDeadIncreaseValues.push(item.increaseFromYesterday);
				});
			}
			this.totalDead = this.createChart(this.totalDeadValues, this.totalDeadIncreaseValues);
		});

	}


	private createTotalTests() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/test").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					// let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					// this.dataLabels.push(innerDate);
					this.totalTestsValues.push(item.value);
					this.totalTestsIncreaseValues.push(item.increaseFromYesterday);
				});
			}
			this.totalTests = this.createChart(this.totalTestsValues, this.totalTestsIncreaseValues);
		});

	}


	private createTotalIntensiveCare() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/intensive-care").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					// let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					// this.dataLabels.push(innerDate);
					this.totalIntensiveCareValues.push(item.value);
					this.totalIntensiveCareIncreaseValues.push(item.increaseFromYesterday);
				});
			}
			this.totalIntensiveCare = this.createChart(this.totalIntensiveCareValues, this.totalIntensiveCareIncreaseValues);
		});

	}

	private createTotalRecovered() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/recovered").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					// let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					// this.dataLabels.push(innerDate);
					this.totalRecoveredValues.push(item.value);
					this.totalRecoveredIncreaseValues.push(item.increaseFromYesterday);
				});
			}
			this.totalRecovered = this.createChart(this.totalRecoveredValues, this.totalRecoveredIncreaseValues);
		});

	}

	private createChart(values, increaseValue?): Chart {
		return {
			type: 'Line',
			data: {
				labels: this.dataLabels,
				series: [{
					data: values
				},
				{
					data: increaseValue
				}]
			},
			options: {
				seriesDistance: 25,
				height: 300,
				plugins: [
					// tooltip({appendToBody: false, anchorToPoint: true}),
					// ctPointLabels({
					// 	textAnchor: 'middle',
					// 	labelInterpolationFnc: function (value) { return (value) ? value : 0 }
					// })
				]
			},
			responsiveOptions: [
				[
					'screen and (max-width: 360px)',
					this.generateResponsiveOptions(10)
				],
				[
					'screen and (min-width: 361px) and (max-width: 490px)',
					this.generateResponsiveOptions(6)
				],
				[
					'screen and (min-width: 491px) and (max-width: 570px)',
					this.generateResponsiveOptions(5)
				],
				[
					'screen and (min-width: 570px) and (max-width: 1024px)',
					this.generateResponsiveOptions(3)
				],
				[
					'screen and (min-width: 1025px) and (max-width: 1550px)',
					this.generateResponsiveOptions(2)
				],
				[
					'screen and (max-height: 600px)',
					{
						height: 200
					}
				]
			]
		};
	}

	private generateResponsiveOptions(xValueMod: number) {
		return {
			axisX: {
				labelInterpolationFnc: function (
					value: number,
					index: number
				): string {
					return index % xValueMod === 0 ? `${value}` : null;
				}
			}
		}
	}

}
