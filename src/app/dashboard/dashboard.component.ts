import { Component, AfterViewInit, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Chart } from '../shared/model/Chart';
import {ChartService} from './chart.service'


declare var require: any
require('chartist-plugin-tooltips-updated');
import * as Chartist from 'chartist';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
	ngAfterViewInit() { }

	constructor(private http: HttpClient, public datepipe: DatePipe, private chartService: ChartService) { }

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

	currentGrowthRate = 0;
	currentNewPositiveGrowthRate = 0;
	percentageCasesBasedOnTests = 0;

	ngOnInit() {

		this.eraseAllData();

		this.createTotalCases();

		this.getGenericStats();
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
				this.totalCases = this.chartService.createChart(this.dataLabels,this.totalCasesValues, this.totalCasesIncreaseValues);

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
			this.totalHospitalized = this.chartService.createChart(this.dataLabels, this.totalHospitalizedValues, this.totalHospitalizedIncreaseValues);
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
			this.totalDead = this.chartService.createChart(this.dataLabels, this.totalDeadValues, this.totalDeadIncreaseValues);
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
			this.totalTests = this.chartService.createChart(this.dataLabels, this.totalTestsValues, this.totalTestsIncreaseValues);
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
			this.totalIntensiveCare = this.chartService.createChart(this.dataLabels, this.totalIntensiveCareValues, this.totalIntensiveCareIncreaseValues);
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
			this.totalRecovered = this.chartService.createChart(this.dataLabels, this.totalRecoveredValues, this.totalRecoveredIncreaseValues);
		});

	}
	private getGenericStats() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/stats").subscribe(data => {
			if (!!data) {
				this.currentGrowthRate = data.currentRateOfGrowth;
				this.currentNewPositiveGrowthRate = data.currentNewPositiveRateOfGrowth;
				this.percentageCasesBasedOnTests = data.currentPositivePercentageBasedOnTests; 	
			}
		});
	}

}
