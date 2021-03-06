import IResult from 'src/dataModel/IResult';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function delVersion(id: number): Promise<IResult<IResp>> {
  const resp = await http.delete(Urls.delVersion.replace('{id}', id.toString()), null);
  return resp;
}

export default delVersion;