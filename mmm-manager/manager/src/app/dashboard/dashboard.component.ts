import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Module } from '../models/Module';
import { Position } from '../models/Position';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnChanges {

  @Input()
  modules: Module[] = [];
  isPositionCalculated = false;
  positions: Position[] = Position.positions;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['modules']) {
      console.log('modules changed');
      this.calculatePositions();
    }
  }
  calculatePositions(){
    this.modules.forEach(module => {
      
      const pos = Position.positions.filter(p => p.name === module.position);
      module['pos'] = pos[0];
      console.log(module);
    });
    this.isPositionCalculated = true;
  }
}
