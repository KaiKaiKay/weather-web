import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiEnvironment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  /** 取得天氣資料
   * @param url API 的 URL 片段
   * @returns Observable<any> 回傳一個 Observable 物件，包含 API 回傳的資料
   */
  public getData(url: string): Observable<any> {
    const apiUrl: string = `${apiEnvironment.openWeatherDataApiUrl}/${url}`;
    const headers = { accept: 'application/json' };
    return this.http.get<any>(apiUrl, { headers });
  }
}
