import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Chart } from '../shared/model/Chart';
import { Tile } from '../shared/model/Tiles';
import { ChartService } from './chart.service'
import { InfoChart } from '../shared/model/InfoChart';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public resumeInfo: InfoChart;
  public growthRatesInfo: InfoChart;
  public totalCasesInfo: InfoChart;
  public totalNewCasesInfo: InfoChart;
  public totalHospitalizedInfo: InfoChart;
  public totalIntensiveCareInfo: InfoChart;
  public totalDeadInfo: InfoChart;
  public totalRecoveredInfo: InfoChart;
  public totalTestsInfo: InfoChart;

  constructor(private http: HttpClient, public datepipe: DatePipe, private chartService: ChartService) { }

  dataLabels = [];

  resumeDateLabels = [];
  resumeTotalValues = [];
  resumeNewValues = [];
  resumeRecoveredValues = [];
  resumeDeadValues = [];
  resume: Chart;

  growthRateDateLabels = [];
  growthRateValues = [];
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

    /**
     * RIEPILOGO
     */

    this.resumeInfo = new InfoChart();
    this.resumeInfo.title = 'Riepilogo';
    this.resumeInfo.subtitle = 'Italia';
    this.resumeInfo.firstLegend = 'Totale casi';
    this.resumeInfo.secondLegend = 'Attualmente positivi';
    this.resumeInfo.thirdLegend = 'Guariti';
    this.resumeInfo.fourthLegend = 'Deceduti';
    this.resumeInfo.desc = 'Il seguente grafico raggruppa i principali dati sull\'epidemia: totale casi, attualmente positivi, guariti, deceduti';


    /** CONTAGI */
    this.growthRatesInfo = new InfoChart();
    this.growthRatesInfo.title = 'Tasso di crescita';
    this.growthRatesInfo.subtitle = 'Italia';
    this.growthRatesInfo.firstLegend = 'Tasso di crescita giornaliero';
    this.growthRatesInfo.desc = 'Il seguente grafico rappresenta l\'andamento del tasso di crescita dell\'epidemia in Italia';

    this.totalCasesInfo = new InfoChart();
    this.totalCasesInfo.title = 'Casi totali';
    this.totalCasesInfo.subtitle = 'Italia';
    this.totalCasesInfo.firstLegend = 'Casi ad oggi';
    this.totalCasesInfo.secondLegend = 'Incremento giornaliero';
    this.totalCasesInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei casi totali in Italia';

    this.totalNewCasesInfo = new InfoChart();
    this.totalNewCasesInfo.title = 'Nuovi casi';
    this.totalNewCasesInfo.subtitle = 'Italia';
    this.totalNewCasesInfo.firstLegend = 'Nuovi casi ad oggi';
    this.totalNewCasesInfo.secondLegend = 'Incremento giornaliero';
    this.totalNewCasesInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei nuovi casi in Italia';

    /** RICOVERI */
    this.totalHospitalizedInfo = new InfoChart();
    this.totalHospitalizedInfo.title = 'Ricoverati totali';
    this.totalHospitalizedInfo.subtitle = 'Italia';
    this.totalHospitalizedInfo.firstLegend = 'Casi ad oggi';
    this.totalHospitalizedInfo.secondLegend = 'Incremento giornaliero';
    this.totalHospitalizedInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei pazienti ricoverati in Italia';

    this.totalIntensiveCareInfo = new InfoChart();
    this.totalIntensiveCareInfo.title = 'Pazienti in terapia intensiva';
    this.totalIntensiveCareInfo.subtitle = 'Italia';
    this.totalIntensiveCareInfo.firstLegend = 'Casi ad oggi';
    this.totalIntensiveCareInfo.secondLegend = 'Incremento giornaliero';
    this.totalIntensiveCareInfo.desc = 'Il seguente grafico rappresenta l\'andamento delle persone che hanno avuto bisogno di cure in terapia intensiva in Italia';

    /** DECDEDUTI/GUARITI */
    this.totalDeadInfo = new InfoChart();
    this.totalDeadInfo.title = 'Deceduti totali';
    this.totalDeadInfo.subtitle = 'Italia';
    this.totalDeadInfo.firstLegend = 'Casi ad oggi';
    this.totalDeadInfo.secondLegend = 'Incremento giornaliero';
    this.totalDeadInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei decessi in Italia';

    this.totalRecoveredInfo = new InfoChart();
    this.totalRecoveredInfo.title = 'Guariti totali';
    this.totalRecoveredInfo.subtitle = 'Italia';
    this.totalRecoveredInfo.firstLegend = 'Casi ad oggi';
    this.totalRecoveredInfo.secondLegend = 'Incremento giornaliero';
    this.totalRecoveredInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei guariti in Italia';

    /** TAMPONI */
    this.totalTestsInfo = new InfoChart();
    this.totalTestsInfo.title = 'Tamponi effettuati';
    this.totalTestsInfo.subtitle = 'Italia';
    this.totalTestsInfo.firstLegend = 'Tamponi effettuati ad oggi';
    this.totalTestsInfo.secondLegend = 'Incremento giornaliero';
    this.totalTestsInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei tamponi effettuati in Italia';

    this.eraseAllData();

    this.createGrowthRates();
    this.createTotalCases();
    this.createTotalDead();
    this.createTotalHospitalized();
    this.createTotalIntensiveCare();
    this.createTotalTests();
    this.createTotalRecovered();
    this.createTotalNewCases();
    this.createResume();

    this.getGenericStats();
  }

  public changeTabHandler(tab): void {
    this.chartService.updateChartModel();
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
  }

  private createResume() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/resume", { params: { all: 'true' } }).subscribe(data => {
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
      }
    });
  }

  private createGrowthRates() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/growthRate").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          let innerDate = this.datepipe.transform(item.date, 'dd/MM')
          this.growthRateDateLabels.push(innerDate);
          this.growthRateValues.push(item.value);
        });
        this.growthRates = this.chartService.createChart(this.growthRateDateLabels, 'Bar', this.growthRateValues);
      }
    });
  }

  private createTotalCases() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          this.dataLabels.push(innerDate);
          this.totalCasesValues.push(item.value);
          this.totalCasesIncreaseValues.push(item.increaseFromYesterday);
        });
        this.totalCases = this.chartService.createChart(this.dataLabels, 'Line', this.totalCasesValues, this.totalCasesIncreaseValues);
      }
    });
  }

  private createTotalHospitalized() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/hospitalized").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalHospitalizedValues.push(item.value);
          this.totalHospitalizedIncreaseValues.push(item.increaseFromYesterday);
        });
      }
      this.totalHospitalized = this.chartService.createChart(this.dataLabels, 'Line', this.totalHospitalizedValues, this.totalHospitalizedIncreaseValues);
    });
  }

  private createTotalNewCases() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/new").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalNewCaseValues.push(item.value);
          this.totalNewCaseIncreaseValues.push(item.increaseFromYesterday);
        });
      }
      this.totalNewCases = this.chartService.createChart(this.dataLabels, 'Line', this.totalNewCaseValues, this.totalNewCaseIncreaseValues);
    });
  }


  private createTotalDead() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/dead").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalDeadValues.push(item.value);
          this.totalDeadIncreaseValues.push(item.increaseFromYesterday);
        });
      }
      this.totalDead = this.chartService.createChart(this.dataLabels, 'Line', this.totalDeadValues, this.totalDeadIncreaseValues);
    });

  }


  private createTotalTests() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/test").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalTestsValues.push(item.value);
          this.totalTestsIncreaseValues.push(item.increaseFromYesterday);
        });
      }
      this.totalTests = this.chartService.createChart(this.dataLabels, 'Line', this.totalTestsValues, this.totalTestsIncreaseValues);
    });

  }


  private createTotalIntensiveCare() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/intensive-care").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalIntensiveCareValues.push(item.value);
          this.totalIntensiveCareIncreaseValues.push(item.increaseFromYesterday);
        });
      }
      this.totalIntensiveCare = this.chartService.createChart(this.dataLabels, 'Line', this.totalIntensiveCareValues, this.totalIntensiveCareIncreaseValues);
    });
  }

  private createTotalRecovered() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/recovered").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalRecoveredValues.push(item.value);
          this.totalRecoveredIncreaseValues.push(item.increaseFromYesterday);
        });
      }
      this.totalRecovered = this.chartService.createChart(this.dataLabels, 'Line', this.totalRecoveredValues, this.totalRecoveredIncreaseValues);
    });

  }
  private getGenericStats() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/stats").subscribe(data => {
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
          { footer: '', header: 'Positivi ad oggi', percentage: this.formatHundreds(this.currentPositives + ''), cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: '', header: 'Deceduti', percentage: this.formatHundreds(this.currentDead + ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Guariti', percentage: this.formatHundreds(this.currentRecovered + ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Ricoverati', percentage: this.formatHundreds(this.currentHospedalized + ''), cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: '', header: 'Terapia intensiva', percentage: this.formatHundreds(this.currentIntesiveCare + ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Isolamento domiciliare', percentage: this.formatHundreds(this.currentHomeIsolation + ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Tamponi', percentage: this.formatHundreds(this.currentTests + ''), cols: 2, rows: 2, color: '#b3e0ff' }
        ];
      }
    });
  }

  private formatHundreds(s: String): string {
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

}
