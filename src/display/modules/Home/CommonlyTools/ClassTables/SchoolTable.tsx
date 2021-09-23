import { Select } from 'antd';
const { Option } = Select;

import * as React from 'react';
import { Time } from 'src/dataModel/Notifications';
// import moment from 'moment';
/** Props接口，定义需要用到的Porps类型 */
export interface IProps {

}
/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState<T> {
    Table: object;
    TableList: [];
    first: [];
    selectclass: number | string;
    firstlevel: string[];
    secondlevel: object;
    selectgrade: number | string;
    line: string[];
    column: T[];
    type: number;
}
// 请求接口
import { classtable } from 'src/api';
// table组件
import Table from './Table';
/**
 * SpecialityInfoSearch
 */

class SchoolTable extends React.PureComponent<IProps, IState<Time>> {
    constructor(props: any) {
        super(props);
        this.state = {
            Table: {}, // 所有课表班级树形结构
            TableList: [], // 具体班级课表数据 表格渲染
            firstlevel: [], // 年级数组
            secondlevel: {
                // '2016': ['1', '2', '3'],
            }, // 班级年级数组
            first: [], // 班级渲染下拉
            selectclass: '', // 选择班级
            selectgrade: '', // 选择年级
            column: [{ range: '上午', time: '第一节' }, { range: '上午', time: '第二节' }, { range: '上午', time: '第三节' },
            { range: '上午', time: '第四节' }, { range: '下午', time: '第五节' },
            { range: '下午', time: '第六节' }, { range: '下午', time: '第七节' }],
            line: ['时段', '节数', '星期一', '星期二', '星期三', '星期四', '星期五'],
            type: 0,
        };
    }
    componentWillMount() {
        this.getschooltable();
    }
    getschooltable = async () => {
        const res = await classtable.getschooltable();
        console.log(res.results.data);
        if (res.results?.data) {
            this.setState({
                Table: res.results?.data
            }, () => {
                this.handletree(this.state.Table);
            });
        }
    }
    // 处理树形结构
    handletree = (data: any) => {
        let arr = [];
        let seobj = {};
        for (let [key, value] of Object.entries(data)) {
            arr.push(key);
            let searr = [];
            for (let [key] of Object.entries(value as any)) {
                searr.push(key);
            }
            seobj[key] = searr;
        }
        this.setState({
            firstlevel: arr,
            secondlevel: seobj,
        }, () => {
            this.setState({
                first: seobj[this.state.firstlevel[0]],
                selectgrade: this.state.firstlevel[0],
                selectclass: seobj[this.state.firstlevel[0]][0],
            }, () => {
                console.log(this.state.selectclass, this.state.selectgrade);
                console.log(this.state.Table[this.state.selectgrade][this.state.selectclass]);
                const list = this.state.Table[this.state.selectgrade][this.state.selectclass];
                this.setState({
                    TableList: list
                });
            });
        });
    }
    handleFirstChange = (value: any) => {
        this.setState({
            first: this.state.secondlevel[value],
            selectclass: this.state.secondlevel[value][0],
            selectgrade: value,
        }, () => {
            console.log(this.state.selectclass, this.state.selectgrade);
            console.log(this.state.Table[this.state.selectgrade][this.state.selectclass]);
            const list = this.state.Table[this.state.selectgrade][this.state.selectclass];
            this.setState({
                TableList: list
            });
        });
    }

    onSecondSecondChange = (value: any) => {
        this.setState({
            selectclass: value,
        }, () => {
            console.log(this.state.selectclass, this.state.selectgrade);
            console.log(this.state.Table[this.state.selectgrade][this.state.selectclass]);
            const list = this.state.Table[this.state.selectgrade][this.state.selectclass];
            this.setState({
                TableList: list
            });
        });
    }
    render() {
        const { first, firstlevel, } = this.state;
        return (
            <div>
                <div className="content">
                    <div className="page-content" >
                        <div>
                            <Select
                                value={this.state.selectgrade}
                                style={{ width: 120, marginRight: 20, }}
                                onChange={this.handleFirstChange}
                            >
                                {firstlevel.map(item => (
                                    <Option key={item}>{item}</Option>
                                ))}
                            </Select>
                            <Select
                                style={{ width: 120 }}
                                value={this.state.selectclass}
                                onChange={this.onSecondSecondChange}
                            >
                                {first.map(item => (
                                    <Option key={item}>{item}</Option>
                                ))}
                            </Select>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <Table datasource={this.state.TableList} line={this.state.line} column={this.state.column} type={this.state.type} />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default SchoolTable;