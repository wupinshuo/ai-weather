/** 金价数据 */
export interface GoldItem {
  /** 金价名称 */
  name: string;
  /** 金价ID */
  goldId: string;
  /** 金价价格 */
  price: number;
}

/** 金价数据响应 */
export interface GoldResponse {
  /** 金价数据响应 */
  data: {
    /** 金价数据列表 */
    list: GoldItem[];
  };
}

/** 历史金价数据项 */
export interface GoldHistoryItem {
  /** 金价名称 */
  name: string;
  /** 金价价格 */
  price: number;
  /** 时间戳 */
  timestamp: number;
}

/** 历史金价数据响应 */
export interface GoldHistoryResponse {
  /** 历史金价数据列表 */
  list: GoldHistoryItem[];
  /** 总数 */
  total: number;
  /** 天数 */
  days: number;
}
