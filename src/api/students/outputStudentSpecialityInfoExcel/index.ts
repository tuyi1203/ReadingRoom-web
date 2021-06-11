// import IResult from 'src/dataModel/IResult';
import IFResult from 'src/dataModel/IFResult';
import IReq from './IReq';
// import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';

/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function outputStudentSpecialityInfoExcel(param: IReq): Promise<IFResult> {
  const resp = await http.getFile(Urls.outputStudentSpecialityInfoExcel, param);
  return resp;
}

export default outputStudentSpecialityInfoExcel;