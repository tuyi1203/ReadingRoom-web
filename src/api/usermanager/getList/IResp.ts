/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number,
    group_ids: number[],
    domain_name: string,
    role: string,
    alias_name: string,
    domain_id: number,
    create_date: string,
    email: string,
    email_msg: string,
  }[];

}