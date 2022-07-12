import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../models/Config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getModules(): Observable<Config> {
    return this.http.get<Config>('http://localhost:3000/api/config').pipe();
  }

  saveConfig(config: Config): Observable<Config> {
    return this.http
      .put<Config>('http://localhost:3000/api/config', config)
      .pipe();
  }
}
