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

	dataLabels = [];

	totalCasesValues = [];
	totalCases: Chart;


	ngOnInit() {

		this.createTotalCases();
		
	}

	private createTotalCases(){
		this.totalCasesValues = [];
		this.dataLabels = [];
		
		this.http.get<any>("https://ita-covid19.herokuapp.com/provincia/"+this.districtName+"/stats").subscribe(data => {
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
