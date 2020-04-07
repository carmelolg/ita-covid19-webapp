import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Tile } from '../shared/model/Tiles';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, AfterViewInit {

  constructor() { }

  tiles: Tile[] = [];
  breakpoint: number;

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 1024) ? 1 : 3;

    this.tiles = [
      { footer: 'Owner', header: 'Carmelo La Gamba', imgUrl: '../../assets/us/carmelolg.png', url: 'https://github.com/carmelolg', cols: 1, rows: 4, color: '#009247' },
      { footer: 'Contributor', header: 'Ferdinando Primerano', imgUrl: '../../assets/us/ferd.png', url: 'https://github.com/levia', cols: 1, rows: 4, color: '#FFFFFF' },
      { footer: 'Contributor', header: 'Francesco Zicaro', imgUrl: '../../assets/us/zicaro.png', url: 'https://github.com/frazzaglia', cols: 1, rows: 4, color: '#ce2b37' }
    ];
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1024) ? 1 : 3;
  }

}
