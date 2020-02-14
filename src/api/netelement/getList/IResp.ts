/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number,
    vendor: string,
    os: string,
    version: string,
    protocols_support: {
      id: number,
      name: string
    }[]
  }[];
}