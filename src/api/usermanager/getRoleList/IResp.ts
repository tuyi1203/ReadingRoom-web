/** 
 * 出参数据数据接口
 */
export default interface IResp {
  total: number;
  data: {
    id: number,
    name: string,
    name_zn: string,
    created_at: string,
    updated_at: string,
    role: string,
    permissions: any[],
  }[];
}