import * as React from 'react';
import {
  Drawer, Divider,
  // Col, 
  // Row,
  Descriptions,
  // List, 
  // Typography, 
  // Icon, 
  // Button, 
  message
} from 'antd';
import _ from 'lodash';
import DataDic from 'src/dataModel/DataDic';
// import moment from 'moment';
import {
  // files, 
  progress
} from 'src/api';
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
  detailData: any;
}

/**
 * BaseinfoDrawer
 */
class BaseinfoDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      detailData: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getDetail();
  }

  /**
   * 获取基本信息详情
   */
  getDetail = async () => {
    const res = await progress.getTeacherBaseInfoDetail({}, this.props.drawerData.user_id);
    if (res.code) {
      message.error(res.msg);
      return;
    }
    if (res) {
      this.setState({
        detailData: res.results.data,
      });
    }
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

    const { detailData } = this.state;

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

    return (
      <Drawer
        width={1000}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
      >
        <Divider orientation="left">教师基本信息</Divider>
        <Descriptions
          title=""
          bordered={true}
          column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="姓名">{detailData && detailData.name}</Descriptions.Item>
          <Descriptions.Item label="曾用名">{detailData && detailData.old_name}</Descriptions.Item>
          <Descriptions.Item label="民族">{detailData
            && findLabel(getOption('min_zu'), detailData.min_zu)}
          </Descriptions.Item>
          <Descriptions.Item label="性别">
            {detailData
              && findLabel(DataDic.genderList, detailData.gender)}
          </Descriptions.Item>
          <Descriptions.Item label="是否在编">
            {detailData
              && findLabel(DataDic.zaibianList, detailData.zai_bian)}
          </Descriptions.Item>
          <Descriptions.Item label="身份证号码">{detailData && detailData.id_card}</Descriptions.Item>
          <Descriptions.Item label="申报系列">
            {detailData
              && findLabel(getOption('series'), detailData.apply_series)}
          </Descriptions.Item>
          <Descriptions.Item label="申报学科">
            {detailData
              && findLabel(getOption('course'), detailData.apply_course)}
          </Descriptions.Item>
          <Descriptions.Item label="现有职务级别">
            {detailData
              && findLabel(getOption('position'), detailData.had_position)}
          </Descriptions.Item>
          <Descriptions.Item label="申报职务级别">
            {detailData
              && findLabel(getOption('position'), detailData.apply_position)}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Config Info">
            Data disk type: MongoDB
          <br />
          Database version: 3.4
          <br />
          Package: dds.mongo.mid
          <br />
          Storage space: 10 GB
          <br />
          Replication factor: 3
          <br />
          Region: East China 1
        </Descriptions.Item> */}
        </Descriptions>
        {/* <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="姓名" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={detailData && detailData.name}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="成果类型" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.achievement_type && _.find(getOption('achievement_type'), ['value', drawerData.achievement_type.toString()])?.label}
            />
          </Col>
        </Row> */}
        {/* <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="姓名" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.course && _.find(getOption('course'), ['value', drawerData.course.toString()])?.label}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="成果类型" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.achievement_type && _.find(getOption('achievement_type'), ['value', drawerData.achievement_type.toString()])?.label}
            />
          </Col>
        </Row> */}
        {/* <Divider orientation="left">印证材料</Divider>
        {
          drawerData
          && drawerData.achievement_files.length > 0
          &&
          <List
            bordered={true}
            dataSource={drawerData.achievement_files}
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
        } */}
      </Drawer>
    );
  }
}

export default BaseinfoDrawer;
