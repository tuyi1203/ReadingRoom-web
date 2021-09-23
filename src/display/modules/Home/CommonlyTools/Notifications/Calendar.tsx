import React from 'react';
import { Calendar as Calendarand, Badge, Tooltip, Icon } from 'antd';
import './index.css';
/** Props接口，定义需要用到的Porps类型 */
export interface IProps<T> {
    TaskList: T[];
    showdelete: boolean;
    PanelChange: (e: any) => void;
    Selectchange: (e: any, item?: any) => void;
    handledelete: (e: any, item?: any) => void;
}
/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
    ischeckyear: boolean;
}
import { GetTaskResults, NoticeType } from 'src/dataModel/Notifications';
import { Moment } from 'moment';
class Calendar extends React.PureComponent<IProps<GetTaskResults>, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            ischeckyear: false,
        };
    }
    // 处理日历返回时间标准化
    handleTime = (date: Date) => {
        const year = new Date(date).getFullYear();
        const month = new Date(date).getMonth() + 1 < 10 ? `0${new Date(date).getMonth() + 1}` : new Date(date).getMonth() + 1;
        const day = new Date(date).getDate() < 10 ? `0${new Date(date).getDate()}` : new Date(date).getDate();
        return {
            year,
            month,
            day,
        };
    }
    getListData = (value: any) => {
        const { year, month, day } = this.handleTime(value);
        let listData: any = [];
        this.props.TaskList.forEach((res) => {
            if (new Date(res.plan_date as string).getTime() === new Date(`${year}-${month}-${day}`).getTime()) {
                if (res.notification_type === 'after_class_service') {
                    listData.push({ type: 'orange', content: `${NoticeType.after_class_service}(${res.plan_time})`, ...res });
                } else if (res.notification_type === 'distribute_food') {
                    listData.push({ type: 'green', content: `${NoticeType.distribute_food}(${res.plan_time})`, ...res });
                }
            }
        });
        return listData || [];
    }
    // 点击单条修改
    editnotice = (e: React.MouseEvent, item: any): any => {
        e.stopPropagation();
        this.props.Selectchange(e, item);
    }
    // 删除
    deletenotice = (e: React.MouseEvent, item: any): any => {
        e.stopPropagation();
        this.props.handledelete(e, item);
    }
    dateCellRender = (value: any) => {
        const listData = this.getListData(value);
        return (
            <ul className="events">
                {listData.map((item: any, index: number) => (
                    <Tooltip title={item.content}>
                        <li key={index} className="eventsli" onClick={(e) => this.editnotice(e, item)}>
                            <Badge status={item.type} text={item.content} />
                            {this.props.showdelete ? <Icon type="close" className="deleteicon" onClick={(e) => this.deletenotice(e, item)} /> : null}
                        </li>
                    </Tooltip>
                ))}
            </ul>
        );
    }

    monthCellRender = (value: any): any => {
        // let num = 0;
        // if (value.month() === 8) {
        //     num = 1394;
        // }
        // return num ? ( 
        //     <div className="notes-month">
        //         <section>{num}</section>
        //         <span>Backlog number</span>
        //     </div>
        // ) : null;
    }
    // 面板变化
    onPanelChange = (e: Moment, mode: any) => {
        if (mode === 'year') {
            this.setState({
                ischeckyear: true,
            });
        } else {
            this.setState({
                ischeckyear: false,
            });
        }
        if (!this.state.ischeckyear) {
            this.props.PanelChange(e);
        }
    }
    // 日期选择变化
    onSelect = (e: Moment) => {
        if (!this.state.ischeckyear) {
            this.props.Selectchange(e);
        }
    }
    render() {
        return (
            <div>
                <Calendarand dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} onPanelChange={this.onPanelChange} onSelect={this.onSelect} />
            </div>
        );
    }
}
export default Calendar;