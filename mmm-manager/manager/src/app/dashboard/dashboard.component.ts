import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Module } from '../models/Module';
import { Position } from '../models/Position';

import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from './dialog/edit-dialog/edit-dialog.component';
import { ModuleConfig } from '../models/ModuleConfig';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnChanges {
  @Input()
  modules: Module[] = [];
  isPositionCalculated = false;
  positions: Position[] = Position.positions;
  panelOpenState = false;
  private configItems: ModuleConfig = {};

  constructor(public dialogRef: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modules']) {
      this.calculatePositions();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    let module = event.item.data as Module;
    const prevPosId = event.previousContainer.id;
    const newPosId = event.container.id;
    if (prevPosId !== newPosId) {
      let prevPos = this.positions.filter((p) => p.name === prevPosId);
      let newPos = this.positions.filter((p) => p.name === newPosId);
      module.pos = newPos[0];
      module.position = newPos[0].name;
      newPos[0].modules?.push(module);
      prevPos[0].modules?.splice(prevPos[0].modules.indexOf(module), 1);
    }
  }
  onModuleClicked(module: Module) {
    this.configItems = {};
    this.configItems['header'] =
      module.header !== undefined ? module.header : '';
    if (module.config !== undefined) {
      this.processNestedConfig(module.config, false);
    }
    const dialogRef = this.dialogRef.open(EditDialogComponent, {
      data: { config: this.configItems, title: module.module },
      disableClose: true,
      closeOnNavigation: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      const res = result as ModuleConfig;
      if (res) {
        this.setModuleConfigFromResult(res, module);
      }
    });
  }

  calculatePositions() {
    this.modules.forEach((module) => {
      const pos = Position.positions.filter((p) => p.name === module.position);
      if (pos.length > 0) {
        module['pos'] = pos[0];
        pos[0].rowspan =
          pos[0].rowspan < 2 ? pos[0].rowspan + 1 : pos[0].rowspan + 0.5;
      }
    });
    this.positions.forEach((position) => {
      position.modules = [];
      const mods = this.modules.filter((m) => {
        return m.pos?.name === position.name;
      });
      position.modules = mods;
    });
    if (this.modules.length > 0) {
      this.isPositionCalculated = true;
    }
  }

  private setModuleConfigFromResult(res: ModuleConfig, module: Module) {
    if (res['header'] !== '' && res['header'] !== undefined) {
      module['header'] = res['header'] as string;
    }
    delete res['header'];
    if (module.config !== undefined) {
      module.config = res;
    }
  }

  private processNestedConfig(conf: ModuleConfig, isNested: boolean) {
    Object.keys(conf).forEach((key) => {
      if (Array.isArray(conf[key as keyof ModuleConfig])) {
        const array = conf[key as keyof ModuleConfig] as Array<any>;
        array.forEach((element) => {
          this.processNestedConfig(element, true);
        });
      } else if (typeof conf[key as keyof ModuleConfig] === 'object') {
        this.processNestedConfig(
          conf[key as keyof ModuleConfig] as ModuleConfig,
          true
        );
      }
      if (!isNested) {
        this.configItems[key] = conf[key as keyof ModuleConfig];
      }
    });
  }
}
