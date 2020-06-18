/** 
 * 出参数据数据接口
 */
export default interface IResp {
  data: {
    id: number,
    type: number,
    achievement_type: string,
    award_date?: string,
    award_title?: string,
    award_level?: number,
    award_position?: string,
    award_authoriry_organization?: string,
    award_authoriry_country?: string,
    lecture_date?: string,
    lecture_content?: string,
    lecture_person?: string,
    lecture_organization?: string,
    achievement_files: any,
  };
}