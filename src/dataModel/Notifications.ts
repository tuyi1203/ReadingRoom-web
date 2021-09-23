// 请求任务列表参数类型
interface GetTaskparams {
    page_size?: number;
    page?: number;
    sort?: string;
    type?: 'distribute_food' | 'after_class_service';
    month?: string;
}

// 请求任务列表返回参数类型
interface GetTaskResult {
    created_at: string;
    id: number | string;
    notification_type: string;
    plan_date: string;
    plan_datetime: string;
    plan_time: string;
    [propName: string]: any;
}
// 类型处理 变为可选类型
type GetTaskResults = Partial<GetTaskResult>;

// 点击修改获取参数类型
interface EditItem {
    state: number | string;
    plan_date: string;
    plan_time: string;
    type: 'distribute_food' | 'after_class_service';
    [propName: string]: any;
}
// 类型处理 变为可选类型
type EditItems = Partial<EditItem>;

enum NoticeType {
    'after_class_service' = '延时服务',
    'distribute_food' = '打饭',
}
enum NoticeTypeEn {
    'after_class_service',
    'distribute_food',
}
interface Time {
    range: string;
    time: string;
}
export {
    GetTaskparams,
    GetTaskResults,
    NoticeType,
    EditItems,
    NoticeTypeEn,
    Time,
};