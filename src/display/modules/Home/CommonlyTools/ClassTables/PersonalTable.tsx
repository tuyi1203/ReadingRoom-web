import * as React from 'react';
// import moment from 'moment';
import IResp from 'src/api/classtable/getpersontable/IResp';
import { Time } from 'src/dataModel/Notifications';
import { Switch, Row, Col, message } from 'antd';
/** Props接口，定义需要用到的Porps类型 */
export interface IProps {

}
/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState<T> {
    datasource: IResp[];
    line: string[];
    column: T[];
    type: number;
    attend_class: boolean;
}
// 请求接口
import { classtable, notifications } from 'src/api';
// table组件
import Table from './Table';
import { SwitchChangeEventHandler } from 'antd/lib/switch';
/**
 * SpecialityInfoSearch
 */
class PersonalTable extends React.PureComponent<IProps, IState<Time>> {
    constructor(props: any) {
        super(props);
        this.state = {
            datasource: [],
            column: [{ range: '上午', time: '第一节' }, { range: '上午', time: '第二节' },
            { range: '上午', time: '第三节' }, { range: '上午', time: '第四节' },
            { range: '下午', time: '第五节' }, { range: '下午', time: '第六节' }, { range: '下午', time: '第七节' }],
            line: ['时段', '节数', '星期一', '星期二', '星期三', '星期四', '星期五'],
            type: 1,
            attend_class: true,
        };
    }
    componentDidMount() {
        this.getPersonalTable();
        this.getswitchinfo();
    }
    getPersonalTable = async () => {
        const res = await classtable.getpersontable();
        if (res.results?.data) {
            this.setState({
                datasource: res.results?.data
            });
        }

    }
    // 获取开关信息
    getswitchinfo = async () => {
        const res = await notifications.switchinfo();
        if (res.results?.data) {
            res.results.data.forEach((item: any) => {
                if (item.notification_type === 'attend_class') {
                    this.setState({
                        attend_class: item.state ? true : false
                    });
                }
            });
        }
    }
    onChange: SwitchChangeEventHandler = async (checked) => {
        this.setState({
            attend_class: checked
        });
        let params = {
            type: 'attend_class',
            state: checked ? 1 : 0
        };
        const res = await notifications.setNoticeSwitch(params);
        if (res.code === 0) {
            message.success('消息通知设置成功');
        } else {
            message.error(res.msg);
        }
    }
    render() {
        return (
            <div>
                <div className="content">
                    <div className="page-content" >
                        <div style={{ marginBottom: 30, color: '#aaaaaa', fontSize: 14, fontFamily: 'PingFangSC-Regular, PingFang SC' }}>
                            <Row>
                                <Col span={2}>
                                    <span>微信提醒</span>
                                </Col>
                                <Col span={2}>
                                    <Switch checked={this.state.attend_class} onChange={this.onChange} />
                                </Col>
                                <Col span={10}>
                                    <span>设置提醒后，课表会提前5min通过微信提醒</span>
                                </Col>
                            </Row>

                        </div>
                        <div>
                            <Table datasource={this.state.datasource} line={this.state.line} column={this.state.column} type={this.state.type} />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default PersonalTable;
