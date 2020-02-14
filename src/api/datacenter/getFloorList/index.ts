import IResult from 'src/dataModel/IResult';
import IReq from './IReq';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function getFloorList(param?: IReq): Promise<IResult<IResp[]>> {
  const resp = await http.get(Urls.getFloorList, param);
  return resp;
}

export default getFloorList;