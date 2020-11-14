import * as React from 'react';
import { Drawer, Divider, Col, Row, List, Typography, Icon, Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { files } from 'src/api';
// import CommonUtils from 'src/utils/commonUtils';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  // form: any;
  drawerData: any;
  onClose: any;
  visible: boolean;
  type: string;
  yesOrNoOptions: any;
  getOption: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

/**
 * ISPInfoDrawer
 */
class AchievementDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      drawerData,
      onClose,
      type,
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

    const DescriptionItem = (props: any) => (
      <div
        style={{
          fontSize: 14,
          lineHeight: '22px',
          marginBottom: 7,
          color: 'rgba(0,0,0,0.65)',
        }}
      >
        <p
          style={{
            marginRight: 8,
            display: 'inline-block',
            color: 'rgba(0,0,0,0.85)',
          }}
        />
        {props.value}
      </div>
    );

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

    return (
      <Drawer
        width={800}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
      >
        <Divider orientation="left">教学成果信息</Divider>
        {type === '1' &&
          <span>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="奖励类型" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={drawerData && drawerData.award_type && _.find(getOption('award_type'), ['value', drawerData.award_type.toString()])?.label}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="获奖时间" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={drawerData && drawerData.award_date && moment(drawerData.award_date).format('YYYY-MM')}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="表彰奖励内容" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={drawerData && drawerData.award_title}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="获奖级别" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={drawerData && drawerData.award_level && _.find(getOption('award_level'), ['value', drawerData.award_level.toString()])?.label}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="获奖等次" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={drawerData && drawerData.award_position && _.find(getOption('award_position'), ['value', drawerData.award_position.toString()])?.label}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="授奖单位" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={drawerData && drawerData.award_authoriry_organization}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="授奖国家(地区）" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={drawerData && drawerData.award_authoriry_country}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="著述收录情况" />
              </Col>
              <Col span={6}>
                <span style={{ whiteSpace: 'pre-wrap' }}>
                  <DescriptionItem value={drawerData && drawerData.award_remark} />
                </span>
              </Col>
            </Row>
          </span>
        }
        <Divider orientation="left">印证材料</Divider>
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
        }
      </Drawer>
    );
  }
}

export default AchievementDrawer;
