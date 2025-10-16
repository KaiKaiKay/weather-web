export interface FavoriteItem {
  id: string; //ID
  locationName: string; //縣市
  times: { // 預報時間陣列 
    value: string; //值
    unit?: string; //單位
    startTime: string; //開始時間
    endTime: string; //結束時間
  }[];
  elementName: string; //天氣因子
  elementNameDes: string; //天氣因子中文
  nickname: string; //暱稱
  phone?: string; //電話
  note?: string; //備註
  createdAt: number; //建立時間
  selected?: boolean; //是否選取  
}
