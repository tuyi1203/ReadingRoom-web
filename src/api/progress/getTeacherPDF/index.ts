import IFResult from 'src/dataModel/IFResult';
import IReq from './IReq';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function getTeacherPDF(param: IReq, id: number): Promise<IFResult> {
  const resp = await http.getFile(Urls.getTeacherPDF.replace('{id}', id.toString()), param);
  return resp;
}

export default getTeacherPDF;