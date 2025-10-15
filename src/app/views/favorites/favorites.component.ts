import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';
import { FavoriteItem } from '../../interfaces/favoriteInterface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  constructor(private fav: FavoritesService, private fb: FormBuilder) {}

  rows: (FavoriteItem & { editing?: boolean; form?: FormGroup })[] = [];

  tableHeaders = [
    { label: '縣市', class: 'stickyCol2' },
    { label: '時段一' },
    { label: '時段二' },
    { label: '時段三' },
    { label: '暱稱' },
    { label: '電話' },
    { label: '備註' },
    { label: '操作' },
  ];

  /** 當前頁數 */
  currentPage = 1;
  /** 可選每頁筆數 */
  pageSizeOptions: number[] = [5, 10, 20];
  /** 每頁筆數 */
  pageSize = this.pageSizeOptions[0];
  /** 可選每頁筆數 */
  get totalCount() {
    return this.rows.length;
  }
  /** 總頁數 */
  get totalPages() {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }
  /** 當頁資料筆數 */
  get pagedRows() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }

  /** 以 id 當作 trackBy 的依據 */
  trackById = (_: number, r: FavoriteItem) => r.id;

  /* 元件初始化 */
  ngOnInit() {
    this.loadData();
  }

  /** 從 localStorage 載入最愛清單 */
  loadData() {
    // 從 localStorage 取出最愛清單
    const list = this.fav.favlist();

    // 轉成畫面需要的結構
    this.rows = list.map((item) => ({
      ...item,
      selected: false,
      editing: false,
    }));

    // 重設分頁
    this.currentPage = 1;
  }

  /** 當前選取的筆數 */
  get selectedCount() {
    return this.rows.filter((r) => r.selected).length;
  }

  /** 判斷當頁是否全部勾選 */
  get isAllCheckedOnPage(): boolean {
    const page = this.pagedRows;
    return page.length > 0 && page.every((r) => r.selected);
  }

  /** 判斷當頁是否部分勾選 */
  get isPartialCheckedOnPage(): boolean {
    const page = this.pagedRows;
    const sel = page.filter((r) => r.selected).length;
    return sel > 0 && sel < page.length;
  }

  /** 當頁全選或全不選 */
  toggleAllOnPage(ev: Event) {
    const checked = (ev.target as HTMLInputElement).checked;
    this.pagedRows.forEach((r) => (r.selected = checked));
  }

  /** 移除選取的項目 */
  removeSelected() {
    const ids = this.rows.filter((r) => r.selected).map((r) => r.id);
    if (ids.length === 0) return;
    if (!confirm(`確定要從我的最愛中移除 ${ids.length} 筆嗎？`)) return;
    this.fav.removeFav(ids);
    this.loadData();
  }

  /** 單筆勾選處理 */
  onRowSelectedChange(ev: Event, row: any) {
    row.selected = (ev.target as HTMLInputElement).checked;
  }

  /** 開始編輯 */
  startEdit(row: any) {
    row.editing = true;
    row.form = this.fb.group({
      nickname: [
        row.nickname || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      phone: [
        row.phone || '',
        [
          Validators.pattern(/^\d{10}$/), // 10碼數字
          (c: { value: any }) =>
            /[\u4e00-\u9fff]/.test(c.value || '') ? { zhChar: true } : null,
        ],
      ],
      note: [row.note || ''],
    });
  }

  /** 取消編輯 */
  cancelEdit(row: any) {
    row.editing = false;
    row.form = undefined;
  }

  /** 儲存編輯 */
  saveEdit(row: any) {
    if (!row.form.valid) {
      row.form.markAllAsTouched();
      return;
    }
    const v = row.form.value;
    const updated: FavoriteItem = {
      ...row,
      nickname: v.nickname,
      phone: v.phone,
      note: v.note,
    };
    delete (updated as any).editing;
    delete (updated as any).form;
    delete (updated as any).selected;

    this.fav.updateFav(updated);
    // 更新畫面資料
    row.nickname = updated.nickname;
    row.phone = updated.phone;
    row.note = updated.note;
    this.cancelEdit(row);
  }

  /** 點擊上一頁 */
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  /** 點擊下一頁 */
  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  /** 分頁控制 */
  changePageSize(ev: Event) {
    this.pageSize = +(ev.target as HTMLSelectElement).value;
    this.currentPage = 1;
  }
}
