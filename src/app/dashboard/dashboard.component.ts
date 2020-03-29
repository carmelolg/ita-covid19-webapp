import { Component, AfterViewInit, OnInit } from '@angular/core';

import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
declare var require: any;

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

	dataLabels = [];

	totalCasesValues = [];
	totalCases: Chart;

	totalHospitalizedValues = [];
	totalHospitalized: Chart;


	totalDeadValues = [];
	totalDead: Chart;


	totalTestsValues = [];
	totalTests: Chart;


	totalIntensiveCareValues = [];
	totalIntensiveCare: Chart;

	ngOnInit() {

		this.createTotalCases();
		this.createTotalDead();
		this.createTotalHospitalized();
		this.createTotalIntensiveCare();
		this.createTotalTests()
	}

	private createTotalCases(){
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					this.dataLabels.push(innerDate);
					this.totalCasesValues.push(item.value);
				});
				this.totalCases = this.createChart(this.totalCasesValues);
			}
		});

	}

	private createTotalHospitalized(){
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/hospitalized").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					// let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					// this.dataLabels.push(innerDate);
					this.totalHospitalizedValues.push(item.value);
				});
			}
			this.totalHospitalized = this.createChart(this.totalHospitalizedValues);
		});


	}


	private createTotalDead(){
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/dead").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					// let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					// this.dataLabels.push(innerDate);
					this.totalDeadValues.push(item.value);
				});
			}
			this.totalDead = this.createChart(this.totalDeadValues);
		});

	}


	private createTotalTests(){
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/test").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					// let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					// this.dataLabels.push(innerDate);
					this.totalTestsValues.push(item.value);
				});
			}
			this.totalTests = this.createChart(this.totalTestsValues);
		});

	}


	private createTotalIntensiveCare(){
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/intensive-care").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					// let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					// this.dataLabels.push(innerDate);
					this.totalIntensiveCareValues.push(item.value);
				});
			}
			this.totalIntensiveCare = this.createChart(this.totalIntensiveCareValues);
		});

	}


	private createChart(values): Chart{
		return  {
			type: 'Line',
			data: {
				labels: this.dataLabels,
				series: [
					{
						data: values
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

}
