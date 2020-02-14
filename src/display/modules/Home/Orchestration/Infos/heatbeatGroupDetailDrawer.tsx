import * as React from 'react';
import { Drawer, Col, Row } from 'antd';
import _ from 'lodash';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  drawerData: any;
  methodList: any;
  onClose: any;
  visible: boolean;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  info: any;
}

/**
 * HeatbeatGroupDetailDrawer
 */
class HeatbeatGroupDetailDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      info: {},
    };
  }

  render() {
    const { drawerData, onClose } = this.props;

    const pStyle = {
      fontSize: 16,
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: 16,
    };

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
     * 取得探测方式名称
     */
    const getMethodName = (id: number) => {
      const method = _.find(this.props.methodList, ['id', id]);
      return method && method.name;
    };

    return (
      <Drawer
        width={640}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
      >
        <p style={{ ...pStyle, marginBottom: 24 }}>冗余组：{drawerData
          && drawerData.heatBeatGroupInfo
          && drawerData.heatBeatGroupInfo.name}</p>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="探测方式" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={
                drawerData
                && drawerData.heatBeatGroupInfo
                && getMethodName(drawerData.heatBeatGroupInfo.method)
              }
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="探测间隔" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={
                drawerData
                && drawerData.heatBeatGroupInfo
                && drawerData.heatBeatGroupInfo.interval
              }
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="等待时间" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={
                drawerData
                && drawerData.heatBeatGroupInfo
                && drawerData.heatBeatGroupInfo.wait
              }
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="告警阈值" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={
                drawerData
                && drawerData.heatBeatGroupInfo
                && drawerData.heatBeatGroupInfo.warning
              }
            />
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default HeatbeatGroupDetailDrawer;
