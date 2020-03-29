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
	selector: 'app-provincia',
	templateUrl: './provincia.component.html',
	styleUrls: ['./provincia.component.scss']
})
export class ProvinciaComponent implements OnInit, AfterViewInit {
	ngAfterViewInit() { }

	constructor(private http: HttpClient, public datepipe: DatePipe) { }

	districtName = "Torino";
	districtNameInput = "";

	dataLabels = [];

	totalCasesValues = [];
	totalCasesIncreaseValues = [];
	totalCases: Chart;


	ngOnInit() {

		this.createTotalCases();
		
	}

	private createTotalCases(){

		if(this.districtNameInput.length === 0 ){
			this.districtNameInput = this.districtName;
		}

		this.totalCasesValues = [];
		this.totalCasesIncreaseValues = [];
		this.dataLabels = [];
		this.totalCases = null;
		
		this.http.get<any>("https://ita-covid19.herokuapp.com/district/"+this.districtNameInput+"/total").subscribe(data => {
			if (data.results.length > 0) {
				data.results.forEach(item => {
					let innerDate = this.datepipe.transform(item.data, 'dd/MM')
					this.dataLabels.push(innerDate);
					this.totalCasesValues.push(item.value);
					this.totalCasesIncreaseValues.push(item.increaseFromYesterday);
				});
				this.districtName = this.districtNameInput;
				this.totalCases = this.createChart(this.totalCasesValues, this.totalCasesIncreaseValues);
			}else{
				this.districtName = data.description;
				this.totalCases = this.createChart(null, null);
			}
		});

	}

	private createChart(values, totalCasesIncreaseValues): Chart{
		return  {
			type: 'Line',
			data: {
				labels: this.dataLabels,
				series: [
					{
						data: values
					}, {
						data: totalCasesIncreaseValues
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
