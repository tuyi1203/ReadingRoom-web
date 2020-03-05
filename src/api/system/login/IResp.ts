/** 
 * 出参数据数据接口
 */
export default interface IResp {
  data: {
    access_token: string;
    token_type: string;
    permissions: any[];
    menus: any[];
    expires_at: string;
  };
}