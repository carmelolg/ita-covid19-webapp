import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProvinciaComponent } from './provincia.component';
import { ProvinciaRoutes } from './provincia.routing';
import { ChartistModule } from 'ng-chartist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ProvinciaRoutes)
  ],
  providers: [DatePipe],
  declarations: [ProvinciaComponent]
})
export class ProvinciaModule {}
