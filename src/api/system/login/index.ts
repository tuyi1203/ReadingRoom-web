import IResult from 'src/dataModel/IResult';
import IReq from './IReq';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 登录
 * @param param 登录参数，IReq类型
 */
async function login(param: IReq): Promise<IResult<IResp>> {
  const resp = await http.post(Urls.login, param);
  return resp;
}

export default login;