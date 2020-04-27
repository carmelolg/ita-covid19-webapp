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
import { Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { deprecate } from 'util';

@Component({
  selector: 'app-regione',
  templateUrl: './regione.component.html',
  styleUrls: ['./regione.component.scss']
})
export class RegioneComponent implements OnInit {

  public resumeInfo: InfoChart;
  public growthRatesInfo: InfoChart;
  public totalCasesInfo: InfoChart;
  public totalPositivesInfo: InfoChart;
  public totalNewCasesInfo: InfoChart;
  public totalNewCasesVariationInfo: InfoChart;
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
  public percentageNewPositiveByTestInfo: InfoChart;

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
  totalCases: Chart;

  totalPositiveValues = [];
  totalPositives: Chart;

  totalNewCaseValues = [];
  totalNewCases: Chart;

  totalNewCaseVariationValues = [];
  totalNewCasesVariation: Chart;

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
  percentageNewPositiveByTest: Chart;

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

  migrationDate;

  ngOnInit() {

    this.getMigrationDate();

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
    this.totalCasesInfo.title = 'Totali risultati positivi';
    this.totalCasesInfo.subtitle = this.regionName;
    this.totalCasesInfo.firstLegend = 'Numero di casi totali';
    this.totalCasesInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei casi totali';

    this.totalPositivesInfo = new InfoChart();
    this.totalPositivesInfo.title = 'Persone attualmente positive';
    this.totalPositivesInfo.subtitle = this.regionName;
    this.totalPositivesInfo.firstLegend = 'Numero di persone attualmente positive';
    this.totalPositivesInfo.desc = 'Il seguente grafico rappresenta l\'andamento delle persone attualmente positive';

    this.totalNewCasesInfo = new InfoChart();
    this.totalNewCasesInfo.title = 'Variazione totale contagiati';
    this.totalNewCasesInfo.subtitle = this.regionName;
    this.totalNewCasesInfo.firstLegend = 'Contagiati';
    this.totalNewCasesInfo.desc = 'Il seguente grafico rappresenta l\'andamento giornaliero dei contagiati totali';

    this.totalNewCasesVariationInfo = new InfoChart();
    this.totalNewCasesVariationInfo.title = 'Variazione del totale positivi';
    this.totalNewCasesVariationInfo.subtitle = this.regionName;
    this.totalNewCasesVariationInfo.firstLegend = 'Positivi';
    this.totalNewCasesVariationInfo.desc = 'Il seguente grafico rappresenta la variazione del totale dei positivi';

    /** RICOVERI */
    this.totalHospitalizedInfo = new InfoChart();
    this.totalHospitalizedInfo.title = 'Andamento ricoveri ospedalieri';
    this.totalHospitalizedInfo.subtitle = this.regionName;
    this.totalHospitalizedInfo.firstLegend = 'Pazienti ricoverati in ospedale';
    this.totalHospitalizedInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei pazienti ricoverati';

    this.totalHospitalizedIncreaseInfo = new InfoChart();
    this.totalHospitalizedIncreaseInfo.title = 'Numero pazienti ricoverati';
    this.totalHospitalizedInfo.subtitle = this.regionName;
    this.totalHospitalizedIncreaseInfo.secondLegend = 'Variazione quotidiana dei ricoverati';
    this.totalHospitalizedIncreaseInfo.desc = 'Il seguente grafico mostra la variazione quotidiana degli ospedalizzati';

    this.totalIntensiveCareInfo = new InfoChart();
    this.totalIntensiveCareInfo.title = 'Pazienti ricoverati in terapia intensiva';
    this.totalIntensiveCareInfo.subtitle = this.regionName;
    this.totalIntensiveCareInfo.firstLegend = 'Pazienti ricoverati in terapia intensiva';
    this.totalIntensiveCareInfo.desc = 'Il seguente grafico rappresenta l\'andamento delle persone che hanno avuto bisogno di cure in terapia intensiva';

    this.totalIntensiveCareIncreaseInfo = new InfoChart();
    this.totalIntensiveCareIncreaseInfo.title = 'Numero di pazienti in terapia intensiva';
    this.totalIntensiveCareInfo.subtitle = this.regionName;
    this.totalIntensiveCareIncreaseInfo.secondLegend = 'Variazione quotidiana dei ricoverati in terapia intensiva';
    this.totalIntensiveCareIncreaseInfo.desc = 'Il seguente grafico mostra la variazione quotidiana degli ospedalizzati in terapia intensiva';


    /** DECDEDUTI/GUARITI */
    this.totalDeadInfo = new InfoChart();
    this.totalDeadInfo.title = 'Deceduti totali';
    this.totalDeadInfo.subtitle = this.regionName;
    this.totalDeadInfo.firstLegend = 'Casi ad oggi';
    this.totalDeadInfo.secondLegend = 'Persone decedute totali';
    this.totalDeadInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei decessi';

    this.totalDeadIncreaseInfo = new InfoChart();
    this.totalDeadIncreaseInfo.title = 'Numero di deceduti giornalieri';
    this.totalDeadInfo.subtitle = this.regionName;
    this.totalDeadIncreaseInfo.firstLegend = 'Persone decedute';
    this.totalDeadIncreaseInfo.desc = 'Il seguente grafico rappresenta l\'andamento giornaliero dei decessi';

    this.totalRecoveredInfo = new InfoChart();
    this.totalRecoveredInfo.title = 'Guariti totali';
    this.totalRecoveredInfo.subtitle = this.regionName;
    this.totalRecoveredInfo.firstLegend = 'Persone guarite totali';
    this.totalRecoveredInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei guariti';

    this.totalRecoveredIncreaseInfo = new InfoChart();
    this.totalRecoveredIncreaseInfo.title = 'Numero di guariti giornalieri';
    this.totalDeadInfo.subtitle = this.regionName;
    this.totalRecoveredIncreaseInfo.firstLegend = 'Persone guarite';
    this.totalRecoveredIncreaseInfo.desc = 'Il seguente grafico rappresenta l\'andamento giornaliero dei guariti';

    /** TAMPONI */
    this.totalTestsInfo = new InfoChart();
    this.totalTestsInfo.title = 'Tamponi effettuati';
    this.totalTestsInfo.subtitle = this.regionName;
    this.totalTestsInfo.firstLegend = 'Tamponi effettuati ad oggi';
    this.totalTestsInfo.secondLegend = 'Incremento giornaliero';
    this.totalTestsInfo.desc = 'Il seguente grafico rappresenta l\'andamento dei tamponi effettuati';

    this.totalTestsIncreaseInfo = new InfoChart();
    this.totalTestsIncreaseInfo.title = 'Numero giornaliero di tamponi effettuati';
    this.totalTestsInfo.subtitle = this.regionName;
    this.totalTestsIncreaseInfo.firstLegend = 'Tamponi effettuati giorno per giorno';
    this.totalTestsIncreaseInfo.desc = 'Il seguente grafico rappresenta la variazione giornaliera dei tamponi effettuati';

    this.testTodaysWithNewPositiveInfo = new InfoChart();
    this.testTodaysWithNewPositiveInfo.title = 'Nuovi positivi in relazione ai tamponi effettuati';
    this.testTodaysWithNewPositiveInfo.subtitle = this.regionName;
    this.testTodaysWithNewPositiveInfo.secondLegend = 'Nuovi positivi';
    this.testTodaysWithNewPositiveInfo.firstLegend = 'Tamponi effettuati giorno per giorno';
    this.testTodaysWithNewPositiveInfo.desc = 'Il seguente grafico rappresenta la relazione tra nuovi positivi e tamponi effettuati';


    this.percentageNewPositiveByTestInfo = new InfoChart();
    this.percentageNewPositiveByTestInfo.title = 'Percentuale di positivi sui test effettuati';
    this.percentageNewPositiveByTestInfo.subtitle = this.regionName;
    this.percentageNewPositiveByTestInfo.firstLegend = 'Percentuale';
    this.percentageNewPositiveByTestInfo.desc = 'Il seguente grafico rappresenta l\'andamento della percentuale di positivi rispetto ai tamponi effettuati';


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
      this.totalHospitalizedIncreaseInfo.subtitle = this.regionNameInput;
      this.totalIntensiveCareInfo.subtitle = this.regionNameInput;
      this.totalIntensiveCareIncreaseInfo.subtitle = this.regionNameInput;
      this.totalDeadInfo.subtitle = this.regionNameInput;
      this.totalDeadIncreaseInfo.subtitle = this.regionNameInput;
      this.totalRecoveredInfo.subtitle = this.regionNameInput;
      this.totalRecoveredIncreaseInfo.subtitle = this.regionNameInput;
      this.totalTestsInfo.subtitle = this.regionNameInput;
      this.totalTestsIncreaseInfo.subtitle = this.regionNameInput;
      this.totalNewCasesVariationInfo.subtitle = this.regionNameInput;
      this.totalPositivesInfo.subtitle = this.regionNameInput;
      this.percentageNewPositiveByTestInfo.subtitle = this.regionNameInput;

      this.eraseAllData();
      this.createResume();
      this.getGenericStats();

      this.changeDetector.detectChanges();
    }

  }

  private getMigrationDate(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/file/last").subscribe(data => {
      if (data!= null && data.date != null) {
        this.migrationDate = data.date;
      }
      promise.next();
    });

    return promise;
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
      this.createTotalPositives().subscribe(_sTP => {
        this.createTotalNewCasesVariation();
        this.createTotalHospitalized();
        this.createTotalIntensiveCare();
        this.createTotalDead();
        this.createTotalRecovered();

        this.createNewCases().subscribe(_s => {
          this.createTotalTests().subscribe(_s1 => {
            this.createTestWithPositiveDaily();
          });
        });
      });


      this.isLoading = false;
    });
  }

  private createGrowthRates(): Observable<any> {

    const promise = new Subject();

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

      promise.next();
    });

    return promise;
  }

  private createTestWithPositiveDaily() {

    this.testTodaysWithNewPositive = this.chartService.createChart(this.dataLabels, 'Bar', this.totalNewCaseValues, this.totalTestsIncreaseValues);

    let _percentageNewPositiveByTest: number[] = [];
    for (let index = 0; index < this.totalNewCaseValues.length; index++) {
      const newPositive = this.totalNewCaseValues[index];
      const test = this.totalTestsIncreaseValues[index];

      _percentageNewPositiveByTest[index] = Number(((newPositive * 100) / test).toFixed(2));
    }

    this.percentageNewPositiveByTest = this.chartService.createChart(this.dataLabels, 'Line', _percentageNewPositiveByTest);
  }
  
  //@deprecate
  private createTotalCases(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total").subscribe(data => {

      if (data.results.length > 0) {
        data.results.forEach(item => {
          let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          this.dataLabels.push(innerDate);
          this.totalCasesValues.push(item.value);
        });
        this.regionName = this.regionNameInput;
        this.totalCases = this.chartService.createChart(this.dataLabels, 'Line', this.totalCasesValues);
      } else {
        this.totalCasesInfo.subtitle = data.description;
        this.totalCases = this.chartService.createChart(this.dataLabels, 'Line', null);
      }
      promise.next();
    });

    return promise;
  }

  private createTotalPositives(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/positive").subscribe(data => {
      if (data.results.length > 0) {
        data.results.forEach(item => {
          let innerDate = this.datepipe.transform(item.data, 'dd/MM')
          this.dataLabels.push(innerDate);
          this.totalPositiveValues.push(item.value);
        });
      } else {
        this.totalPositivesInfo.subtitle = data.description;
      }
      this.totalPositives = this.chartService.createChart(this.dataLabels, 'Line', this.totalPositiveValues);
      promise.next();
    });
    return promise;
  }

  private createTotalNewCasesVariation(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/new/variation").subscribe(data => {
      if (data.results.length > 0) {
        var _dataLabels = [];
        data.results.forEach(item => {
          _dataLabels.push(this.datepipe.transform(item.data, 'dd/MM'));
          this.totalNewCaseVariationValues.push(item.value);
        });
      }
      this.totalNewCasesVariation = this.chartService.createChart(_dataLabels, 'Line', this.totalNewCaseVariationValues);
      promise.next();
    });

    return promise;
  }

  private createNewCases(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/new").subscribe(data => {
      if (data.results.length > 0) {
        var _dataLabels = [];
        data.results.forEach(item => {
          _dataLabels.push(this.datepipe.transform(item.data, 'dd/MM'));
          this.totalNewCaseValues.push(item.value);
        });
      } else {
        this.totalNewCasesInfo.subtitle = data.description;
      }
      this.totalNewCases = this.chartService.createChart(_dataLabels, 'Line', this.totalNewCaseValues);
      promise.next();
    });


    return promise;
  }

  private createTotalHospitalized(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/hospitalized").subscribe(data => {
      if (data.results.length > 0) {
        var _dataLabels = [];
        data.results.forEach(item => {
          _dataLabels.push(this.datepipe.transform(item.data, 'dd/MM'));
          this.totalHospitalizedValues.push(item.value);
          this.totalHospitalizedIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalHospitalizedInfo.subtitle = data.description;
      }
      this.totalHospitalized = this.chartService.createChart(_dataLabels, 'Line', this.totalHospitalizedValues);
      this.totalHospitalizedIncrease = this.chartService.createChart(_dataLabels, 'Bar', this.totalHospitalizedIncreaseValues);
      promise.next();
    });

    return promise;
  }


  private createTotalDead(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/dead").subscribe(data => {
      if (data.results.length > 0) {
        var _dataLabels = [];
        data.results.forEach(item => {
          _dataLabels.push(this.datepipe.transform(item.data, 'dd/MM'));
          this.totalDeadValues.push(item.value);
          this.totalDeadIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalDeadInfo.subtitle = data.description;
      }
      this.totalDead = this.chartService.createChart(_dataLabels, 'Line', this.totalDeadValues);
      this.totalDeadIncrease = this.chartService.createChart(_dataLabels, 'Line', this.totalDeadIncreaseValues);
      promise.next();
    });

    return promise;
  }


  private createTotalTests(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/test").subscribe(data => {
      if (data.results.length > 0) {
        var _dataLabels = [];
        data.results.forEach(item => {
          _dataLabels.push(this.datepipe.transform(item.data, 'dd/MM'));
          this.totalTestsValues.push(item.value);
          this.totalTestsIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalTestsInfo.subtitle = data.description;
      }
      this.totalTests = this.chartService.createChart(_dataLabels, 'Line', this.totalTestsValues);
      this.totalTestsIncrease = this.chartService.createChart(_dataLabels, 'Line', this.totalTestsIncreaseValues);
      promise.next();
    });

    return promise;
  }


  private createTotalIntensiveCare(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/intensive-care").subscribe(data => {
      if (data.results.length > 0) {
        var _dataLabels = [];
        data.results.forEach(item => {
          _dataLabels.push(this.datepipe.transform(item.data, 'dd/MM'));
          this.totalIntensiveCareValues.push(item.value);
          this.totalIntensiveCareIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalIntensiveCareInfo.subtitle = data.description;
      }
      this.totalIntensiveCare = this.chartService.createChart(_dataLabels, 'Line', this.totalIntensiveCareValues);
      this.totalIntensiveCareIncrease = this.chartService.createChart(_dataLabels, 'Bar', this.totalIntensiveCareIncreaseValues);
      promise.next();
    });

    return promise;
  }

  private createTotalRecovered(): Observable<any> {

    const promise = new Subject();

    this.http.get<any>("https://ita-covid19.herokuapp.com/region/" + this.regionNameInput + "/total/recovered").subscribe(data => {
      if (data.results.length > 0) {
        var _dataLabels = [];
        data.results.forEach(item => {
          _dataLabels.push(this.datepipe.transform(item.data, 'dd/MM'));
          this.totalRecoveredValues.push(item.value);
          this.totalRecoveredIncreaseValues.push(item.increaseFromYesterday);
        });
      } else {
        this.totalRecoveredInfo.subtitle = data.description;
      }
      this.totalRecovered = this.chartService.createChart(_dataLabels, 'Line', this.totalRecoveredValues);
      this.totalRecoveredIncrease = this.chartService.createChart(_dataLabels, 'Line', this.totalRecoveredIncreaseValues);
      promise.next();
    });

    return promise;

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
          { footer: '', header: 'Positivi ad oggi', percentage: this.formatHundreds(this.currentPositives + ''), cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: '', header: 'Deceduti', percentage: this.formatHundreds(this.currentDead + ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Guariti', percentage: this.formatHundreds(this.currentRecovered + ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Ricoverati', percentage: this.formatHundreds(this.currentHospedalized + ''), cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: '', header: 'Terapia intensiva', percentage: this.formatHundreds(this.currentIntesiveCare + ''), cols: 2, rows: 2, color: '#b3e0ff' },
          { footer: '', header: 'Isolamento domiciliare', percentage: this.formatHundreds(this.currentHomeIsolation + ''), cols: 2, rows: 2, color: '#99d6ff' },
          { footer: '', header: 'Tamponi', percentage: this.formatHundreds(this.currentTests + ''), cols: 2, rows: 2, color: '#99d6ff' }
        ];

      }
    }, error => {
      this.tiles = [];
      this.genericTiles = [];
    });
  }

  private formatHundreds(s: String) {
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  private eraseAllData() {
    this.totalCases = null;
    this.totalPositives = null;
    this.totalDead = null;
    this.totalDeadIncrease = null;
    this.totalHospitalized = null;
    this.totalHospitalizedIncrease = null;
    this.totalIntensiveCare = null;
    this.totalIntensiveCareIncrease = null;
    this.totalTests = null;
    this.totalTestsIncrease = null;
    this.totalRecovered = null;
    this.totalRecoveredIncrease = null;
    this.totalNewCases = null;
    this.totalNewCasesVariation = null;
    this.resume = null;

    this.dataLabels = [];

    this.resumeDateLabels = [];
    this.resumeTotalValues = [];
    this.resumeNewValues = [];
    this.resumeRecoveredValues = [];
    this.resumeDeadValues = [];

    this.totalCasesValues = [];
    this.totalPositiveValues = [];

    this.totalNewCaseValues = [];
    this.totalNewCaseVariationValues = [];

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
