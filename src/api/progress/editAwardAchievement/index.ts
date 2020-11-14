import IResult from 'src/dataModel/IResult';
import IReq from './IReq';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function editAwardAchievement(id: number, param: IReq): Promise<IResult<IResp>> {
  const resp = await http.put(Urls.editAwardAchievement.replace('{id}', id.toString()), param);
  return resp;
}

export default editAwardAchievement;