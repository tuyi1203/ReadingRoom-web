import * as React from 'react';
// import moment from 'moment';
import {
    Form,
    Tabs
} from 'antd';
const { TabPane } = Tabs;
/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
    form: any;
}
/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {

}
// 个人课表组件
import PersonalTable from './PersonalTable';
// 全校课表组件
import SchoolTable from './SchoolTable';
/**
 * SpecialityInfoSearch
 */
class SpecialityInfoSearch extends React.PureComponent<IProps, IState> {
    constructor(props: any) {
        super(props);
    }
    callback = (key: any) => {
        console.log(key);
    }

    render() {
        return (
            <div>
                <div className="layout-breadcrumb">
                    <div className="page-name">
                        课表管理
                        {/* <CurrentPage /> */}
                    </div>
                    {/* <div className="page-button"> 
              </div> */}
                </div>
                <div className="content">
                    <div className="page-content" >
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab="全校课表" key="1">
                                <SchoolTable />
                            </TabPane>
                            <TabPane tab="个人课表" key="2">
                                <PersonalTable />
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div >
        );
    }
}

export default Form.create({})(SpecialityInfoSearch);