import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { DemoMaterialModule } from '../demo-material-module';
import { ChartistModule } from 'ng-chartist';



@NgModule({
  declarations: [ChartComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    ChartistModule
  ],
  exports: [ChartComponent]
})
export class ChartModule { }
