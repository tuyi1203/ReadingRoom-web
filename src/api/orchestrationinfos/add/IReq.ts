/** 
 * 入参数据数据接口
 */
export default interface IReq {
  datacenter: string | number;
  name: string;
  ip: string;
  port: number;
  username: string;
  password: string;
  heat_beat_group: number;
  orchestration_type: number;
  description: string;
}