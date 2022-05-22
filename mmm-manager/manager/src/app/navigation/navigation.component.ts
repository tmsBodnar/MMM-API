import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { lastValueFrom, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Config } from '../models/Config';
import { Module } from '../models/Module';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

    config: Config;
    modules : Module[] = [];

    @ViewChild('dashboard')
    dashboard: DashboardComponent

  constructor(private breakpointObserver: BreakpointObserver, private apiService: ApiService) {}

  onSaveClicked(){
    console.log("save clicked");
  }
  async onLoadClicked(){
    this.config = await lastValueFrom(this.apiService.getModules());
    this.modules = this.config.modules;
    this.dashboard.modules = this.modules;
  }
  onResetClicked(){
    console.log("reset clicked");
  }
}
