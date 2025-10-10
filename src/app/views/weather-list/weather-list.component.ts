import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { apiEnvironment } from '../../../environments/environment';

@Component({
  selector: 'app-weather-list',
  standalone: true,
  imports: [],
  templateUrl: './weather-list.component.html',
  styleUrl: './weather-list.component.scss',
})
export class WeatherListComponent {
  constructor(private weatherService: WeatherService) {}

  data: any = '';

  ngOnInit(): void {
    this.getWeatherData();
  }

  getWeatherData(): void {
    const url = `F-C0032-001?Authorization=${apiEnvironment.authorization}`;

    this.weatherService.getData(url).subscribe((data) => {
      console.log(data);
      this.data = JSON.stringify(data, null, 2);
    });
  }
}
