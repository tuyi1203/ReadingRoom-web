/** 
 * 入参数据数据接口
 */
export default interface IReq {
    ip: string;
    netmask: string;
    contract: string;
    id?: string;
    segment_ips: any;
}