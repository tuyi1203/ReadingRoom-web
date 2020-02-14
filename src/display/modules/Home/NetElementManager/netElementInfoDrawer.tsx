import * as React from 'react';
import { Drawer, Divider, Col, Row } from 'antd';
import _ from 'lodash';
// import CommonUtils from 'src/utils/commonUtils';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  // form: any;
  drawerData: any;
  onClose: any;
  visible: boolean;
  nationList: any;
  cityList: any;
  roomList: any;
  floorList: any;
  vendorList: any;
  osList: any;
  versionList: any;
  devTypeChoices: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

/**
 * AddModal
 */
class NetElementInfoDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      drawerData,
      onClose,
      nationList,
      cityList,
      roomList,
      floorList,
      devTypeChoices,
      versionList,
      osList,
      vendorList
    } = this.props;
    // console.log(this.props.visible);
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

    return (
      <Drawer
        width={640}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
      >
        <p style={{ ...pStyle, marginBottom: 24 }}>网元：{drawerData && drawerData.name}</p>
        <p style={pStyle}>基础信息</p>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="设备名称" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData && drawerData.name}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="设备IP" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData && drawerData.ip}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="设备类型" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData
                && drawerData.device_type
                && _.find(devTypeChoices, ['value', drawerData.device_type_id])?.label}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="位置信息" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData && drawerData.location_info}
            />
          </Col>
        </Row>
        <Divider />
        <p style={pStyle}>数据中心信息</p>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="国家" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData
                && drawerData.nation
                && _.find(nationList, ['id', drawerData.nation])?.nation}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="城市" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData
                && drawerData.city
                && _.find(cityList, ['id', drawerData.city])?.city}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="机房" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData
                && drawerData.room
                && _.find(roomList, ['id', drawerData.room])?.room}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="楼层" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData
                && drawerData.floor
                && _.find(floorList, ['id', drawerData.floor])?.floor}
            />
          </Col>
        </Row>
        <Divider />
        <p style={pStyle}>网元字典信息</p>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="Vendor" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData
                && drawerData.vendor
                && _.find(vendorList, ['id', drawerData.vendor])?.vendor}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="OS" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData
                && drawerData.os
                && _.find(osList, ['id', drawerData.os])?.os}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="Version" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData
                && drawerData.version
                && _.find(versionList, ['id', drawerData.version])?.version}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={10}>
            <DescriptionItem value="Protocol Support" />
          </Col>
          <Col span={10}>
            <DescriptionItem
              value={drawerData
                && drawerData.version
                && _.find(versionList, ['id', drawerData.version])?.protocols_support.map((p: any) => p.name).join('，')}
            />
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default NetElementInfoDrawer;
