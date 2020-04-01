import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RegioneComponent } from './regione.component';
import { ChartistModule } from 'ng-chartist';
import { FormsModule } from '@angular/forms';
import { RegioneRoutes } from './regione.routing';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    FormsModule,
    RouterModule.forChild(RegioneRoutes)
  ],
  providers: [DatePipe],
  declarations: [RegioneComponent]
})
export class RegioneModule {}
