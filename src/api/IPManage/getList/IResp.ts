/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number,
    using: boolean,
    storage: boolean,
    ip_type: number,
    name: string,
    broadcast_type: number,
    broadcast_location: string,
    business_type: number,
    business_location: string,
    gateway_info: string,
    note: string,
  }[];
}