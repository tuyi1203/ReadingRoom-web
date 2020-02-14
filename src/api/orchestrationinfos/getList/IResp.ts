/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number,
    name: string,
    ip: string,
    port: number,
    username: string,
    password: string,
    datacenter: string,
    role: number,
    roleInfo?: any,
    typeInfo?: any,
    lost_at: string,
    version: string,
    description: string,
    orchestration_type: number,
    heat_beat_group: number,
    heatBeatGroupInfo?: any,
  }[];
}