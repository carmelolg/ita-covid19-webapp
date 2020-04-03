import { Component, AfterViewInit, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Chart } from '../shared/model/Chart';
import { Tile } from '../shared/model/Tiles';
import { ChartService } from './chart.service'

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
	ngAfterViewInit() { }

	constructor(private http: HttpClient, public datepipe: DatePipe, private chartService: ChartService) { }

	dataLabels = [];

	growthRateValues = [];
	growthRateIncreaseValues = [];
	growthRates: Chart;

	totalCasesValues = [];
	totalCasesIncreaseValues = [];
	totalCases: Chart;

	totalNewCaseValues = [];
	totalNewCaseIncreaseValues = [];
	totalNewCases: Chart;

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
	currentRecoveredPercentage = 0;
	currentDeadPercentage = 0;
    currentIntensiveCarePercentage = 0;
    currentHospitalizedPercentage = 0;


	tiles: Tile[] = [];

	ngOnInit() {

		this.eraseAllData();

		this.createGrowthRates();

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
		this.totalNewCases = null;
	}

	// TODO Calcolare i dati correttamente
	private createGrowthRates() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					this.growthRateValues.push(item.value);
					this.growthRateIncreaseValues.push(item.increaseFromYesterday);
				});
				this.growthRates = this.chartService.createChart(this.dataLabels, this.totalCasesValues, this.totalCasesIncreaseValues, 'Bar');
			}
		});
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
				this.totalCases = this.chartService.createChart(this.dataLabels, this.totalCasesValues, this.totalCasesIncreaseValues);

				this.createTotalDead();
				this.createTotalHospitalized();
				this.createTotalIntensiveCare();
				this.createTotalTests();
				this.createTotalRecovered();
				this.createTotalNewCases();
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

	private createTotalNewCases() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/new").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					// let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					// this.dataLabels.push(innerDate);
					this.totalNewCaseValues.push(item.value);
					this.totalNewCaseIncreaseValues.push(item.increaseFromYesterday);
				});
			}
			this.totalNewCases = this.chartService.createChart(this.dataLabels, this.totalNewCaseValues, this.totalNewCaseIncreaseValues);
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
				this.currentGrowthRate = (!!data.currentRateOfGrowth) ? data.currentRateOfGrowth : 0;
				this.currentNewPositiveGrowthRate = (!!data.currentNewPositiveRateOfGrowth) ? data.currentNewPositiveRateOfGrowth : 0;
				this.percentageCasesBasedOnTests = (!!data.currentPositivePercentageBasedOnTests) ? data.currentPositivePercentageBasedOnTests : 0;
				this.currentRecoveredPercentage = (!!data.currentRecoveredPercentage) ? data.currentRecoveredPercentage : 0;
				this.currentDeadPercentage = (!!data.currentDeadPercentage) ? data.currentDeadPercentage : 0;
				this.currentIntensiveCarePercentage = (!!data.currentIntensiveCarePercentage) ? data.currentIntensiveCarePercentage : 0;
				this.currentHospitalizedPercentage = (!!data.currentHospitalizedPercentage) ? data.currentHospitalizedPercentage : 0;

				this.tiles = [
					{ footer: 'Percentuale', header: 'Deceduti', percentage: this.currentDeadPercentage + '%', cols: 2, rows: 2, color: '#b3e0ff' },
					{ footer: 'Percentuale', header: 'Guariti', percentage: this.currentRecoveredPercentage + '%', cols: 2, rows: 2, color: '#b3e0ff' },
					{ footer: 'Percentuale', header: 'Terapia intensiva', percentage: this.currentIntensiveCarePercentage + '%', cols: 2, rows: 2, color: '#99d6ff' },
					{ footer: 'Percentuale', header: 'Positivi per tamponi', percentage: this.percentageCasesBasedOnTests + '%', cols: 2, rows: 2, color: '#99d6ff' },
					{ footer: 'Tasso di crescita', header:'% incr. totale', percentage: this.currentGrowthRate + '%', cols: 2, rows: 2, color: '#b3e0ff' },
					{ footer: 'Tasso di crescita', header: '% incr. nuovi positivi', percentage: this.currentNewPositiveGrowthRate + '%', cols: 2, rows: 2, color: '#b3e0ff' }
				];

			}
		});
	}

}
