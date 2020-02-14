/** 
 * 入参数据数据接口
 */
export default interface IReq {
  name: string;
  method: number;
  interval: number;
  wait: number;
  warning: number;
}