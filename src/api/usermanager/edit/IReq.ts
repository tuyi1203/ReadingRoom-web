/** 
 * 入参数据数据接口
 */
export default interface IReq {
  username: string;
  description: string | null;
  telephone: string;
  role: number;
  alias_name: string | null;
  domain_id: number | null;
  domain_name: string;
  email: string;
  email_msg: string | null;
  validate: boolean;
  group_ids: [];
}