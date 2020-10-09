import IResult from 'src/dataModel/IResult';
import IReq from './IReq';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function editDictData(param: IReq, id: number): Promise<IResult<IResp>> {
  const resp = await http.put(Urls.editDictData.replace('{id}', id.toString()), param);
  return resp;
}

export default editDictData;