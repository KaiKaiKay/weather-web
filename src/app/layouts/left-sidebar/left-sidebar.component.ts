import { Component, input, output } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, NgClass],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss',
})
export class LeftSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  navItems = [
    {
      routeLink: 'weatherList',
      icon: 'fal fa-solid fa-cloud-sun',
      label: '氣象查詢',
    },
    {
      routeLink: 'favorites',
      icon: 'fal fa-solid  fa-star',
      label: '我的最愛',
    },
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
