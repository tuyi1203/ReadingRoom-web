/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number,
    nation: string,
    nation_abbreviation: string,
    city: string,
    city_abbreviation: string,
    room: string,
    floor: number,
  }[];
}