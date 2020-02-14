/** 
 * 入参数据数据接口
 */
export default interface IReq {
  start_date: string;
  end_date: string;
  renewal_start_date: string;
  renewal_end_date: string;
  contract_remind: number;
}