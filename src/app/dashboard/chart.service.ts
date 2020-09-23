import { Injectable } from '@angular/core';

import { Chart } from '../shared/model/Chart';


declare var require: any
require('chartist-plugin-tooltips-updated');
import * as Chartist from 'chartist';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private updateChartModelSubject = new Subject<string>();
  public updateChartModel$ = this.updateChartModelSubject.asObservable();

  constructor() { }

  // Service message commands
  updateChartModel() {
    this.updateChartModelSubject.next();
  }

  public createChart(labels, chartType?, ...values): Chart {

    let _series = [];

    if (values !== null && values !== undefined) {
      values.forEach(function (array) {
        if (array !== null && array !== undefined && array.length > 0) {
          array = array.map(function (v, idx) { return { meta: 'Data: ' + labels[idx], value: v }; });
          _series.push({ data: array });
        }
      });
    }

    return {
      type: chartType || 'Line',
      data: {
        labels: labels,
        series: _series
      },
      options: {
        seriesDistance: 25,
        height: 300,
        plugins: [
          Chartist.plugins.tooltip({
            appendToBody: false,
            className: "ct-tooltip",
            transformTooltipTextFnc: function (value) {
              return value;

            }
          })
        ],
        axisY: {
          labelInterpolationFnc: function (
            value: number
          ): string {
            return Math.abs(value) > 999 ? Math.sign(value) * ((Math.abs(value) / 1000)) + 'k' : (Math.sign(value) * Math.abs(value)).toFixed(1);
          }
        },
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
      ],
      events: {}
    };
  }

  public generateResponsiveOptions(xValueMod: number) {

    return {
      axisY: {
        labelInterpolationFnc: function (
          value: number
        ): string {
          return Math.abs(value) > 999 ? Math.sign(value) * ((Math.abs(value) / 1000)) + 'k' : (Math.sign(value) * Math.abs(value)).toFixed(1);
        }
      },
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
