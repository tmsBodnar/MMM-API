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
    if (changes['modules']) {
      this.calculatePositions();
    }
  }
  calculatePositions(){
    this.modules.forEach(module => {
      const pos = Position.positions.filter(p => p.name === module.position);
      module['pos'] = pos[0];
    });
    if(this.modules.length > 0) {
      this.isPositionCalculated = true;
    }
  }
  filteredModules(className:string) : Module[]{
    return this.modules.filter(m => m.position === className);
  }
}
