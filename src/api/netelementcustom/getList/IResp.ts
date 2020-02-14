/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number,
    type_name: string,
    capability_name: string,
    capability_desc: string
  }[];
}