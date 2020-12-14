import * as React from 'react';
import {
  Drawer,
  Divider,
  // Col, 
  // Row,
  // Descriptions,
  Tabs,
  message,
  Table,
} from 'antd';
import _ from 'lodash';
// import DataDic from 'src/dataModel/DataDic';
import moment from 'moment';
import {
  progress,
  // files
} from 'src/api';

import AwardAndOtherDetailDrawer from './awardAndOtherDetailDrawer';

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
  baseinfoData: any;
  defaultActiveKey: string;
  attachList: any;
  showAwardAndOtherDetailDrawer: boolean;
  awardAndOtherDetailDrawerData: any;
}

/**
 * AwardAndOtherDrawer
 */
class AwardAndOtherDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      listData: null,
      defaultActiveKey: '1',
      attachList: [],
      showAwardAndOtherDetailDrawer: false,
      awardAndOtherDetailDrawerData: null,
      baseinfoData: null,
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
      type: 'award',
      page_size: this.state.pageSize,
      page: this.state.page,
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
        total: res.results.data.total
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

    /**
     * 文件下载
     */
    // const download = async (id: number, fileType: string, fileName: string) => {
    //   // console.log(id);
    //   const res = await files.download(id, {});

    //   const file = new Blob([res.data], {
    //     type: fileType
    //   });
    //   console.log(res);
    //   const a = document.createElement('a');
    //   a.download = fileName;
    //   a.href = URL.createObjectURL(file);
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    // };

    const { listData, page, pageSize, total,
      // baseinfoData
    } = this.state;

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
          showAwardAndOtherDetailDrawer: true,
          awardAndOtherDetailDrawerData: record
        });
      }
    };

    /*
    * 关闭抽屉
    */
    const onDrawerClose = (e: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {

      if (achievementOrNot) {
        this.setState({
          showAwardAndOtherDetailDrawer: false,
          awardAndOtherDetailDrawerData: null
        });
      }
    };

    let columns: any = [];

    if (this.state.defaultActiveKey === '1') {
      columns = [
        {
          title: '奖励类型',
          key: 'award_type',
          dataIndex: 'award_type',
          width: 200,
          render: (text: any, record: any) => {
            console.log(getOption('award_type'));
            return (
              <span>
                {text && _.find(getOption('award_type'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '表彰奖励内容',
          key: 'award_title',
          dataIndex: 'award_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '获奖级别',
          key: 'award_level',
          dataIndex: 'award_level',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && _.find(getOption('award_level'), ['value', text.toString()])?.label}
              </span>
            );
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
                {text && _.find(getOption('award_position'), ['value', text.toString()])?.label}
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
        <Divider orientation="left">教学成果信息</Divider>
        <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
          <TabPane tab="荣誉&其他" key="1" />
        </Tabs>
        {this.state.defaultActiveKey === '1' &&
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
        }
        {
          this.state.showAwardAndOtherDetailDrawer
          && <AwardAndOtherDetailDrawer
            drawerData={this.state.awardAndOtherDetailDrawerData}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showAwardAndOtherDetailDrawer}
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

export default AwardAndOtherDrawer;
