import IFResult from 'src/dataModel/IFResult';
import IReq from './IReq';
// import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function download(id: number, param: IReq): Promise<IFResult> {
  const resp = await http.getFile(Urls.downloadFile.replace('{id}', id.toString()), param);
  return resp;
}

export default download;