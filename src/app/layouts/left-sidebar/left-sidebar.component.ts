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
  /** 側邊欄是否收合 */
  isLeftSidebarCollapsed = input.required<boolean>();
  /** 側邊欄收合狀態變更事件 */
  changeIsLeftSidebarCollapsed = output<boolean>();

  /** 側邊欄選單 */
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

  /** 側邊欄收合切換 */
  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  /** 關閉側邊欄 */
  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
