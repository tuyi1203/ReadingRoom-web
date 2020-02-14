/** 
 * 入参数据数据接口
 */
export default interface IReq {
  version: string; // 版本名称
  os: number; // 所属osid
  protocols_support: number[]; // 支持协议id数组
}