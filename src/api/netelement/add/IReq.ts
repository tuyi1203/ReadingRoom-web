/** 
 * 入参数据数据接口
 */
export default interface IReq {
  vendor: string;
  os: string;
  version: string;
  protocols_support: number[];
}