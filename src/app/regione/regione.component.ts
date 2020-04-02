import { Component, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Chart } from '../shared/model/Chart';

declare var require: any
require('chartist-plugin-tooltips-updated');
import { ChartService } from '../dashboard/chart.service';

@Component({
	selector: 'app-regione',
	templateUrl: './regione.component.html',
	styleUrls: ['./regione.component.scss']
})
export class RegioneComponent implements OnInit, AfterViewInit {
	ngAfterViewInit() { }

	constructor(private http: HttpClient, public datepipe: DatePipe, private chartService: ChartService) { }

	regionName = "Lombardia";
	regionNameInput = "";
	isLoading = false;

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
		this.call();
	}

	public call() {

		this.isLoading = true;
		if (this.regionNameInput.length === 0) {
			this.regionNameInput = this.regionName;
		}

		this.eraseAllData();

		this.createTotalCases();
	}

	private createTotalCases() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total").subscribe(data => {

			if (data.results.length > 0) {
				data.results.forEach(item => {
					let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					this.dataLabels.push(innerDate);
					this.totalCasesValues.push(item.value);
					this.totalCasesIncreaseValues.push(item.increaseFromYesterday);
				});
				this.regionName = this.regionNameInput;
				this.totalCases = this.chartService.createChart(this.dataLabels, this.totalCasesValues, this.totalCasesIncreaseValues);
			} else {
				this.regionName = data.description;
				this.totalCases = this.chartService.createChart(this.dataLabels, null);
			}

			this.createTotalDead();
			this.createTotalHospitalized();
			this.createTotalIntensiveCare();
			this.createTotalTests();
			this.createTotalRecovered();
			this.isLoading = false;
		});

	}

	private createTotalHospitalized() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/hospitalized").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					this.totalHospitalizedValues.push(item.value);
					this.totalHospitalizedIncreaseValues.push(item.increaseFromYesterday);
				});
			}
			this.totalHospitalized = this.chartService.createChart(this.dataLabels, this.totalHospitalizedValues, this.totalHospitalizedIncreaseValues);
		});


	}


	private createTotalDead() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/dead").subscribe(data => {
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
		this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/test").subscribe(data => {
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
		this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/intensive-care").subscribe(data => {
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
		this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/recovered").subscribe(data => {
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

	private eraseAllData() {
		this.totalCases = null;
		this.totalDead = null;
		this.totalHospitalized = null;
		this.totalIntensiveCare = null;
		this.totalTests = null;
		this.totalRecovered = null;

		this.dataLabels = [];

		this.totalCasesValues = [];
		this.totalCasesIncreaseValues = [];

		this.totalHospitalizedValues = [];
		this.totalHospitalizedIncreaseValues = [];

		this.totalDeadValues = [];
		this.totalDeadIncreaseValues = [];

		this.totalTestsValues = [];
		this.totalTestsIncreaseValues = [];

		this.totalIntensiveCareValues = [];
		this.totalIntensiveCareIncreaseValues = [];

		this.totalRecoveredValues = [];
		this.totalRecoveredIncreaseValues = [];
	}

}