import IResult from 'src/dataModel/IResult';
import IReq from './IReq';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function getTeacherTeachDetail(param: IReq, id: number): Promise<IResult<IResp>> {
  const resp = await http.get(Urls.getTeacherTeachDetail.replace('{id}', id.toString()), param);
  return resp;
}

export default getTeacherTeachDetail;