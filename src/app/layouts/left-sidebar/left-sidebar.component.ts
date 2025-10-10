import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule,RouterLinkActive, NgClass],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss'
})
export class LeftSidebarComponent {
  navItems = [
    {
      routeLink: 'weatherList',
      icon: 'a-solid fa-cloud-sun',
      label: '氣象查詢'
    },
    {
      routeLink: 'favorites',
      icon: 'a-solid fa-star',
      label: '我的最愛'
    }
  ];
}
