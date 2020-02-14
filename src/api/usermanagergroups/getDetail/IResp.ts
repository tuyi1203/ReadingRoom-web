/** 
 * 出参数据数据接口
 */
export default interface IResp {
  id: number;
  name: string;
  authorized_user_count: number;
  authorized_user_info: {
    id: number;
    role: number;
    username: string;
    domain_id: number;
    domain_name: string;
    email: string;
    telephone: string;
    email_msg: string;
    description: string;
  };
}