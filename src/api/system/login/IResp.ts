/** 
 * 出参数据数据接口
 */
export default interface IResp {
  jwt: string;
  modules: {
    belong: number;
    icon: string;
    id: number;
    index: number;
    name: string;
    read: boolean;
    title_cn: string;
    title_en: string;
    uri: string;
    write: boolean;
  }[];
}