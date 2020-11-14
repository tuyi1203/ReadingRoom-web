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
  kaoheList: any;
}

/**
 * MoralDrawer
 */
class MoralDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      detailData: null,
      defaultActiveKey: '1',
      attachList: [],
      kaoheList: [],
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
      type: 'moral',
    };
    if (this.state.defaultActiveKey === '1') {
      params.category = 'summary';
    } else if (this.state.defaultActiveKey === '2') {
      params.category = 'kaohe';
    } else if (this.state.defaultActiveKey === '3') {
      params.category = 'warning';
    } else if (this.state.defaultActiveKey === '4') {
      params.category = 'punish';
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
        // 获取考核数据
        if (this.state.defaultActiveKey === '2') {
          let kaoheList: any = [];
          for (let i = 1; i < 6; i++) {
            kaoheList.push({
              id: i,
              niandu: this.state.detailData['niandu' + i],
              kaohe: this.state.detailData['niandu' + i + '_kaohe'],
            });
          }
          this.setState({
            kaoheList
          });
        }
      });
    }
  }

  /**
   * 取得印证材料列表
   */
  getAttachList = async () => {
    let params: any = {};
    if (this.state.defaultActiveKey === '1') {
      params.bize_type = 'moral/summary';
    }

    if (this.state.defaultActiveKey === '2') {
      params.bize_type = 'moral/kaohe';
    }

    if (this.state.defaultActiveKey === '3') {
      params.bize_type = 'moral/warning';
    }

    if (this.state.defaultActiveKey === '4') {
      params.bize_type = 'moral/punish';
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
      // yesOrNoOptions,
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

    const { detailData, attachList, kaoheList } = this.state;

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
    if (this.state.defaultActiveKey === '2') {
      columns = [
        {
          title: '编号',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '年度',
          dataIndex: 'niandu',
          key: 'niandu'
        },
        {
          title: '考核结果',
          dataIndex: 'kaohe',
          key: 'kaohe',
          render: (text: any, record: any) => {
            return (
              <span>
                {findLabel(getOption('kaohe_level'), text)}
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
        <Divider orientation="left">师德师风信息</Divider>
        <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
          <TabPane tab="师德师风（一）" key="1" />
          <TabPane tab="师德师风（二）" key="2" />
          <TabPane tab="师德师风（三）" key="3" />
          <TabPane tab="师德师风（四）" key="4" />
        </Tabs>
        {this.state.defaultActiveKey === '1' &&
          <Descriptions
            title=""
            bordered={true}
            layout="vertical"
            column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="师德师风综述" span={3}>{detailData && detailData.summary}</Descriptions.Item>
          </Descriptions>
        }
        {this.state.defaultActiveKey === '2' &&
          <span>
            <Descriptions
              title=""
              bordered={true}
              layout="vertical"
              column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
              <Descriptions.Item label="要求2" span={3}>
                <Badge status="processing" text="是否有下列情况：（3）事业单位工作人员（企业人员参照执行）收到行政“记过”处分1年、“降低岗位登记或者撤职”处分2年内不得申报；受到“开除”处分5年内不得申报。" />
              </Descriptions.Item>
              <Descriptions.Item label="本人情况" span={3}>
                {detailData && detailData.kaohe}
              </Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">近五年度考核</Divider>
            <Table dataSource={kaoheList} columns={columns} pagination={false} bordered={true} rowKey="id"/>
          </span>
        }
        {this.state.defaultActiveKey === '3' &&
          <Descriptions
            title=""
            bordered={true}
            layout="vertical"
            column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="要求1、学历、资历及经历" span={3}>
              <Badge status="processing" text="是否有下列情况：（2）党员受到党内“警告”处分一年内、“严重警告”处分1.5年内，“撤销党内职务”处分2年内，“留党查看”处分期内及处分期满2年内，“开除党籍”处分5年内不得申报。" />
            </Descriptions.Item>
            <Descriptions.Item label="本人情况" span={3}>
              {detailData && detailData.warning}
            </Descriptions.Item>
          </Descriptions>
        }
        {this.state.defaultActiveKey === '4' &&
          <Descriptions
            title=""
            bordered={true}
            layout="vertical"
            column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="要求2" span={3}>
              <Badge status="processing" text="是否有下列情况：（3）事业单位工作人员（企业人员参照执行）收到行政“记过”处分1年、“降低岗位登记或者撤职”处分2年内不得申报；受到“开除”处分5年内不得申报。" />
            </Descriptions.Item>
            <Descriptions.Item label="本人情况" span={3}>
              {detailData && detailData.punish}
            </Descriptions.Item>
          </Descriptions>
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

export default MoralDrawer;
