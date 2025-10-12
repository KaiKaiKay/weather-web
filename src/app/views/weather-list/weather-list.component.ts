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
    private fb: FormBuilder
  ) {}

  /** 天氣查詢條件 */
  form: FormGroup = new FormGroup({});

  data: any = '';

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

  ngOnInit(): void {
    /** 天氣查詢條件表單初始化 */
    this.form = this.fb.group({
      city: ['', Validators.required],
      element: ['', Validators.required],
    });
  }

  /** 查詢天氣 */
  onSubmit(): void {
    if (this.form.valid) {
      const city = this.form.get('city')?.value;
      const elementName = this.form.get('element')?.value;
      const url = `F-C0032-001?Authorization=${apiEnvironment.authorization}&locationName=${city}&elementName=${elementName}`;

      this.weatherService.getData(url).subscribe((data) => {
        console.log(data);
        //待處理資料顯示
      });
    }
  }
}
