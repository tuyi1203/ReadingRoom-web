import * as React from 'react';
import {
  Drawer,
  Divider,
  // Col, 
  // Row,
  Descriptions,
  Tabs,
  message,
  Table,
  List,
  Typography,
  Icon,
  Button
} from 'antd';
import _ from 'lodash';
// import DataDic from 'src/dataModel/DataDic';
import moment from 'moment';
import {
  progress,
  files
} from 'src/api';

import EducateDetailDrawer from './educateDetailDrawer';

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
  showEducateDetailDrawer: boolean;
  educateDetailDrawerData: any;
}

/**
 * EducateDrawer
 */
class EducateDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      listData: null,
      defaultActiveKey: '1',
      attachList: [],
      showEducateDetailDrawer: false,
      educateDetailDrawerData: null,
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
      type: 'educate',
      page_size: this.state.pageSize,
      page: this.state.page,
    };

    if (this.state.defaultActiveKey === '1') {
      params.category = 'baseinfo';
    } else if (this.state.defaultActiveKey === '2') {
      params.category = 'list';
      params.category_type = 1;
    } else if (this.state.defaultActiveKey === '3') {
      params.category = 'list';
      params.category_type = 2;
    }

    const res = await progress.getTeacherBaseInfoDetail(params,
      this.props.drawerData.user_id);
    if (res.code) {
      message.error(res.msg);
      return;
    }
    if (res) {
      if (this.state.defaultActiveKey === '1') {
        this.setState({
          baseinfoData: res.results.data,
        });
      } else {
        this.setState({
          listData: res.results.data.data,
        });
      }
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
    const download = async (id: number, fileType: string, fileName: string) => {
      // console.log(id);
      const res = await files.download(id, {});

      const file = new Blob([res.data], {
        type: fileType
      });
      console.log(res);
      const a = document.createElement('a');
      a.download = fileName;
      a.href = URL.createObjectURL(file);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    const { listData, page, pageSize, total, baseinfoData } = this.state;

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
          showEducateDetailDrawer: true,
          educateDetailDrawerData: record
        });
      }
    };

    /*
    * 关闭抽屉
    */
    const onDrawerClose = (e: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {

      if (achievementOrNot) {
        this.setState({
          showEducateDetailDrawer: false,
          educateDetailDrawerData: null
        });
      }
    };

    let columns: any = [];

    if (this.state.defaultActiveKey === '2') {
      columns = [
        {
          title: '成果类型',
          key: 'achievement_type',
          dataIndex: 'achievement_type',
          width: 200,
          render: (text: any, record: any) => {
            console.log(getOption('achievement_type'));
            return (
              <span>
                {text && findLabel(getOption('achievement_type'), text)}
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
                {text && findLabel(getOption('award_level'), text)}
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
                {text && findLabel(getOption('award_position'), text)}
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

    if (this.state.defaultActiveKey === '3') {
      columns = [
        {
          title: '成果类型',
          key: 'achievement_type',
          dataIndex: 'achievement_type',
          width: 200,
          render: (text: any, record: any) => {
            console.log(getOption('achievement_type'));
            return (
              <span>
                {text && findLabel(getOption('achievement_type'), text)}
              </span>
            );
          }
        },
        {
          title: '讲座、示范课时间',
          key: 'lecture_date',
          dataIndex: 'lecture_date',
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
          title: '讲座、示范课主题',
          key: 'lecture_content',
          dataIndex: 'lecture_content',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '主讲人',
          key: 'lecture_person',
          dataIndex: 'lecture_person',
          width: 200,
        },
        {
          title: '主办单位',
          key: 'lecture_organization',
          dataIndex: 'lecture_organization',
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
        <Divider orientation="left">教学成果信息</Divider>
        <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
          <TabPane tab="业绩基本情况" key="1" />
          <TabPane tab="现场课/录像课/微课/课件/基本功" key="2" />
          <TabPane tab="讲座/示范课" key="3" />
        </Tabs>
        {this.state.defaultActiveKey === '1'
          &&
          <span>
            <Descriptions
              title=""
              layout="vertical"
              bordered={true}
            >
              <Descriptions.Item label="教学效果" span={3}>
                {baseinfoData && baseinfoData.effect}
              </Descriptions.Item>
              <Descriptions.Item label="命题与监测" span={3}>
                {baseinfoData && baseinfoData.observe}
              </Descriptions.Item>
              <Descriptions.Item label="教研交流" span={3}>
                {baseinfoData && baseinfoData.communicate}
              </Descriptions.Item>
              <Descriptions.Item label="指导教师" span={3}>
                {baseinfoData && baseinfoData.guide}
              </Descriptions.Item>
              <Descriptions.Item label="开设选修课或综合实践活动课" span={3}>
                {baseinfoData && baseinfoData.elective}
              </Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">印证材料</Divider>
            {
              baseinfoData
              && baseinfoData.files.length > 0
              &&
              <List
                bordered={true}
                dataSource={baseinfoData.files}
                renderItem={(item: any) => (
                  <List.Item>
                    <Typography.Text>
                      <Icon type="paper-clip" />
                    </Typography.Text>
                    <Button type="link" onClick={download.bind(this, item.id, item.file_type, item.original_name)}>{item.original_name}</Button>
                    <span style={{ marginLeft: 30 }}>上传日期：{moment(item.created_at).format('YYYY/MM/DD')}</span>
                  </List.Item>
                )}
              />
            }
          </span>
        }
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
          this.state.showEducateDetailDrawer
          && <EducateDetailDrawer
            drawerData={this.state.educateDetailDrawerData}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showEducateDetailDrawer}
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

export default EducateDrawer;
