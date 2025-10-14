import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { apiEnvironment } from '../../../environments/environment';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  TimeCell,
  TimeHeader,
  WeatherApiResponse,
  WeatherRowData,
} from '../../interfaces/weatherListInterface';
import { FavoritesService } from '../../services/favorites.service';
import { FavoriteItem } from '../../interfaces/favoriteInterface';
@Component({
  selector: 'app-weather-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './weather-list.component.html',
  styleUrl: './weather-list.component.scss',
})
export class WeatherListComponent {
  constructor(
    private weatherService: WeatherService,
    private fb: FormBuilder,
    private fav: FavoritesService
  ) {}

  /** 天氣查詢條件 */
  form: FormGroup = new FormGroup({});

  /** 總筆數 */
  totalCount = 0;
  /** 每頁筆數 */
  pageSize = 10;
  /** 當前頁數 */
  currentPage = 1;
  /** 可選每頁筆數 */
  pageSizeOptions: number[] = [5, 10, 20];
  /** 總頁數 */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  /** 是否顯示查詢結果 */
  isShowTable = false;

  /** 時段表頭
   * 三段時段：00:00–06:00、06:00–12:00、12:00–18:00
   */
  timeHeaders: TimeHeader[] = [];
  /** 查詢結果列 */
  rows: WeatherRowData[] = [];
  /** 當頁資料筆數 */
  get pagedRows(): WeatherRowData[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }

  /** 已選筆數 */
  selectedCount = 0;
  /** 當頁全選狀態 */
  allCheckedOnPage = false;
  /** 當頁部分勾選狀態 */
  partialCheckedOnPage = false;

  /** 台灣縣市列表 */
  cities: { [key: string]: string } = {
    宜蘭縣: '宜蘭縣',
    花蓮縣: '花蓮縣',
    臺東縣: '臺東縣',
    澎湖縣: '澎湖縣',
    金門縣: '金門縣',
    連江縣: '連江縣',
    臺北市: '臺北市',
    新北市: '新北市',
    桃園市: '桃園市',
    臺中市: '臺中市',
    臺南市: '臺南市',
    高雄市: '高雄市',
    基隆市: '基隆市',
    新竹縣: '新竹縣',
    新竹市: '新竹市',
    苗栗縣: '苗栗縣',
    彰化縣: '彰化縣',
    南投縣: '南投縣',
    雲林縣: '雲林縣',
    嘉義縣: '嘉義縣',
    嘉義市: '嘉義市',
    屏東縣: '屏東縣',
  };

  /** 天氣因子
   * 預報XML產品預報因子欄位中文說明表:
   * https://opendata.cwa.gov.tw/opendatadoc/MFC/A0012-001.pdf
   */
  weatherElements: { [key: string]: string } = {
    Wx: '天氣現象',
    MaxT: '最高溫度',
    MinT: '最低溫度',
    CI: '舒適度',
    PoP: '降雨機率',
  };

  /** 轉換成我的最愛格式 */
  private toFavorite(row: WeatherRowData): FavoriteItem {
    return {
      id: row.id,
      locationName: row.locationName,
      times: row.times.map((t) => ({ value: t.value, unit: t.unit })),
      nickname: row.locationName, // 預設地點名
      phone: '',
      note: '',
      createdAt: Date.now(),
    };
  }

  /** 初始化 */
  ngOnInit(): void {
    /** 天氣查詢條件表單初始化 */
    this.form = this.fb.group({
      city: [''],
      element: ['', Validators.required],
    });
  }

  /** 查詢天氣 */
  onSubmit(): void {
    if (!this.form.valid) {
      // 強制顯示所有驗證錯誤
      this.form.markAllAsTouched();
      return;
    }

    const city = this.form.get('city')?.value || '';
    const elementName = this.form.get('element')?.value;

    const url =
      `F-C0032-001?Authorization=${apiEnvironment.authorization}` +
      (city ? `&locationName=${encodeURIComponent(city)}` : '') +
      (elementName ? `&elementName=${encodeURIComponent(elementName)}` : '');

    this.isShowTable = true; // 顯示查詢結果
    this.resetResult(); // 重置查詢結果

    // call API 取得資料
    this.weatherService.getData(url).subscribe({
      next: (res) => this.buildTable(res, elementName),
      error: () => this.resetResult(),
    });
  }

  /** 清空查詢條件與結果 */
  onClear(): void {
    this.form.reset();
    this.form.patchValue({ city: '', element: '' });
    this.isShowTable = false;
    this.resetResult();
  }

