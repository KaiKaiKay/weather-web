import { Routes } from '@angular/router';
import { WeatherListComponent } from './views/weather-list/weather-list.component';
import { FavoritesComponent } from './views/favorites/favorites.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'weatherList' },
  { path: 'weatherList', component: WeatherListComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: 'weatherList' }
];

