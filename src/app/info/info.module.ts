import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InfoComponent } from './info.component';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { InfoRoutes } from './info.routing';



@NgModule({
  declarations: [InfoComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(InfoRoutes)
  ],
  providers: [DatePipe]
})
export class InfoModule { }
