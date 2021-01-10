import { ResumeComponent } from './resume/resume.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { ChartistModule } from 'ng-chartist';
import { CdkColumnDef } from '@angular/cdk/table';
import { ChartModule } from '../charts/chart.module';
import { CasesComponent } from './cases/cases.component';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  providers: [DatePipe, CdkColumnDef],
  declarations: [DashboardComponent, ResumeComponent, CasesComponent]
})
export class DashboardModule { }