  /** 建立表格資料 */
  private buildTable(res: WeatherApiResponse, elementName: string) {
    const locations = res.records.location ?? []; // 取得所有縣市陣列

    // 第一個地點
    const first = locations[0];
    // 找出指定查詢的天氣因子
    const firstElement = first?.weatherElement.find(
      (e) => e.elementName === elementName
    );
    // 取出三個時段: 00:00–06:00、06:00–12:00、12:00–18:00
    const times = firstElement?.time.slice(0, 3) ?? [];

    // 建立表頭: 時間轉換成 MM/DD HH:mm~HH:mm 格式
    this.timeHeaders = times.map((t) => ({
      start: t.startTime,
      end: t.endTime,
      label: this.formatRange(t.startTime, t.endTime),
    }));

    // 建立表格列
    this.rows = locations.map((location, idx) => {
      // 找出指定查詢的天氣因子
      const element = location.weatherElement.find(
        (e) => e.elementName === elementName
      );
      // 取得三個時段的值
      const tArr = element?.time ?? [];
      // 建立三個時段的值陣列
      const times: TimeCell[] = this.timeHeaders.map((_, i) => {
        const seg = tArr[i]; // 取得對應時段的值
        const value = seg?.parameter?.parameterName ?? '-'; // 值
        const unit = seg?.parameter?.parameterUnit ?? ''; // 單位

        // 判斷值的型態
        const kind: 'number' | 'text' = ['MaxT', 'MinT', 'PoP'].includes(
          elementName
        )
          ? 'number'
          : 'text';
        return { value, unit, kind };
      });

      return {
        id: `${location.locationName}-${idx}`, //  資料ID
        locationName: location.locationName, // 地點名稱
        times, // 三個時段的值陣列
        selected: false, // 是否被勾選
      } as WeatherRowData;
    });

    this.totalCount = this.rows.length; // 總筆數
    this.currentPage = 1; // 重置當前頁數
    this.recomputeSelectionMeta(); // 重算勾選筆數
  }

  /** 時間顯示格式化 */
  private formatRange(startTime: string, endTime: string): string {
    const start = new Date(startTime); // 開始時間
    const end = new Date(endTime); // 結束時間
    const pad = (n: number) => n.toString().padStart(2, '0'); // 補零: 0 -> 00

    // 回傳格式: MM/DD HH:mm~HH:mm
    return `${pad(start.getMonth() + 1)}/${pad(start.getDate())} ${pad(
      start.getHours()
    )}:00~${pad(end.getHours())}:00`;
  }

  /** 重置結果 */
  private resetResult() {
    this.timeHeaders = [];
    this.rows = [];
    this.totalCount = 0;
    this.currentPage = 1;
    this.selectedCount = 0;
    this.allCheckedOnPage = false;
    this.partialCheckedOnPage = false;
  }

  /** 勾選筆數計算 */
  recomputeSelectionMeta() {
    // 取得當前頁面的資料
    const page = this.pagedRows;
    // 計算當前頁面有幾筆資料被勾選
    const pageSelected = page.filter((r) => r.selected).length;
    // 計算所有頁面目前被勾選的資料總數
    this.selectedCount = this.rows.filter((r) => r.selected).length;

    // 判斷當前頁面是否全部被勾選
    this.allCheckedOnPage = page.length > 0 && pageSelected === page.length;
    // 判斷當前頁面是否部分被勾選
    this.partialCheckedOnPage = pageSelected > 0 && pageSelected < page.length;
  }

  /** 資料全選/全不選 */
  toggleAllOnPage(ev: Event) {
    const checked = (ev.target as HTMLInputElement).checked;
    this.pagedRows.forEach((r) => (r.selected = checked));
    this.recomputeSelectionMeta();
  }

  /** 取消所有頁面勾選資料 */
  clearSelection() {
    this.rows.forEach((r) => (r.selected = false));
    this.recomputeSelectionMeta();
  }

  /** 單筆勾選處理 */
  onRowCheckboxChange(event: Event, row: any) {
    const input = event.target as HTMLInputElement;
    row.selected = input.checked;

    // 重新計算勾選狀態
    this.recomputeSelectionMeta();
  }

  /** 分頁控制 */
  changePageSize(ev: Event) {
    const val = +(ev.target as HTMLInputElement).value;
    this.pageSize = val;
    this.currentPage = 1;
    this.recomputeSelectionMeta();
  }

  /** 點擊上一頁 */
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.recomputeSelectionMeta();
    }
  }

  /** 點擊下一頁 */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;

      // 重新計算勾選狀態
      this.recomputeSelectionMeta();
    }
  }

  /** 我的最愛 */
  addFavorites() {
    const selected = this.rows.filter((r) => r.selected);
    const favItems = selected.map((r) => this.toFavorite(r));

    // 儲存到 localStorage
    this.fav.upsertFav(favItems);
    alert(`已將 ${selected.length} 筆資料加入我的最愛`);

    // 取消勾選（當頁）
    this.pagedRows.forEach((r) => (r.selected = false));
    this.recomputeSelectionMeta();
  }
}
