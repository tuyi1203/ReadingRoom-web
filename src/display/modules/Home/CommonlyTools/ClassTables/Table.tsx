import * as React from 'react';
import IResp from 'src/api/classtable/getpersontable/IResp';
import { Time } from 'src/dataModel/Notifications';
// import moment from 'moment';
/** Props接口，定义需要用到的Porps类型 */
export interface IProps<T> {
    datasource: IResp[];
    line: string[];
    column: T[];
    type: number; // 类型1个人0学校
}
/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {

}
// tablecss
import './table.css';
/**
 * SpecialityInfoSearch
 */
class Table extends React.PureComponent<IProps<Time>, IState> {
    constructor(props: any) {
        super(props);
    }
    componentDidUpdate() {
        console.log(this.props);
    }
    render() {
        const { line, column, datasource, type } = this.props;
        return (
            <div>
                {
                    this.props.datasource && (
                        <div className="table">
                            <div className="tr_1">
                                {
                                    line.map((item, index) => {
                                        return (
                                            <div className="th_1" key={index}>{item}</div>
                                        );
                                    })
                                }
                            </div>

                            {
                                column.map((item, index) => {
                                    return (
                                        <div className="tr_2" key={index}>
                                            {
                                                line.map((ite, ind) => {
                                                    return (
                                                        ind === 0 && (index === 0 || index === 4) ? (<td className="td" rowSpan={index === 0 ? 4 : 3}>{item.range}</td>) :
                                                            (ind === 1 ? <div className="td">{item.time}</div> : ind !== 0 ? <div className="td">
                                                                {
                                                                    datasource.map((it, id) => {
                                                                        return (
                                                                            type ? ((it.dayOfWeek === ite && it.orderOfDay === item.time) ? it.classNo : ' ')
                                                                                : ((it.dayOfWeek === ite && it.orderOfDay === item.time) ?
                                                                                (it.isMine === 1 ? <div className="myclassbox">{it.subject}<span className="myclass">我</span></div> : it.subject) : '')
                                                                        );
                                                                    })
                                                                }</div> : '')
                                                    );
                                                })
                                            }
                                        </div>

                                    );
                                })
                            }
                        </div>
                    )
                }
            </div >
        );
    }
}

export default Table;
