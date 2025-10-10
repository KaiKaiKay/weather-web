import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiEnvironment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http:HttpClient) { }

  public getData(url: string):Observable<any>{
    const apiUrl:string = `${apiEnvironment.openWeatherDataApiUrl}/${url}`;
    const headers = { 'accept': 'application/json' };
    return this.http.get<any>(apiUrl, { headers });
  }
}
