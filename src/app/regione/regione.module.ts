import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RegioneComponent } from './regione.component';
import { ChartistModule } from 'ng-chartist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegioneRoutes } from './regione.routing';
import { ChartModule } from '../charts/chart.module';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(RegioneRoutes)
  ],
  providers: [DatePipe],
  declarations: [RegioneComponent]
})
export class RegioneModule {}
