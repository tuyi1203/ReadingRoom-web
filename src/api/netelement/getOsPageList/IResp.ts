/** 
 * 出参数据数据接口
 */
import IRespList from '../getOsList/IResp';
export default interface IResp {
  count: number;
  data: IRespList[];
}