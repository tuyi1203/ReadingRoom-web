import IResult from 'src/dataModel/IResult';
import IReq from './IReq';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 编辑权限
 */
async function editAuth(id: number, param: IReq): Promise<IResult<IResp>> {
  const resp = await http.put(Urls.editAuthGroup.replace('{id}', id.toString()), param);
  return resp;
}

export default editAuth;