/** 
 * 出参数据数据接口
 */
export default interface IResp {
  total: number;
  data: {
    id: number,
    name: string,
    // group_ids: number[],
    // domain_name: string,
    user_info: any[],
    roles: any[],
    // alias_name: string,
    // domain_id: number,
    created_at: string,
    updated_at: string,
    email: string,
    mobile: string,
    is_active: number,
  }[];

}