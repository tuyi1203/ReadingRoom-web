/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number;
    contract_num: string;
    business_entity: string;
    authorized_subject: string;
    purchase_channel_id: number;
    start_date: string;
    end_date: string;
    contract_remind: number;
    monetary_unit_id: number;
    burst_billing_id: number;
    burst_float: number;
    committed_fee: number;
  }[];
}