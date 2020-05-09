/** 
 * 出参数据数据接口
 */
export default interface IResp {
  data: {
    id: number,
    category: string,
    user_id: number,
    summary?: string,
    kaohe?: string,
    warning?: string,
    punish?: string,
    niandu1?: string,
    niandu1_kaohe?: string,
    niandu2?: string,
    niandu2_kaohe?: string,
    niandu3?: string,
    niandu3_kaohe?: string,
    niandu4?: string,
    niandu4_kaohe?: string,
    niandu5?: string,
    niandu5_kaohe?: string,
  };
}