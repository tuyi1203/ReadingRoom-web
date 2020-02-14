import * as React from 'react';
import { Drawer, Divider, Col, Row, Upload, message, Button, Icon, Popconfirm, List, Typography } from 'antd';
import storageUtils from 'src/utils/storageUtils';
import Constant from 'src/dataModel/Constant';
import IToken from 'src/dataModel/IToken';
// import ContentType from 'src/dataModel/HttpContentType';
import moment from 'moment';
import { attaches } from 'src/api';
// import CommonUtils from 'src/utils/commonUtils';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  // form: any;
  drawerData: any;
  onClose: any;
  visible: boolean;
  action: string;
  dir: string;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  attachList: any;
}

/**
 * AttachDrawer
 */
class AttachDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      attachList: [],
    };
  }

  /**
   * 取得合同附件列表
   */
  getAttachList = async (record: any) => {
    const res = await attaches.getList({
      contract: record.id
    });
    if (res && !res.code) {
      message.error(res.msg);
      return;
    }
    this.setState({
      attachList: res.results
    });
  }

  UNSAFE_componentWillMount() {
    this.getAttachList(this.props.drawerData);
  }

  render() {
    const { drawerData, onClose, action, dir } = this.props;
    const { attachList } = this.state;

    /**
     * 获取token
     */
    const getToken = () => {
      let token: string = '';
      const loginInfoStr = storageUtils.get(Constant.LOGIN_KEY);
      if (loginInfoStr && loginInfoStr.length > 0) {
        const tokenInfo: IToken = JSON.parse(loginInfoStr);
        if (tokenInfo !== null && tokenInfo.token) {
          token = 'Bearer ' + tokenInfo.token;
        }
      }
      return token;
    };

    // console.log(this.props.visible);
    const pStyle = {
      fontSize: 16,
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: 16,
    };

    /**
     * 删除附件
     */
    const del = async (record: any) => {
      const res = await attaches.del(record.id, {});
      if (res && !res.code) {
        message.error(res.msg);
        return;
      }
      message.success('删除成功');
      this.getAttachList(drawerData);
    };

    /**
     * 文件上传
     */
    const onChange = async (info: any) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.code) {
          // 如果上传成功
          const { id, file, filename, created } = info.file.response.results;
          const params = {
            id,
            dir,
            file,
            filename,
            created,
            contract_id: drawerData.id,
          };
          const res = await attaches.add(params);
          if (res && !res.code) {
            message.error(res.msg);
            return;
          }
          this.getAttachList(drawerData);
        } else {
          message.error(info.file.response.msg);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    };

    return (
      <Drawer
        width={640}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
      >
        <p style={{ ...pStyle, marginBottom: 24 }}>合同编号：{drawerData && drawerData.contract_num}的附件列表</p>
        <Divider />
        <Row style={{ marginBottom: 12 }}>
          <Col span={12}>
            <Upload
              name="file"
              action={action}
              headers={{
                'authorization': getToken(),
                // 'Content-Type': ContentType.MULTIPART
              }}
              data={{ 'dir': dir }}
              showUploadList={false}
              onChange={onChange}
            >
              <Button>
                <Icon type="upload" />点击上传合同附件
              </Button>
            </Upload>
          </Col>
        </Row>
        {/* <AttachList value={drawerData && drawerData.files} /> */}
        {
          drawerData
          && attachList
          && attachList.length > 0
          &&
          <List
            bordered={true}
            dataSource={attachList}
            renderItem={(item: any) => (
              <List.Item>
                <Typography.Text mark={true}>[附件]</Typography.Text><a href={item.file} download={item.filename} target="_blank"> {item.filename} </a>
                <span style={{ marginLeft: 30 }}>上传日期：{moment(item.created).format('YYYY/MM/DD')}</span>
                <span style={{ marginLeft: 30 }}>
                  <Popconfirm title="确认删除吗?" onConfirm={() => del(item)}>
                    <Button type="danger">删除</Button>
                  </Popconfirm>
                </span>
              </List.Item>
            )}
          />
        }
      </Drawer >
    );
  }
}

export default AttachDrawer;
