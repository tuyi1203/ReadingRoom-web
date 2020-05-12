/** 
 * 出参数据数据接口
 */
export default interface IResp {
  data: {
    gradute_school: string,
    graduate_time: string,
    education: string | number,
    education_no: string,
    degree_no: string,
    subject: string,
    experiences: [{
      start_year?: string,
      start_month?: string,
      end_year?: string,
      end_month?: string,
      education?: string | number,
      prove_person?: string,
      order_sort?: number,
    }],
  };
}