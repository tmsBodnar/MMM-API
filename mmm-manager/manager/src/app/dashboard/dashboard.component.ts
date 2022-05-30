import { CdkDragDrop } from '@angular/cdk/drag-drop';
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
      if(pos.length > 0){
        module['pos'] = pos[0];
        pos[0].rowspan = pos[0].rowspan < 2 ? pos[0].rowspan + 1 : pos[0].rowspan + 0.5;
      }
    });
    this.positions.forEach(position =>  {
      position.modules = [];
      const mods = this.modules.filter(m => {
       return  m.pos.name === position.name});
      position.modules = mods;
    });
    if(this.modules.length > 0) {
      this.isPositionCalculated = true;
    }
  }
  drop(event:  CdkDragDrop<string[]>){
    let module = event.item.data as Module;
    console.log(module);
    const prevPosId = event.previousContainer.id;
    const newPosId = event.container.id;
    if (prevPosId !== newPosId) {
      let prevPos = this.positions.find(p => p.name === prevPosId);
      let newPos = this.positions.find(p => p.name === newPosId);
      module.pos === newPos;
      newPos?.modules?.push(module);
      prevPos?.modules?.splice(prevPos.modules.indexOf(module),1);
    }
  }
}
