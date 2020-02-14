/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number,
    name: string,
    internal_domain: boolean,
    modules: any,
    group_count: number,
    domain_admin_role_count: number,
    description: string,
    create_date: string,
  }[];
}