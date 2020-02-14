/** 
 * 入参数据数据接口
 */
export default interface IReq {
  name: string;
  ip: string;
  port: number;
  user_id: number;
  device_type_id: number;
  net_element_device_type_id: number;
  location_info: string;
  net_element_id: number;
  data_center_id: number;
}