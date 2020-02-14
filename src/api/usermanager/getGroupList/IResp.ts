/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    authorized_user_count: number,
    create_date: string,
    description: string,
    domain_id: number,
    domain_name: string,
    id: number,
    modules: any,
    name: string,
  }[];
}