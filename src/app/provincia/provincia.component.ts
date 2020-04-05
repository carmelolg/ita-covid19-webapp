import { Component, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Chart } from '../shared/model/Chart';

declare var require: any
require('chartist-plugin-tooltips-updated');
import { ChartService } from '../dashboard/chart.service';
import { Tile } from '../shared/model/Tiles';

@Component({
	selector: 'app-provincia',
	templateUrl: './provincia.component.html',
	styleUrls: ['./provincia.component.scss']
})
export class ProvinciaComponent implements OnInit, AfterViewInit {
	ngAfterViewInit() { }

	constructor(private http: HttpClient, public datepipe: DatePipe, private chartService: ChartService) { }

	districtName = "Torino";
	districtNameInput = "";
	isLoading = false;

	dataLabels = [];

	growthRateDateLabels = [];
	growthRateValues = [];
	growthRateIncreaseValues = [];
	growthRates: Chart;

	totalCasesValues = [];
	totalCasesIncreaseValues = [];
	totalCases: Chart;
	totalCasesIncrease: Chart;

	currentGrowthRate = 0;

	tiles: Tile[] = [];

	ngOnInit() {

		this.eraseAll();

		this.createTotalCases();

		this.getGenericStats();

		this.tiles = null;
	}

	private eraseAll() {
		this.dataLabels = [];
		this.totalCasesValues = [];
		this.totalCasesIncreaseValues = [];
		this.totalCases = null;
		this.totalCasesIncrease = null;

		this.growthRateDateLabels = [];
		this.growthRateValues = [];
		this.growthRateIncreaseValues = [];
		this.growthRates = null;
	}

	private getGrowthRates() {
		this.growthRateValues = [];
		this.growthRateDateLabels = [];

		this.http.get<any>("https://ita-covid19.herokuapp.com/district/" + this.districtNameInput + "/growthRate").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					let innerDate = this.datepipe.transform(item.date, 'dd/MM');
					this.growthRateDateLabels.push(innerDate);
					this.growthRateValues.push(item.value);
				});
				this.growthRates = this.chartService.createChart(this.growthRateDateLabels, 'Bar', this.growthRateValues);
			}else {
				this.districtName = data.description;
				this.growthRates = this.chartService.createChart(this.growthRateDateLabels, 'Line', null);
			}
		});
	}

	public createTotalCases() {

		this.isLoading = true;
		if (this.districtNameInput.length === 0) {
			this.districtNameInput = this.districtName;
		}

		this.eraseAll();

		this.http.get<any>("https://ita-covid19.herokuapp.com/district/" + this.districtNameInput + "/total").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					this.dataLabels.push(innerDate);
					this.totalCasesValues.push(item.value);
					this.totalCasesIncreaseValues.push(item.increaseFromYesterday);
				});
				this.districtName = this.districtNameInput;
				this.totalCases = this.chartService.createChart(this.dataLabels, 'Line', this.totalCasesValues);
				this.totalCasesIncrease = this.chartService.createChart(this.dataLabels, 'Line', this.totalCasesIncreaseValues);
			} else {
				this.districtName = data.description;
				this.totalCases = this.chartService.createChart(this.dataLabels, 'Line', null);
				this.totalCasesIncrease = this.chartService.createChart(this.dataLabels, 'Line', null);
			}

			this.isLoading = false;
		});

		this.getGenericStats();
		this.getGrowthRates();
	}


	private getGenericStats() {
		this.http.get<any>("https://ita-covid19.herokuapp.com/district/" + this.districtNameInput + "/stats").subscribe(data => {
			if (!!data) {
				this.currentGrowthRate = (!!data.currentRateOfGrowth) ? data.currentRateOfGrowth : 0;

				this.tiles = [
					{ footer: 'Tasso di crescita', header: 'Tasso di crescita sul totale', percentage: this.currentGrowthRate + '%', cols: 4, rows: 2, color: '#b3e0ff' }
				];

			}
		}, error => {
			this.tiles = [];
		});
	}
}