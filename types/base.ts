/** 返回基础数据结构（默认添加 null & undefined类型） */
export type BaseResponse<T> = T | null | undefined;

/** 接口返回数据结构 */
export interface ReturnData<T> {
  /** 状态码 */
  status: number;
  /** 业务状态码 */
  code?: number;
  /** 返回数据 */
  data: T;
  /** 返回消息 */
  message?: string;
}
