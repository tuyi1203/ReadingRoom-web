import IResult from 'src/dataModel/IResult';
// import IReq from './IReq';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function getList(param: any): Promise<IResult<IResp>> {
  const resp = await http.get(Urls.getSegmentipsList, param);
  return resp;
}

export default getList;