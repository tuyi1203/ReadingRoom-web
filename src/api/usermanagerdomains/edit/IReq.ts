/** 
 * 入参数据数据接口
 */
export default interface IReq {
  id: number;
  name: string;
  description: string;
  internal_domain: boolean;
  group_count?: number;
  domain_admin_role_count?: number;
  create_date?: string;
  modules?: any;
  admin_user_info?: any;
}