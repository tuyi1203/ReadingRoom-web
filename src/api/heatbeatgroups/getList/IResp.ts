/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number,
    interval: number,
    method: number,
    methodInfo?: {
      id: number,
      name: string,
    },
    name: string,
    wait: number,
    warning: number,
  }[];
}