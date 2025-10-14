export interface FavoriteItem {
  id: string;                 // 縣市代碼
  locationName: string;       // 縣市
  times: { value: string; unit?: string }[]; // 預報時間陣列 
  nickname: string;           // 暱稱
  phone?: string;             // 聯絡電話
  note?: string;              // 備註
  createdAt: number;          // 收藏時間
  selected?: boolean;         // 是否被選取
}