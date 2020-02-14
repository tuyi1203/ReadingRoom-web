/** 
 * 入参数据数据接口
 */
import IPagging from 'src/dataModel/IPagging';
export default interface IReq extends IPagging {
  vendor?: number; // 所属vendor
}