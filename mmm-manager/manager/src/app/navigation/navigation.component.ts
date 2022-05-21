import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Config } from '../models/Config';

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

    conf!: Config;

  constructor(private breakpointObserver: BreakpointObserver,
    private apiService: ApiService) {}

  onSaveClicked(){
    console.log("save clicked");
  }
  onLoadClicked(){
    let result = this.apiService.getModules().subscribe(cf => console.log(cf));
    
  }
  onResetClicked(){
    console.log("reset clicked");
  }
}
