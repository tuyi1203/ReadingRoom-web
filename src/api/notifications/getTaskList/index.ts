import IResult from 'src/dataModel/IResult';
import IReq from './IReq';
import IResp from './IResp';
import Urls from 'src/config/Urls';
import http from 'src/utils/ajaxUtils';
import { GetTaskResults } from 'src/dataModel/Notifications';
/**
 * 接口描述
 * @param param 参数，IReq类型
 */
async function getTaskList(param: IReq): Promise<IResult<IResp<GetTaskResults>>> {
    const resp = await http.get(Urls.getTasksInfoList, param);
    return resp;
}

export default getTaskList;