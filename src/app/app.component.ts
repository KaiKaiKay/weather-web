import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftSidebarComponent } from './layouts/left-sidebar/left-sidebar.component';
import { MainComponent } from './layouts/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeftSidebarComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize') //@HostListener 監聽視窗大小改變事件

  /** 當視窗大小改變 就更新 screenWidth 的值 
   * 如果視窗寬度小於 768 像素
   * 就將 isLeftSidebarCollapsed 設置為 true（折疊側邊欄）*/
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  /** 初始化時 判斷側邊欄是否折疊 */
  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768); 
  }

  /** 接收 LeftSidebarComponent 事件，更新 isLeftSidebarCollapsed 的值 */
  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed); 
  }
}
