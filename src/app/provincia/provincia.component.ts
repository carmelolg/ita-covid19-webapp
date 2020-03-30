import { Component, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';

import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import ctPointLabels from 'chartist-plugin-pointlabels';
import { Chart } from '../shared/model/Chart';


@Component({
	selector: 'app-provincia',
	templateUrl: './provincia.component.html',
	styleUrls: ['./provincia.component.scss']
})
export class ProvinciaComponent implements OnInit, AfterViewInit {
	ngAfterViewInit() { }

	constructor(private http: HttpClient, public datepipe: DatePipe) { }

	districtName = "Torino";
	districtNameInput = "";
	isLoading = false;

	dataLabels = [];

	totalCasesValues = [];
	totalCasesIncreaseValues = [];
	totalCases: Chart;
	totalCasesIncrease: Chart;


	ngOnInit() {

		this.createTotalCases();

	}

	public createTotalCases() {

		this.isLoading = true;
		if (this.districtNameInput.length === 0) {
			this.districtNameInput = this.districtName;
		}

		this.totalCasesValues = [];
		this.totalCasesIncreaseValues = [];
		this.dataLabels = [];
		this.totalCases = null;
		this.totalCasesIncrease = null;

		this.http.get<any>("https://ita-covid19.herokuapp.com/district/" + this.districtNameInput + "/total").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					this.dataLabels.push(innerDate);
					this.totalCasesValues.push(item.value);
					this.totalCasesIncreaseValues.push(item.increaseFromYesterday);
				});
				this.districtName = this.districtNameInput;
				this.totalCases = this.createChart(this.totalCasesValues);
				this.totalCasesIncrease = this.createChart(this.totalCasesIncreaseValues);
			} else {
				this.districtName = data.description;
				this.totalCases = this.createChart(null);
				this.totalCasesIncrease = this.createChart(null);
			}

			this.isLoading = false;
		});

	}

	private createChart(values): Chart {

		return {
			type: 'Line',
			data: {
				labels: this.dataLabels,
				series: [
					{
						data: values
					}
				]
			},

			options: {
				height: '280px',
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
					'screen and (max-width: 400px)',
					{
						axisX: {
							labelInterpolationFnc: function (
								value: number,
								index: number
							): string {
								return index % 10 === 0 ? `${value}` : null;
							}
						}
					}
				],
				[
					'screen and (min-width: 401px) and (max-width: 640px)',
					{
						axisX: {
							labelInterpolationFnc: function (
								value: number,
								index: number
							): string {
								return index % 6 === 0 ? `${value}` : null;
							}
						}
					}
				],
				[
					'screen and (min-width: 641px) and (max-width: 990px)',
					{
						axisX: {
							labelInterpolationFnc: function (
								value: number,
								index: number
							): string {
								return index % 5 === 0 ? `${value}` : null;
							}
						}
					}
				],
				[
					'screen and (min-width: 991px) and (max-width: 1550px)',
					{
						axisX: {
							labelInterpolationFnc: function (
								value: number,
								index: number
							): string {
								return index % 3 === 0 ? `${value}` : null;
							}
						}
					}
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

}