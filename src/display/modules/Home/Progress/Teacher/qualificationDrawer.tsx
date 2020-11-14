import * as React from 'react';
import {
  Drawer, Divider,
  // Col, 
  // Row,
  Descriptions,
  List,
  Typography,
  Icon,
  Button,
  Tabs,
  message,
  Badge,
  Table
} from 'antd';
import _ from 'lodash';
// import DataDic from 'src/dataModel/DataDic';
import moment from 'moment';
import {
  files,
  progress
} from 'src/api';

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
  detailData: any;
  defaultActiveKey: string;
  attachList: any;
  experienceList: any;
}

/**
 * QualificationDrawer
 */
class QualificationDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      detailData: null,
      defaultActiveKey: '1',
      attachList: [],
      experienceList: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.getDetail();
  }

  /**
   * 获取基本信息详情
   */
  getDetail = async () => {
    let params: any = {
      type: 'qualification',
    };
    if (this.state.defaultActiveKey === '1') {
      params.category = 'educate';
    } else if (this.state.defaultActiveKey === '2') {
      params.category = 'work';
    } else if (this.state.defaultActiveKey === '3') {
      params.category = 'work_experience';
    } else if (this.state.defaultActiveKey === '4') {
      params.category = 'manage';
    }
    const res = await progress.getTeacherBaseInfoDetail(params,
      this.props.drawerData.user_id);
    if (res.code) {
      message.error(res.msg);
      return;
    }
    if (res) {
      this.setState({
        detailData: res.results.data,
      }, () => {
        this.getAttachList();
      });
    }
  }

  /**
   * 取得印证材料列表
   */
  getAttachList = async () => {
    let params: any = {};
    if (this.state.defaultActiveKey === '1') {
      params.bize_type = 'qualification/educate';
    }

    if (this.state.defaultActiveKey === '2') {
      params.bize_type = 'qualification/work';
    }

    if (this.state.defaultActiveKey === '3') {
      params.bize_type = 'qualification/work/experience';
    }

    if (this.state.defaultActiveKey === '4') {
      params.bize_type = 'qualification/manage/experience';
    }

    params.bize_id = this.state.detailData ? this.state.detailData.id : null;

    const res = await files.getFileList(params);
    if (res.code) {
      message.error(res.msg);
      return;
    }
    this.setState({
      attachList: res.results.data
    });
  }

  render() {
    const {
      findLabel,
      // drawerData,
      onClose,
      yesOrNoOptions,
      getOption,
    } = this.props;
    // console.log(this.props.visible);
    // const pStyle = {
    //   fontSize: 16,
    //   color: 'rgba(0,0,0,0.85)',
    //   lineHeight: '24px',
    //   display: 'block',
    //   marginBottom: 16,
    // };

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
        this.getDetail();
      });
    };

    const { detailData, attachList } = this.state;

    // const DescriptionItem = (props: any) => (
    //   <div
    //     style={{
    //       fontSize: 14,
    //       lineHeight: '22px',
    //       marginBottom: 7,
    //       color: 'rgba(0,0,0,0.65)',
    //     }}
    //   >
    //     <p
    //       style={{
    //         marginRight: 8,
    //         display: 'inline-block',
    //         color: 'rgba(0,0,0,0.85)',
    //       }}
    //     />
    //     {props.value}
    //   </div>
    // );

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

    let columns: any = [];

    if (this.state.defaultActiveKey === '1') {
      columns = [
        {
          title: '开始日期',
          dataIndex: 'start_year',
          key: 'start_year',
          render: (text: any, record: any) => {
            return record.start_year + '-' + record.start_month;
          }
        },
        {
          title: '结束日期',
          dataIndex: 'end_year',
          key: 'end_year',
          render: (text: any, record: any) => {
            return record.end_year + '-' + record.end_month;
          }
        },
        {
          title: '毕业院校及专业名称（以毕业证为准）',
          dataIndex: 'school_name',
          key: 'school_name',
        },
        {
          title: '学历',
          dataIndex: 'education',
          key: 'education',
          render: (text: any, record: any) => {
            return (
              <span>
                {findLabel(getOption('education'), text)}
              </span>
            );
          }
        },
        {
          title: '证明人',
          dataIndex: 'prove_person',
          key: 'prove_person',
        }
      ];
    }

    if (this.state.defaultActiveKey === '3') {
      columns = [
        {
          title: '开始日期',
          dataIndex: 'start_year',
          key: 'start_year',
          render: (text: any, record: any) => {
            return record.start_year + '-' + record.start_month;
          }
        },
        {
          title: '结束日期',
          dataIndex: 'end_year',
          key: 'end_year',
          render: (text: any, record: any) => {
            return record.end_year + '-' + record.end_month;
          }
        },
        {
          title: '工作单位',
          dataIndex: 'company',
          key: 'company',
        },
        {
          title: '从事何专业、技术工作（任教学科）',
          dataIndex: 'affairs',
          key: 'affairs',
        },
        {
          title: '证明人',
          dataIndex: 'prove_person',
          key: 'prove_person',
        }
      ];
    }

    if (this.state.defaultActiveKey === '4') {
      columns = [
        {
          title: '开始日期',
          dataIndex: 'start_year',
          key: 'start_year',
          render: (text: any, record: any) => {
            return record.start_year + '-' + record.start_month;
          }
        },
        {
          title: '结束日期',
          dataIndex: 'end_year',
          key: 'end_year',
          render: (text: any, record: any) => {
            return record.end_year + '-' + record.end_month;
          }
        },
        {
          title: '担任何种学生管理工作',
          dataIndex: 'affairs',
          key: 'affairs',
        },
        {
          title: '证明人',
          dataIndex: 'prove_person',
          key: 'prove_person',
        }
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
        <Divider orientation="left">基本资格信息</Divider>
        <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
          <TabPane tab="基本资格（一）" key="1" />
          <TabPane tab="基本资格（二）" key="2" />
          <TabPane tab="基本资格（三）" key="3" />
          <TabPane tab="基本资格（四）" key="4" />
        </Tabs>
        {this.state.defaultActiveKey === '1' &&
          <span>
            <Descriptions
              title=""
              bordered={true}
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="本人情况" span={2}>（1）学历。高级教师一般应具有专科及以上学历。</Descriptions.Item>
              <Descriptions.Item label="最后毕业院校">{detailData && detailData.graduate_school}</Descriptions.Item>
              <Descriptions.Item label="最后毕业时间">{detailData && detailData.graduate_time}</Descriptions.Item>
              <Descriptions.Item label="最高学历学位">{detailData && detailData.education && findLabel(getOption('education'), detailData.education)}</Descriptions.Item>
              <Descriptions.Item label="学历证书号">{detailData && detailData.education_no}</Descriptions.Item>
              <Descriptions.Item label="学位证书号">{detailData && detailData.degree_no}</Descriptions.Item>
              <Descriptions.Item label="专业">{detailData && detailData.subject}</Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">学历教育经历</Divider>
            {detailData
              &&
              <Table
                dataSource={detailData.experiences}
                columns={columns}
                pagination={false}
                bordered={true}
                rowKey="id"
              />
            }
          </span>
        }
        {this.state.defaultActiveKey === '2' &&
          <span>
            <Descriptions
              title=""
              bordered={true}
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="要求1、学历、资历及经历" span={2}>
                <Badge status="processing" text="（2）资历。具备相应的任职年限：高级教师。具备博士学位，并在一级教师岗位任教满2年及以上；或者具备大学专科及以上毕业学历或学位，并在一级教师岗位任教5年及以上。" />
              </Descriptions.Item>
              <Descriptions.Item label="参加工作时间">{detailData && detailData.work_time}</Descriptions.Item>
              <Descriptions.Item label="教龄">{detailData && detailData.teach_years}年</Descriptions.Item>
              <Descriptions.Item label="是否在一级教师岗位任教满5年及以上">{detailData && yesOrNoOptions(detailData.teach5years)}</Descriptions.Item>
              <Descriptions.Item label="是否申请破格(须在一级教师岗位任教至少3年)">{detailData && yesOrNoOptions(detailData.apply_up)}</Descriptions.Item>
              <Descriptions.Item label="申报学科/从事专业">{detailData && detailData.apply_course && findLabel(getOption('course'), detailData.apply_course)}</Descriptions.Item>
              <Descriptions.Item label="是否校级管理人员">{detailData && yesOrNoOptions(detailData.school_manager)}</Descriptions.Item>
              <Descriptions.Item label="现任专业技术职务">{detailData && detailData.title}</Descriptions.Item>
              <Descriptions.Item label="资格取得时间">{detailData && detailData.qualification_time}</Descriptions.Item>
              <Descriptions.Item label="现任专业技术职务首聘时间">{detailData && detailData.work_first_time}</Descriptions.Item>
              <Descriptions.Item label="是否为中学特级教师">{detailData && yesOrNoOptions(detailData.middle_school_teacher)}</Descriptions.Item>
              <Descriptions.Item label="中学特级教师取得时间">{detailData && detailData.middle_school_time}</Descriptions.Item>
              <Descriptions.Item label="参加何社会、学术团体、任何职务">{detailData && detailData.remark}</Descriptions.Item>
            </Descriptions>
          </span>
        }
        {this.state.defaultActiveKey === '3' &&
          <span>
            <Descriptions
              title=""
              bordered={true}
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="要求1、学历、资历及经历" span={2}>（1）学历。高级教师一般应具有专科及以上学历。</Descriptions.Item>
              <Descriptions.Item label="累计年限">{detailData && detailData.rural_teach_years}年</Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">工作经历（含支教、乡村学校、薄弱学校任教经历）</Divider>
            {detailData
              &&
              <Table
                dataSource={detailData.experiences}
                columns={columns}
                pagination={false}
                bordered={true}
                rowKey="id"
              />
            }
          </span>
        }
        {this.state.defaultActiveKey === '4' &&
          <span>
            <Descriptions
              title=""
              bordered={true}
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="要求1、学历、资历及经历" span={2}>（3）经历。具备以下工作经历： 学生教育管理工作经历。具有相应班主任工作、团队工作、或其他有关学生教育管理工作</Descriptions.Item>
              <Descriptions.Item label="累计年限">{detailData && detailData.manage_years}年</Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">担任何种学生教育管理工作经历</Divider>
            {detailData
              &&
              <Table
                dataSource={detailData.experiences}
                columns={columns}
                pagination={false}
                bordered={true}
                rowKey="id"
              />
            }
          </span>
        }
        <Divider orientation="left">印证材料</Divider>
        {
          attachList
          && attachList.length > 0
          &&
          <List
            bordered={true}
            dataSource={attachList}
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
      </Drawer>
    );
  }
}

export default QualificationDrawer;
