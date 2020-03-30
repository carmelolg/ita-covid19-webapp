import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RegioneComponent } from './regione.component';
import { ProvinciaRoutes } from './regione.routing';
import { ChartistModule } from 'ng-chartist';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    FormsModule,
    RouterModule.forChild(ProvinciaRoutes)
  ],
  providers: [DatePipe],
  declarations: [RegioneComponent]
})
export class RegioneModule {}
