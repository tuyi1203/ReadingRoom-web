/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number;
    name: string;
    authorized_user_count: number;
    modules: any;
    domain_id: number;
    domain_name: string;
    description: string;
    create_date: string;
  }[];
}