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

import ResearchAchievementDetailDrawer from './researchAchievementDetailDrawer';
import ResearchAwardDetailDrawer from './researchAwardDetailDrawer';

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
  showResearchAchievementDrawer: boolean;
  showResearchAwardDrawer: boolean;
  researchDetailDrawerData: any;
}

/**
 * ResearchDrawer
 */
class ResearchDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      listData: null,
      defaultActiveKey: '1',
      attachList: [],
      showResearchAchievementDrawer: false,
      researchDetailDrawerData: null,
      showResearchAwardDrawer: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
  }

  /*
   * 是否获奖选项
   */
  awardList = [
    { id: 0, label: '否' },
    { id: 1, label: '是' },
  ];

  /**
   * 获取列表
   */
  getList = async () => {
    let params: any = {
      page_size: this.state.pageSize,
      page: this.state.page,
      type: 'research',
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
          showResearchAchievementDrawer: true,
          researchDetailDrawerData: record
        });
      }
      if (awardOrNot) {
        this.setState({
          showResearchAwardDrawer: true,
          researchDetailDrawerData: record
        });
      }
    };

    /*
    * 关闭抽屉
    */
    const onDrawerClose = (e: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {

      if (achievementOrNot) {
        this.setState({
          showResearchAchievementDrawer: false,
          researchDetailDrawerData: null
        });
      }
      if (awardOrNot) {
        this.setState({
          showResearchAwardDrawer: false,
          researchDetailDrawerData: null
        });
      }
    };

    let columns: any = [];
    if (this.state.defaultActiveKey === '1') {
      columns = [
        {
          title: '著述类型',
          key: 'achievement_type',
          dataIndex: 'achievement_type',
          width: 200,
          render: (text: any, record: any) => {
            // console.log(getOption('achievement_type'));
            return (
              <span>
                {text && _.find(getOption('achievement_type'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '学科领域',
          key: 'course',
          dataIndex: 'course',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {_.find(getOption('course'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '是否获奖',
          key: 'award',
          dataIndex: 'award',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text
                  ? <a onClick={() => showDrawer(record, false, true)}>{this.awardList.filter(item => item.id === record.award)[0].label}</a>
                  : this.awardList.filter(item => item.id === record.award)[0].label
                }
              </span>
            );
          }
        },
        {
          title: '著述名称',
          key: 'paper_title',
          dataIndex: 'paper_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '发表刊物名称',
          key: 'paper_book_title',
          dataIndex: 'paper_book_title',
          width: 200,
        },
        {
          title: '刊号',
          key: 'paper_book_kanhao',
          dataIndex: 'paper_book_kanhao',
          width: 200,
        },
        {
          title: '卷号',
          key: 'paper_book_juanhao',
          dataIndex: 'paper_book_juanhao',
          width: 200,
        },
        {
          title: '发表时间',
          key: 'paper_date',
          dataIndex: 'paper_date',
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

    if (this.state.defaultActiveKey === '2') {
      columns = [
        {
          title: '课题类型',
          key: 'achievement_type',
          dataIndex: 'achievement_type',
          width: 200,
          render: (text: any, record: any) => {
            // console.log(getOption('achievement_type'));
            return (
              <span>
                {text && _.find(getOption('achievement_type'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '学科领域',
          key: 'course',
          dataIndex: 'course',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {_.find(getOption('course'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '是否获奖',
          key: 'award',
          dataIndex: 'award',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text
                  ? <a onClick={() => showDrawer(record, false, true)}>{this.awardList.filter(item => item.id === record.award)[0].label}</a>
                  : this.awardList.filter(item => item.id === record.award)[0].label
                }
              </span>
            );
          }
        },
        {
          title: '课题名称',
          key: 'subject_title',
          dataIndex: 'subject_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '课题批准号',
          key: 'subject_no',
          dataIndex: 'subject_no',
          width: 200,
        },
        {
          title: '课题类别',
          key: 'subject_type',
          dataIndex: 'subject_type',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && _.find(getOption('subject_type'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '课题负责人',
          key: 'subject_responseable_man',
          dataIndex: 'subject_responseable_man',
          width: 200,
        },
        {
          title: '课题开始日期',
          key: 'subject_start_date',
          dataIndex: 'subject_start_date',
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
          title: '课题结束日期',
          key: 'subject_end_date',
          dataIndex: 'subject_end_date',
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

    if (this.state.defaultActiveKey === '3') {
      columns = [
        {
          title: '学科领域',
          key: 'course',
          dataIndex: 'course',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {_.find(getOption('course'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '是否获奖',
          key: 'award',
          dataIndex: 'award',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text
                  ? <a onClick={() => showDrawer(record, false, true)}>{this.awardList.filter(item => item.id === record.award)[0].label}</a>
                  : this.awardList.filter(item => item.id === record.award)[0].label
                }
              </span>
            );
          }
        },
        {
          title: '著作名称',
          key: 'book_title',
          dataIndex: 'book_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '著作类别',
          key: 'book_type',
          dataIndex: 'book_type',
          width: 200,
        },
        {
          title: '出版社名称',
          key: 'book_publish_company_name',
          dataIndex: 'book_publish_company_name',
          width: 200,
        },
        {
          title: '出版号',
          key: 'book_publish_no',
          dataIndex: 'book_publish_no',
          width: 200,
        },
        {
          title: '出版日期',
          key: 'book_publish_date',
          dataIndex: 'book_publish_date',
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
          title: '总字数',
          key: 'book_write_count',
          dataIndex: 'book_write_count',
          width: 200,
        },
      ];
    }

    if (this.state.defaultActiveKey === '4') {
      columns = [
        {
          title: '学科领域',
          key: 'course',
          dataIndex: 'course',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {_.find(getOption('course'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '是否获奖',
          key: 'award',
          dataIndex: 'award',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text
                  ? <a onClick={() => showDrawer(record, false, true)}>{this.awardList.filter(item => item.id === record.award)[0].label}</a>
                  : this.awardList.filter(item => item.id === record.award)[0].label
                }
              </span>
            );
          }
        },
        {
          title: '专利或软件著作权类型',
          key: 'copyright_type',
          dataIndex: 'copyright_type',
          width: 200,
        },
        {
          title: '专利或软件著作权名称',
          key: 'copyright_title',
          dataIndex: 'copyright_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '审批时间',
          key: 'copyright_ratification',
          dataIndex: 'copyright_ratification',
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
          title: '本人角色',
          key: 'copyright_role',
          dataIndex: 'copyright_role',
          width: 200,
        },
        {
          title: '专利号（登记号）',
          key: 'copyright_no',
          dataIndex: 'copyright_no',
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
        <Divider orientation="left">科研成果信息</Divider>
        <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
          <TabPane tab="著述" key="1" />
          <TabPane tab="课题" key="2" />
          <TabPane tab="著作" key="3" />
          <TabPane tab="专利或著作权" key="4" />
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
          this.state.showResearchAchievementDrawer
          && <ResearchAchievementDetailDrawer
            drawerData={this.state.researchDetailDrawerData}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showResearchAchievementDrawer}
            type={this.state.defaultActiveKey}
            yesOrNoOptions={yesOrNoOptions}
            findLabel={findLabel}
            getOption={getOption}
          />
        }
        {
          this.state.showResearchAwardDrawer
          && <ResearchAwardDetailDrawer
            drawerData={this.state.researchDetailDrawerData}
            onClose={(e: any) => { return onDrawerClose(e, false, true); }}
            visible={this.state.showResearchAwardDrawer}
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

export default ResearchDrawer;
