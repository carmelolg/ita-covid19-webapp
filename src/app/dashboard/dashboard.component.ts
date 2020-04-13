import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Chart } from '../shared/model/Chart';
import { Tile } from '../shared/model/Tiles';
import { ChartService } from './chart.service'
import { InfoChart } from '../shared/model/InfoChart';
import { Observable, Subscriber, Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public resumeInfo: InfoChart;
  public growthRatesInfo: InfoChart;
  public totalCasesInfo: InfoChart;
  public totalPositivesInfo: InfoChart;
  public totalNewCasesInfo: InfoChart;
  public totalHospitalizedInfo: InfoChart;
  public totalHospitalizedIncreaseInfo: InfoChart;
  public totalIntensiveCareInfo: InfoChart;
  public totalIntensiveCareIncreaseInfo: InfoChart;
  public totalDeadInfo: InfoChart;
  public totalRecoveredInfo: InfoChart;
  public totalDeadIncreaseInfo: InfoChart;
  public totalRecoveredIncreaseInfo: InfoChart;
  public totalTestsInfo: InfoChart;
  public totalTestsIncreaseInfo: InfoChart;
  public testTodaysWithNewPositiveInfo: InfoChart;

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
  totalCases: Chart;

  totalNewCaseValues = [];
  totalNewCases: Chart;

  totalPositiveValues = [];
  totalPositives: Chart;

  totalHospitalizedValues = [];
  totalHospitalizedIncreaseValues = [];
  totalHospitalized: Chart;
  totalHospitalizedIncrease: Chart;

  totalDeadValues = [];
  totalDeadIncreaseValues = [];
  totalDead: Chart;
  totalDeadIncrease: Chart;


  totalTestsValues = [];
  totalTestsIncreaseValues = [];
  totalTests: Chart;
  totalTestsIncrease: Chart;


  totalIntensiveCareValues = [];
  totalIntensiveCareIncreaseValues = [];
  totalIntensiveCare: Chart;
  totalIntensiveCareIncrease: Chart;


  totalRecoveredValues = [];
  totalRecoveredIncreaseValues = [];
  totalRecovered: Chart;
  totalRecoveredIncrease: Chart;

  testTodaysWithNewPositive: Chart;

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
    this.growthRatesInfo.secondLegend = 'Tasso di crescita giornaliero';
    this.growthRatesInfo.desc = 'Il seguente grafico rappresenta l\'andamento del tasso di crescita dell\'epidemia in Italia';

    this.totalCasesInfo = new InfoChart();
    this.totalCasesInfo.title = 'Totali risultati positivi';
    this.totalCasesInfo.subtitle = 'Italia';
    this.totalCasesInfo.firstLegend = 'Numero di casi totali';
    this.totalCasesInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei casi totali in Italia';

    this.totalPositivesInfo = new InfoChart();
    this.totalPositivesInfo.title = 'Persone attualmente positive';
    this.totalPositivesInfo.subtitle = 'Italia';
    this.totalPositivesInfo.firstLegend = 'Numero di persone attualmente positive';
    this.totalPositivesInfo.desc = 'Il seguente grafico rappresenta l\'andamento delle persone attualmente positive in Italia';

    this.totalNewCasesInfo = new InfoChart();
    this.totalNewCasesInfo.title = 'Nuovi positivi giorno per giorno';
    this.totalNewCasesInfo.subtitle = 'Italia';
    this.totalNewCasesInfo.firstLegend = 'Nuovi positivi';
    this.totalNewCasesInfo.desc = 'Il seguente grafico rappresenta l\'andamento giornaliero delle persone risultate positive in Italia';

    /** RICOVERI */
    this.totalHospitalizedInfo = new InfoChart();
    this.totalHospitalizedInfo.title = 'Andamento ricoveri ospedalieri';
    this.totalHospitalizedInfo.subtitle = 'Italia';
    this.totalHospitalizedInfo.firstLegend = 'Pazienti ricoverati in ospedale';
    this.totalHospitalizedInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei pazienti ricoverati in Italia';

    this.totalHospitalizedIncreaseInfo = new InfoChart();
    this.totalHospitalizedIncreaseInfo.title = 'Numero pazienti ricoverati';
    this.totalHospitalizedIncreaseInfo.subtitle = 'Italia';
    this.totalHospitalizedIncreaseInfo.secondLegend = 'Variazione quotidiana dei ricoverati in Italia';
    this.totalHospitalizedIncreaseInfo.desc = 'Il seguente grafico mostra la variazione quotidiana degli ospedalizzati in Italia';


    this.totalIntensiveCareInfo = new InfoChart();
    this.totalIntensiveCareInfo.title = 'Pazienti ricoverati in terapia intensiva';
    this.totalIntensiveCareInfo.subtitle = 'Italia';
    this.totalIntensiveCareInfo.firstLegend = 'Pazienti ricoverati in terapia intensiva';
    this.totalIntensiveCareInfo.desc = 'Il seguente grafico rappresenta l\'andamento delle persone che hanno avuto bisogno di cure in terapia intensiva in Italia';

    this.totalIntensiveCareIncreaseInfo = new InfoChart();
    this.totalIntensiveCareIncreaseInfo.title = 'Numero di pazienti in terapia intensiva';
    this.totalIntensiveCareIncreaseInfo.subtitle = 'Italia';
    this.totalIntensiveCareIncreaseInfo.secondLegend = 'Variazione quotidiana dei ricoverati in terapia intensiva in Italia';
    this.totalIntensiveCareIncreaseInfo.desc = 'Il seguente grafico mostra la variazione quotidiana degli ospedalizzati in terapia intensiva in Italia';

    /** DECDEDUTI/GUARITI */
    this.totalDeadInfo = new InfoChart();
    this.totalDeadInfo.title = 'Deceduti totali';
    this.totalDeadInfo.subtitle = 'Italia';
    this.totalDeadInfo.firstLegend = 'Persone decedute totali';
    this.totalDeadInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei decessi in Italia';

    this.totalDeadIncreaseInfo = new InfoChart();
    this.totalDeadIncreaseInfo.title = 'Numero di deceduti giornalieri';
    this.totalDeadIncreaseInfo.subtitle = 'Italia';
    this.totalDeadIncreaseInfo.firstLegend = 'Persone decedute';
    this.totalDeadIncreaseInfo.desc = 'Il seguente grafico rappresenta l\'andamento giornaliero dei decessi in Italia';

    this.totalRecoveredInfo = new InfoChart();
    this.totalRecoveredInfo.title = 'Guariti totali';
    this.totalRecoveredInfo.subtitle = 'Italia';
    this.totalRecoveredInfo.firstLegend = 'Persone guarite totali';
    this.totalRecoveredInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei guariti in Italia';

    this.totalRecoveredIncreaseInfo = new InfoChart();
    this.totalRecoveredIncreaseInfo.title = 'Numero di guariti giornalieri';
    this.totalRecoveredIncreaseInfo.subtitle = 'Italia';
    this.totalRecoveredIncreaseInfo.firstLegend = 'Persone guarite';
    this.totalRecoveredIncreaseInfo.desc = 'Il seguente grafico rappresenta l\'andamento giornaliero dei guariti in Italia';

    /** TAMPONI */
    this.totalTestsInfo = new InfoChart();
    this.totalTestsInfo.title = 'Tamponi effettuati';
    this.totalTestsInfo.subtitle = 'Italia';
    this.totalTestsInfo.firstLegend = 'Tamponi effettuati ad oggi';
    this.totalTestsInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei tamponi effettuati in Italia';

    this.totalTestsIncreaseInfo = new InfoChart();
    this.totalTestsIncreaseInfo.title = 'Numero giornaliero di tamponi effettuati';
    this.totalTestsIncreaseInfo.subtitle = 'Italia';
    this.totalTestsIncreaseInfo.firstLegend = 'Tamponi effettuati giorno per giorno';
    this.totalTestsIncreaseInfo.desc = 'Il seguente grafico rappresenta la variazione giornaliera dei tamponi effettuati in Italia';

    this.testTodaysWithNewPositiveInfo = new InfoChart();
    this.testTodaysWithNewPositiveInfo.title = 'Nuovi positivi in relazione ai tamponi effettuati';
    this.testTodaysWithNewPositiveInfo.subtitle = 'Italia';
    this.testTodaysWithNewPositiveInfo.firstLegend = 'Nuovi positivi';
    this.testTodaysWithNewPositiveInfo.firstLegend = 'Tamponi effettuati giorno per giorno';
    this.testTodaysWithNewPositiveInfo.desc = 'Il seguente grafico rappresenta la relazione tra nuovi positivi e tamponi effettuati in Italia';


    this.eraseAllData();

    this.createGrowthRates();
    this.createTotalCases();
    this.createTotalPositives();
    this.createTotalDead();
    this.createTotalHospitalized();
    this.createTotalIntensiveCare();
    this.createTotalRecovered();
    this.createResume();
    
    this.createTotalNewCases().subscribe(_s => {
      this.createTotalTests().subscribe(_s1 => {
        this.createTestWithPositiveDaily();
      });
    });
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
    this.testTodaysWithNewPositive = null;
  }

  private createResume(): Observable<any> {

    const promise = new Subject();

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
        promise.next();
      }
    });

    return promise;
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
        });
        this.totalCases = this.chartService.createChart(this.dataLabels, 'Line', this.totalCasesValues);
      }
    });
  }


  private createTotalPositives() {
    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/positive").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          this.totalPositiveValues.push(item.value);
        });
        this.totalPositives = this.chartService.createChart(this.dataLabels, 'Line', this.totalPositiveValues);
      }
    });
  }

  private createTestWithPositiveDaily() {
    this.testTodaysWithNewPositive = this.chartService.createChart(this.dataLabels, 'Bar', this.totalNewCaseValues, this.totalTestsIncreaseValues);
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
      this.totalHospitalized = this.chartService.createChart(this.dataLabels, 'Line', this.totalHospitalizedValues);
      this.totalHospitalizedIncrease = this.chartService.createChart(this.dataLabels, 'Bar', this.totalHospitalizedIncreaseValues);
    });
  }

  private createTotalNewCases() : Observable<any>{

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/new").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalNewCaseValues.push(item.value);
        });
      }
      this.totalNewCases = this.chartService.createChart(this.dataLabels, 'Line', this.totalNewCaseValues);
      promise.next();
    });

    return promise;
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
      this.totalDead = this.chartService.createChart(this.dataLabels, 'Line', this.totalDeadValues);
      this.totalDeadIncrease = this.chartService.createChart(this.dataLabels, 'Line', this.totalDeadIncreaseValues);
    });

  }


  private createTotalTests(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/italy/total/test").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          // let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          // this.dataLabels.push(innerDate);
          this.totalTestsValues.push(item.value);
          this.totalTestsIncreaseValues.push(item.increaseFromYesterday);
        });
      }
      this.totalTests = this.chartService.createChart(this.dataLabels, 'Line', this.totalTestsValues);
      this.totalTestsIncrease = this.chartService.createChart(this.dataLabels, 'Line', this.totalTestsIncreaseValues);
      promise.next();
    });

    return promise;

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
      this.totalIntensiveCare = this.chartService.createChart(this.dataLabels, 'Line', this.totalIntensiveCareValues);
      this.totalIntensiveCareIncrease = this.chartService.createChart(this.dataLabels, 'Bar', this.totalIntensiveCareIncreaseValues);
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
      this.totalRecovered = this.chartService.createChart(this.dataLabels, 'Line', this.totalRecoveredValues);
      this.totalRecoveredIncrease = this.chartService.createChart(this.dataLabels, 'Line', this.totalRecoveredIncreaseValues);
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
          { footer: '', header: 'Terapia intensiva', percentage: this.formatHundreds(this.currentIntesiveCare + ''), cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: '', header: 'Isolamento domiciliare', percentage: this.formatHundreds(this.currentHomeIsolation + ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Tamponi', percentage: this.formatHundreds(this.currentTests + ''), cols: 2, rows: 2, color: '#99d6ff' }
        ];
      }
    });
  }

  private formatHundreds(s: String): string {
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

}
