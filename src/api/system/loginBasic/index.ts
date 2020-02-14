import IResult from 'src/dataModel/IResult';
import IReq from '../login/IReq';
import IResp from '../login/IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 本地登录
 */
async function loginBasic(param: IReq): Promise<IResult<IResp>> {
  const resp = await http.post(Urls.basicLogin, param);
  return resp;
}

export default loginBasic;