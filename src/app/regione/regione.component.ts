import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Chart } from '../shared/model/Chart';

declare var require: any
require('chartist-plugin-tooltips-updated');
import { ChartService } from '../dashboard/chart.service';
import { Tile } from '../shared/model/Tiles';
import { InfoChart } from '../shared/model/InfoChart';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-regione',
  templateUrl: './regione.component.html',
  styleUrls: ['./regione.component.scss']
})
export class RegioneComponent implements OnInit {

  public resumeInfo: InfoChart;
  public growthRatesInfo: InfoChart;
  public totalCasesInfo: InfoChart;
  public totalNewCasesInfo: InfoChart;
  public totalHospitalizedInfo: InfoChart;
  public totalIntensiveCareInfo: InfoChart;
  public totalDeadInfo: InfoChart;
  public totalRecoveredInfo: InfoChart;
  public totalTestsInfo: InfoChart;

  constructor(
    private http: HttpClient,
    public datepipe: DatePipe,
    private chartService: ChartService,
    private changeDetector: ChangeDetectorRef) { }


  regionName = "Lombardia";
  regionNameInput = "";
  isLoading = false;

  formControl = new FormControl({ value: '', disabled: this.isLoading });
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  dataLabels = [];

  resumeDateLabels = [];
  resumeTotalValues = [];
  resumeNewValues = [];
  resumeRecoveredValues = [];
  resumeDeadValues = [];
  resume: Chart;

  growthRateDateLabels = [];
  growthRateValues = [];
  growthRateIncreaseValues = [];
  growthRates: Chart;

  totalCasesValues = [];
  totalCasesIncreaseValues = [];
  totalCases: Chart;

  totalNewCaseValues = [];
  totalNewCaseIncreaseValues = [];
  totalNewCases: Chart;

  totalHospitalizedValues = [];
  totalHospitalizedIncreaseValues = [];
  totalHospitalized: Chart;


  totalDeadValues = [];
  totalDeadIncreaseValues = [];
  totalDead: Chart;


  totalTestsValues = [];
  totalTestsIncreaseValues = [];
  totalTests: Chart;


  totalIntensiveCareValues = [];
  totalIntensiveCareIncreaseValues = [];
  totalIntensiveCare: Chart;


  totalRecoveredValues = [];
  totalRecoveredIncreaseValues = [];
  totalRecovered: Chart;

  currentGrowthRate = 0;
  currentNewPositiveGrowthRate = 0;
  percentageCasesBasedOnTests = 0;
  currentRecoveredPercentage = 0;
  currentDeadPercentage = 0;
  currentIntensiveCarePercentage = 0;
  currentHospitalizedPercentage = 0;

  currentTotalCases = 0;
  currentPositives = 0;
  currentDead = 0;
  currentRecovered = 0;
  currentTests = 0;
  currentHospedalized = 0;
  currentIntesiveCare = 0;
  currentHomeIsolation = 0;

  tiles: Tile[] = [];
  genericTiles: Tile[] = [];

