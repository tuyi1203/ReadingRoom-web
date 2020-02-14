export default interface IResult<T> {
  code: boolean;
  msg: string;
  results: T;
}