/** 
 * 出参数据数据接口
 */
import IRespList from '../getVendorList/IResp';
export default interface IResp {
  count: number;
  data: IRespList[];
}