  ngOnInit() {

    this.http.get<any>("https://ita-covid19.herokuapp.com/regions").subscribe(regions => {
      this.options = regions;
    });

    /**
     * RIEPILOGO
     */

    this.resumeInfo = new InfoChart();
    this.resumeInfo.title = 'Riepilogo';
    this.resumeInfo.subtitle = this.regionName;
    this.resumeInfo.firstLegend = 'Totale casi';
    this.resumeInfo.secondLegend = 'Attualmente positivi';
    this.resumeInfo.thirdLegend = 'Guariti';
    this.resumeInfo.fourthLegend = 'Deceduti';
    this.resumeInfo.desc = 'Il seguente grafico raggruppa i principali dati sull\'epidemia: totale casi, attualmente positivi, guariti, deceduti';


    /** CONTAGI */
    this.growthRatesInfo = new InfoChart();
    this.growthRatesInfo.title = 'Tasso di crescita';
    this.growthRatesInfo.subtitle = this.regionName;
    this.growthRatesInfo.firstLegend = 'Tasso di crescita giornaliero';
    this.growthRatesInfo.desc = 'Il seguente grafico rappresenta l\'andamento del tasso di crescita dell\'epidemia';

    this.totalCasesInfo = new InfoChart();
    this.totalCasesInfo.title = 'Casi totali';
    this.totalCasesInfo.subtitle = this.regionName;
    this.totalCasesInfo.firstLegend = 'Casi ad oggi';
    this.totalCasesInfo.secondLegend = 'Incremento giornaliero';
    this.totalCasesInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei casi totali';

    this.totalNewCasesInfo = new InfoChart();
    this.totalNewCasesInfo.title = 'Nuovi casi';
    this.totalNewCasesInfo.subtitle = this.regionName;
    this.totalNewCasesInfo.firstLegend = 'Nuovi casi ad oggi';
    this.totalNewCasesInfo.secondLegend = 'Incremento giornaliero';
    this.totalNewCasesInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei nuovi casi';

    /** RICOVERI */
    this.totalHospitalizedInfo = new InfoChart();
    this.totalHospitalizedInfo.title = 'Ricoverati totali';
    this.totalHospitalizedInfo.subtitle = this.regionName;
    this.totalHospitalizedInfo.firstLegend = 'Casi ad oggi';
    this.totalHospitalizedInfo.secondLegend = 'Incremento giornaliero';
    this.totalHospitalizedInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei pazienti ricoverati';

    this.totalIntensiveCareInfo = new InfoChart();
    this.totalIntensiveCareInfo.title = 'Pazienti in terapia intensiva';
    this.totalIntensiveCareInfo.subtitle = this.regionName;
    this.totalIntensiveCareInfo.firstLegend = 'Casi ad oggi';
    this.totalIntensiveCareInfo.secondLegend = 'Incremento giornaliero';
    this.totalIntensiveCareInfo.desc = 'Il seguente grafico rappresenta l\'andamento delle persone che hanno avuto bisogno di cure in terapia intensiva';

    /** DECDEDUTI/GUARITI */
    this.totalDeadInfo = new InfoChart();
    this.totalDeadInfo.title = 'Deceduti totali';
    this.totalDeadInfo.subtitle = this.regionName;
    this.totalDeadInfo.firstLegend = 'Casi ad oggi';
    this.totalDeadInfo.secondLegend = 'Incremento giornaliero';
    this.totalDeadInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei decessi';

    this.totalRecoveredInfo = new InfoChart();
    this.totalRecoveredInfo.title = 'Guariti totali';
    this.totalRecoveredInfo.subtitle = this.regionName;
    this.totalRecoveredInfo.firstLegend = 'Casi ad oggi';
    this.totalRecoveredInfo.secondLegend = 'Incremento giornaliero';
    this.totalRecoveredInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei guariti';

    /** TAMPONI */
    this.totalTestsInfo = new InfoChart();
    this.totalTestsInfo.title = 'Tamponi effettuati';
    this.totalTestsInfo.subtitle = this.regionName;
    this.totalTestsInfo.firstLegend = 'Tamponi effettuati ad oggi';
    this.totalTestsInfo.secondLegend = 'Incremento giornaliero';
    this.totalTestsInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei tamponi effettuati';

    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.call();

    this.getGenericStats();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  public changeTabHandler(tab): void {
    this.chartService.updateChartModel();
  }

  public call() {

    if (!this.isLoading) {
      this.isLoading = true;
      if (this.regionNameInput.length === 0) {
        this.regionNameInput = this.regionName;
      }

      this.resumeInfo.subtitle = this.regionNameInput;
      this.growthRatesInfo.subtitle = this.regionNameInput;
      this.totalCasesInfo.subtitle = this.regionNameInput;
      this.totalNewCasesInfo.subtitle = this.regionNameInput;
      this.totalHospitalizedInfo.subtitle = this.regionNameInput;
      this.totalIntensiveCareInfo.subtitle = this.regionNameInput;
      this.totalDeadInfo.subtitle = this.regionNameInput;
      this.totalRecoveredInfo.subtitle = this.regionNameInput;
      this.totalTestsInfo.subtitle = this.regionNameInput;

      this.eraseAllData();
      this.createResume();
      this.getGenericStats();

      this.changeDetector.detectChanges();
    }

  }

  private createResume() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/resume", { params: { all: 'true' } }).subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {

          let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          this.resumeDateLabels.push(innerDate);
          this.resumeTotalValues.push(item.totalCases);
          this.resumeNewValues.push(item.nowPositives);
          this.resumeRecoveredValues.push(item.recovered);
          this.resumeDeadValues.push(item.dead);
        });
        this.resume = this.chartService.createChart(this.resumeDateLabels, 'Line', this.resumeTotalValues, this.resumeNewValues, this.resumeRecoveredValues, this.resumeDeadValues);
      } else {
        this.resumeInfo.subtitle = data.description;
        this.resume = this.chartService.createChart(this.resumeDateLabels, 'Line', null);
      }

      this.createGrowthRates();
      this.createTotalCases();
      this.createNewCases();
      this.createTotalHospitalized();
      this.createTotalIntensiveCare();
      this.createTotalDead();
      this.createTotalRecovered();
      this.createTotalTests();
      this.isLoading = false;
    });
  }

  private createGrowthRates() {
    this.growthRateDateLabels = [];
    this.growthRateValues = [];

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/growthRate").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          let innerDate = this.datepipe.transform(item.date, 'dd/MM')
          this.growthRateDateLabels.push(innerDate);
          this.growthRateValues.push(item.value);
        });
        this.growthRates = this.chartService.createChart(this.growthRateDateLabels, 'Bar', this.growthRateValues);
      } else {
        this.growthRatesInfo.subtitle = data.description;
        this.growthRates = this.chartService.createChart(this.growthRateDateLabels, 'Line', null);
      }
    });
  }

  private createTotalCases() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total").subscribe(data => {

      if (data.results.length > 0) {
        data.results.forEach(item => {
          let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          this.dataLabels.push(innerDate);
          this.totalCasesValues.push(item.value);
          this.totalCasesIncreaseValues.push(item.increaseFromYesterday);
        });
        this.regionName = this.regionNameInput;
        this.totalCases = this.chartService.createChart(this.dataLabels, 'Line', this.totalCasesValues, this.totalCasesIncreaseValues);
      } else {
        this.totalCasesInfo.subtitle = data.description;
        this.totalCases = this.chartService.createChart(this.dataLabels, 'Line', null);
      }
    });

  }

  private createNewCases() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/new").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          this.totalNewCaseValues.push(item.value);
          this.totalNewCaseIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalNewCasesInfo.subtitle = data.description;
      }
      this.totalNewCases = this.chartService.createChart(this.dataLabels, 'Line', this.totalNewCaseValues, this.totalNewCaseIncreaseValues);
    });


  }

  private createTotalHospitalized() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/hospitalized").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          this.totalHospitalizedValues.push(item.value);
          this.totalHospitalizedIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalHospitalizedInfo.subtitle = data.description;
      }
      this.totalHospitalized = this.chartService.createChart(this.dataLabels, 'Line', this.totalHospitalizedValues, this.totalHospitalizedIncreaseValues);
    });


  }


  private createTotalDead() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/dead").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalDeadValues.push(item.value);
          this.totalDeadIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalDeadInfo.subtitle = data.description;
      }
      this.totalDead = this.chartService.createChart(this.dataLabels, 'Line', this.totalDeadValues, this.totalDeadIncreaseValues);
    });

  }


  private createTotalTests() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/test").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalTestsValues.push(item.value);
          this.totalTestsIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalTestsInfo.subtitle = data.description;
      }
      this.totalTests = this.chartService.createChart(this.dataLabels, 'Line', this.totalTestsValues, this.totalTestsIncreaseValues);
    });

  }


  private createTotalIntensiveCare() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/intensive-care").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalIntensiveCareValues.push(item.value);
          this.totalIntensiveCareIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalIntensiveCareInfo.subtitle = data.description;
      }
      this.totalIntensiveCare = this.chartService.createChart(this.dataLabels, 'Line', this.totalIntensiveCareValues, this.totalIntensiveCareIncreaseValues);
    });

  }

  private createTotalRecovered() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/recovered").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalRecoveredValues.push(item.value);
          this.totalRecoveredIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalRecoveredInfo.subtitle = data.description;
      }
      this.totalRecovered = this.chartService.createChart(this.dataLabels, 'Line', this.totalRecoveredValues, this.totalRecoveredIncreaseValues);
    });

  }

  private getGenericStats() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/stats").subscribe(data => {
      if (!!data) {
        this.currentGrowthRate = (!!data.currentRateOfGrowth) ? data.currentRateOfGrowth : 0;
        this.currentNewPositiveGrowthRate = (!!data.currentNewPositiveRateOfGrowth) ? data.currentNewPositiveRateOfGrowth : 0;
        this.percentageCasesBasedOnTests = (!!data.currentPositivePercentageBasedOnTests) ? data.currentPositivePercentageBasedOnTests : 0;
        this.currentRecoveredPercentage = (!!data.currentRecoveredPercentage) ? data.currentRecoveredPercentage : 0;
        this.currentDeadPercentage = (!!data.currentDeadPercentage) ? data.currentDeadPercentage : 0;
        this.currentIntensiveCarePercentage = (!!data.currentIntensiveCarePercentage) ? data.currentIntensiveCarePercentage : 0;
        this.currentHospitalizedPercentage = (!!data.currentHospitalizedPercentage) ? data.currentHospitalizedPercentage : 0;

        this.currentTotalCases = (!!data.currentTotalCases) ? data.currentTotalCases : 0;
        this.currentPositives = (!!data.currentPositives) ? data.currentPositives : 0;
        this.currentDead = (!!data.currentDead) ? data.currentDead : 0;
        this.currentRecovered = (!!data.currentRecovered) ? data.currentRecovered : 0;
        this.currentTests = (!!data.currentTests) ? data.currentTests : 0;
        this.currentHospedalized = (!!data.currentHospedalized) ? data.currentHospedalized : 0;
        this.currentIntesiveCare = (!!data.currentIntesiveCare) ? data.currentIntesiveCare : 0;
        this.currentHomeIsolation = (!!data.currentHomeIsolation) ? data.currentHomeIsolation : 0;

        this.tiles = [
          { footer: 'Percentuale', header: 'Deceduti', percentage: this.currentDeadPercentage + '%', cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: 'Percentuale', header: 'Guariti', percentage: this.currentRecoveredPercentage + '%', cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: 'Percentuale', header: 'Terapia intensiva', percentage: this.currentIntensiveCarePercentage + '%', cols: 2, rows: 2, color: '#99d6ff' },
          { footer: 'Percentuale', header: 'Positivi per tamponi', percentage: this.percentageCasesBasedOnTests + '%', cols: 2, rows: 2, color: '#99d6ff' },
          { footer: 'Tasso di crescita', header: '% incr. totale', percentage: this.currentGrowthRate + '%', cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: 'Tasso di crescita', header: '% incr. nuovi positivi', percentage: this.currentNewPositiveGrowthRate + '%', cols: 2, rows: 2, color: '#b3e0ff' }
        ];

        this.genericTiles = [
          { footer: '', header: 'Totale casi', percentage: this.formatHundreds(this.currentTotalCases + ''), cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: '', header: 'Positivi oggi', percentage: this.formatHundreds(this.currentPositives+ ''), cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: '', header: 'Deceduti', percentage: this.formatHundreds(this.currentDead+ ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Guariti', percentage: this.formatHundreds(this.currentRecovered+ ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Ospedalizzati', percentage: this.formatHundreds(this.currentHospedalized+ ''), cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: '', header: 'Terapia intensiva', percentage: this.formatHundreds(this.currentIntesiveCare+ ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Isolamento domiciliare', percentage: this.formatHundreds(this.currentHomeIsolation+ ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Tamponi', percentage: this.formatHundreds(this.currentTests+ ''), cols: 2, rows: 2, color: '#b3e0ff' }
        ];

      }
    }, error => {
      this.tiles = [];
      this.genericTiles = [];
    });
  }

  private formatHundreds(s: String){
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  private eraseAllData() {
    this.totalCases = null;
    this.totalDead = null;
    this.totalHospitalized = null;
    this.totalIntensiveCare = null;
    this.totalTests = null;
    this.totalRecovered = null;
    this.totalNewCases = null;
    this.resume = null;

    this.dataLabels = [];

    this.resumeDateLabels = [];
    this.resumeTotalValues = [];
    this.resumeNewValues = [];
    this.resumeRecoveredValues = [];
    this.resumeDeadValues = [];

    this.totalCasesValues = [];
    this.totalCasesIncreaseValues = [];

    this.totalNewCaseValues = [];
    this.totalNewCaseIncreaseValues = [];

    this.totalHospitalizedValues = [];
    this.totalHospitalizedIncreaseValues = [];

    this.totalDeadValues = [];
    this.totalDeadIncreaseValues = [];

    this.totalTestsValues = [];
    this.totalTestsIncreaseValues = [];

    this.totalIntensiveCareValues = [];
    this.totalIntensiveCareIncreaseValues = [];

    this.totalRecoveredValues = [];
    this.totalRecoveredIncreaseValues = [];

    this.tiles = null;
    this.genericTiles = null;
  }

}
