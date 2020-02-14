/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number,
    name: string,
    ip: string,
    port: number,
    location_info: string,
    user: {
      id: number,
      username: string,
      password: string,
      group: string,
    },
    device_type: {
      id: number,
      type_name: string,
      capability_name: string,
      capability_desc: string,
    },
    net_element: {
      id: number,
      vendor: string,
      os: string,
      version: string,
      protocols_support: {
        id: number,
        name: string,
      }[],
    },
    data_center: {
      id: number,
      nation: string,
      nation_abbreviation: string,
      city: string,
      city_abbreviation: string,
      room: string,
      floor: number,
    } | null,
  }[];
}