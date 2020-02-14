import IResult from 'src/dataModel/IResult';
import IReq from './IReq';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';
// import * as _ from 'lodash';
// import moment from 'moment';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function add(param: IReq): Promise<IResult<IResp>> {
  const resp = await http.post(Urls.addUser, param);
  return resp;
}

export default add;