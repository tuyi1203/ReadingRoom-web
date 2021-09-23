import * as React from 'react';
// import moment from 'moment';
import _ from 'lodash';
import {
    Form,
} from 'antd';
/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
    form: any;
}
/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
    page: number;
    pageSize: number;
    total: number;
    achievementList: any;
    dictList: any;
    specialityTypeList: any;
    classList: any;
    showAdd: boolean;
    editAble: boolean;
    editData: any;
    filterItems: string[];
    filterParam: any;
    showAchievementDrawer: boolean;
    achievementDrawerData: any;
    uploadedFiles: any;
}
/**
 * SpecialityInfoSearch
 */
class SpecialityInfoSearch extends React.PureComponent<IProps, IState> {
    fileIdsForAddOrEdit: any[];
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <div>
                <div className="layout-breadcrumb">
                    <div className="page-name">
                        值周表
                        {/* <CurrentPage /> */}
                    </div>
                    {/* <div className="page-button">
            
          </div> */}
                </div>
                {/* <div className="content">
                <div className="page-content" >

                </div>
            </div> */}
            </div >
        );
    }
}

export default Form.create({})(SpecialityInfoSearch);