/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number;
    description: string | null;
    name: string;
  }[];
}