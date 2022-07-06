import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Config } from '../models/Config';
import { Module } from '../models/Module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MatDialog } from '@angular/material/dialog';
import { RemoveDialogComponent } from './remove-dialog/remove-dialog.component';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  config: Config;
  modules: Module[] = [];

  @ViewChild('dashboard')
  dashboard: DashboardComponent;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private apiService: ApiService,
    public dialogRef: MatDialog
  ) {}

  onSaveClicked() {
    console.log('save clicked', this.modules);
  }
  async onLoadClicked() {
    this.config = await lastValueFrom(this.apiService.getModules());
    this.modules = this.config.modules;
    this.dashboard.modules = this.modules;
  }

  onRemoveClicked() {
    const dialogRef = this.dialogRef.open(RemoveDialogComponent, {
      data: { modules: this.modules },
    });
    const temp = this.config.modules;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const modulesToRemove: Module[] = result;
        modulesToRemove.forEach((module) => {
          temp.forEach((configModule, index) => {
            if (module.module === configModule.module) {
              temp.splice(index, 1);
            }
          });
        });
        this.config.modules = temp;
        this.config.modules.forEach((module) => {
          delete module.pos;
        });
        this.updateConfig(this.config);
      }
    });
  }
  onAddClicked() {
    console.log('add clicked');
  }
  private async updateConfig(config: Config) {
    await this.apiService.saveConfig(config);
    this.onLoadClicked();
  }
}
