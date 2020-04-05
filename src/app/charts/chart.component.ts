import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { InfoChart } from '../shared/model/InfoChart';
import { ChartService } from '../dashboard/chart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chart: any;
  @Input() info: InfoChart;
  @Input() chartConfig: any;

  subscription: Subscription;

  constructor(
    private chartService: ChartService
  ) { }

  ngOnInit(): void {

    this.subscription = this.chartService.updateChartModel$.subscribe(
      data => {
        if (this.chart) {
          this.chart.chart.container.__chartist__.update();
        }
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
