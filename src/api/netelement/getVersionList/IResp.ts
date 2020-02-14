/** 
 * 出参数据数据接口
 */
export default interface IResp {
  id: number;
  protocols_support: {
    id: number,
    name: string
  }[];
  version: string;
  os: number;
}