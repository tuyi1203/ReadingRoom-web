import * as React from 'react';
import {
  Drawer,
  Divider,
  // Col, 
  // Row,
  Tabs,
  message,
  Table
} from 'antd';
import _ from 'lodash';
// import DataDic from 'src/dataModel/DataDic';
import moment from 'moment';
import {
  progress
} from 'src/api';

import TeachDetailDrawer from './teachDetailDrawer';

const { TabPane } = Tabs;
// import CommonUtils from 'src/utils/commonUtils';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  // form: any;
  dictList: any;
  drawerData: any;
  onClose: any;
  visible: boolean;
  yesOrNoOptions: any;
  getOption: any;
  findLabel: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  listData: any;
  defaultActiveKey: string;
  attachList: any;
  showTeachDetialDrawer: boolean;
  teachDetailDrawerData: any;
}

/**
 * TeachDrawer
 */
class TeachDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      listData: null,
      defaultActiveKey: '1',
      attachList: [],
      showTeachDetialDrawer: false,
      teachDetailDrawerData: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
  }

  /**
   * 获取列表
   */
  getList = async () => {
    let params: any = {
      page_size: this.state.pageSize,
      page: this.state.page,
      type: 'teach',
      category: this.state.defaultActiveKey
    };

    const res = await progress.getTeacherBaseInfoDetail(params,
      this.props.drawerData.user_id);
    if (res.code) {
      message.error(res.msg);
      return;
    }
    if (res) {
      this.setState({
        listData: res.results.data.data,
      });
    }
  }

  render() {
    const {
      findLabel,
      // drawerData,
      onClose,
      yesOrNoOptions,
      getOption,
    } = this.props;

    /**
     * 改变选项卡
     */
    const changeTab = (val: string) => {
      // console.log(val);
      this.setState({
        defaultActiveKey: val,
        page: 1,
        pageSize: 10,
      }, () => {
        this.getList();
      });
    };

    const { listData, page, pageSize, total } = this.state;

    /**
     * 改变页大小
     */
    const changePageSize = (current: number, size: number) => {
      this.setState({
        pageSize: size
      }, () => {
        this.getList();
      });
    };

    /**
     * 改变分页
     */
    const changePage = (page: number) => {
      this.setState({
        page: page
      }, () => {
        this.getList();
      });
    };

    /*
    * 显示抽屉
    */
    const showDrawer = (record: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {
      if (achievementOrNot) {
        this.setState({
          showTeachDetialDrawer: true,
          teachDetailDrawerData: record
        });
      }
    };

    /*
    * 关闭抽屉
    */
    const onDrawerClose = (e: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {

      if (achievementOrNot) {
        this.setState({
          showTeachDetialDrawer: false,
          teachDetailDrawerData: null
        });
      }
    };

    let columns: any = [];
    if (this.state.defaultActiveKey === '1') {
      columns = [
        {
          title: '成果类型',
          key: 'achievement_type',
          dataIndex: 'achievement_type',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && findLabel(getOption('achievement_type'), text)}
              </span>
            );
          }
        },
        {
          title: '获奖时间',
          key: 'award_date',
          dataIndex: 'award_date',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && moment(text).format('YYYY-MM')}
              </span>
            );
          }
        },
        {
          title: '表彰主体(本人、本人所带班队、本人所带学生)',
          key: 'award_title',
          dataIndex: 'award_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '获奖等次',
          key: 'award_position',
          dataIndex: 'award_position',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && findLabel(getOption('award_position'), text)}
              </span>
            );
          }
        },
        {
          title: '本人作用',
          key: 'award_role',
          dataIndex: 'award_role',
          width: 200,
        },
      ];
    }

    if (this.state.defaultActiveKey === '2') {
      columns = [
        {
          title: '交流管理经验时间',
          key: 'manage_exp_communicate_date',
          dataIndex: 'manage_exp_communicate_date',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && moment(text).format('YYYY-MM')}
              </span>
            );
          }
        },
        {
          title: '交流管理经验内容',
          key: 'manage_exp_communicate_content',
          dataIndex: 'manage_exp_communicate_content',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '本人作用',
          key: 'manage_exp_communicate_role',
          dataIndex: 'manage_exp_communicate_role',
          width: 200,
        },
        {
          title: '交流范围',
          key: 'manage_exp_communicate_range',
          dataIndex: 'manage_exp_communicate_range',
          width: 200,
        },
      ];
    }

    if (this.state.defaultActiveKey === '3') {
      columns = [
        {
          title: '指导开始时间',
          key: 'teacher_guide_date_start',
          dataIndex: 'teacher_guide_date_start',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && moment(text).format('YYYY-MM')}
              </span>
            );
          }
        },
        {
          title: '指导结束时间',
          key: 'teacher_guide_date_end',
          dataIndex: 'teacher_guide_date_end',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && moment(text).format('YYYY-MM')}
              </span>
            );
          }
        },
        {
          title: '指导对象姓名',
          key: 'teacher_guide_name',
          dataIndex: 'teacher_guide_name',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '指导内容',
          key: 'teacher_guide_content',
          dataIndex: 'teacher_guide_content',
          width: 200,
        },
        {
          title: '指导效果及荣誉和备注',
          key: 'teacher_guide_effect',
          dataIndex: 'teacher_guide_effect',
          width: 200,
        },
      ];
    }

    return (
      <Drawer
        width={1200}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
      >
        <Divider orientation="left">教育成果信息</Divider>
        <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
          <TabPane tab="表彰奖励情况" key="1" />
          <TabPane tab="交流管理经验情况" key="2" />
          <TabPane tab="指导情况" key="3" />
        </Tabs>
        <Table
          columns={columns}
          rowKey="id"
          dataSource={listData}
          bordered={true}
          pagination={{
            size: 'small',
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: changePage,
            onShowSizeChange: changePageSize,
            total,
            current: page,
            pageSize,
          }}
        />
        {
          this.state.showTeachDetialDrawer
          && <TeachDetailDrawer
            drawerData={this.state.teachDetailDrawerData}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showTeachDetialDrawer}
            type={this.state.defaultActiveKey}
            yesOrNoOptions={yesOrNoOptions}
            findLabel={findLabel}
            getOption={getOption}
          />
        }
      </Drawer>
    );
  }
}

export default TeachDrawer;
