/** 
 * 出参数据数据接口
 */
export default interface IResp<T> {
    data: T[];
    results?: {};
    code?: number;
    msg: string;
}