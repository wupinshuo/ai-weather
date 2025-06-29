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
