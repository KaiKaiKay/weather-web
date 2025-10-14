import { Injectable } from '@angular/core';
import { FavoriteItem } from '../interfaces/favoriteInterface';

const KEY = 'weatherFavorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  constructor() {}

  /** 取得所有最愛清單 */
  favlist(): FavoriteItem[] {
    const raw = localStorage.getItem(KEY) || '[]';
    try {
      return JSON.parse(raw) as FavoriteItem[];
    } catch {
      return [];
    }
  }

  /** 儲存所有最愛清單 */
  saveAll(items: FavoriteItem[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
  }
  /** 新增或更新最愛清單 */
  upsertFav(newItems: FavoriteItem[]) {
    const map = new Map(this.favlist().map((it) => [it.id, it]));
    newItems.forEach((n) => map.set(n.id, n));
    this.saveAll(Array.from(map.values()));
  }

  /** 更新最愛清單 */
  updateFav(item: FavoriteItem) {
    const list = this.favlist();
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
      this.saveAll(list);
    }
  }

  /** 刪除最愛清單 */
  removeFav(ids: string[]) {
    this.saveAll(this.favlist().filter((x) => !ids.includes(x.id)));
  }

  /** 清空所有最愛清單 */
  clearFav() {
    this.saveAll([]);
  }
}
