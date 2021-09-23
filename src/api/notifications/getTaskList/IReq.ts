/** 
 * 入参数据数据接口
 */
export default interface IReq {
    page_size?: number;
    page?: number;
    sort?: string;
    type?: 'distribute_food' | 'after_class_service';
    month?: string;
}