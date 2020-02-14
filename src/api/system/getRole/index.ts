import IResult from 'src/dataModel/IResult';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 登录
 * @param param 登录参数，IReq类型
 */
async function getRole(): Promise<IResult<IResp>> {
  const resp = await http.get(Urls.getRoleListUnLogin, null);
  return resp;
}

export default getRole;