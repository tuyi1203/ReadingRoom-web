export default interface IResult<T> {
    code: number;
    msg: string;
    results: T;
    data?: [];
    headers?: any;
}