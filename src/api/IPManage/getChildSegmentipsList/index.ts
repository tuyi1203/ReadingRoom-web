import IResult from 'src/dataModel/IResult';
import IReq from './IReq';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function getChildSegmentipsList(childId: string, param: IReq): Promise<IResult<IResp>> {
  const resp = await http.get(Urls.getChildSegmentipsList.replace('{child_ID}', childId), param);
  return resp;
}

export default getChildSegmentipsList;