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
  connTypeChoices: any;
  netElementList: any;
  blackholesTypeChoices: any;
  routesNumTypeChoices: any;
  domainList: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

/**
 * ISPInfoDrawer
 */
class ISPInfoDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      drawerData,
      onClose,
      connTypeChoices,
      netElementList,
      blackholesTypeChoices,
      routesNumTypeChoices,
      domainList,
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

    /**
     * 获取用户组名称
     */
    const getDomainNames = (owner: any) => {
      const list: string[] = [];
      if (_.size(owner) > 0) {
        _.forEach(owner, (value, key) => {
          const domain = _.find(domainList, ['id', parseInt(key, 10)]);
          if (domain) {
            list.push(domain.name);
          }
        });
      }
      return list.join('， ');
    };

    return (
      <Drawer
        width={800}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
      >
        <p style={{ ...pStyle, marginBottom: 24 }}>链路：
          {drawerData && drawerData.line_num}</p>
        <Divider orientation="left">基础信息</Divider>
        <Row style={{ marginBottom: 12 }}>
          <Col span={4}>
            <DescriptionItem value="互联类型" />
          </Col>
          <Col span={4}>
            <DescriptionItem
              value={drawerData &&
                _.find(connTypeChoices, ['value', drawerData.conn_type_id])?.label}
            />
          </Col>
          <Col span={4}>
            <DescriptionItem value="对端名称" />
          </Col>
          <Col span={4}>
            <DescriptionItem value={drawerData && drawerData.opposite_name} />
          </Col>
          <Col span={4}>
            <DescriptionItem value="ASN" />
          </Col>
          <Col span={4}>
            <DescriptionItem value={drawerData && drawerData.asn} />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="内部链路代号" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.line_num}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="供应商链路代号" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.isp_line_num}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="路由成分" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.route_ingredient}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="产品类型" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.product_type}
            />
          </Col>
        </Row>
        <Divider orientation="left">入网点信息</Divider>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="逻辑入网点" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && _.find(netElementList, ['id', drawerData.logic_ap_id])?.name}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="物理入网点" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && _.find(netElementList, ['id', drawerData.phyical_ap_id])?.name}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="逻辑入网点接口" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.logic_ap_phyical_port}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="物理入网点接口" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.phyical_ap_phyical_port}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="逻辑入网点接口速率" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.logic_ap_port_rate}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="物理入网点接口速率" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.phyical_ap_port_rate}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="本端地址" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.local_addr}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="对端地址" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.remote_addr}
            />
          </Col>
        </Row>
        <Divider orientation="left">带宽及路由</Divider>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="黑洞方式" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && _.find(blackholesTypeChoices, ['value', drawerData.blackholes_type_id]).label}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="Community" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.blackholes_community}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="承诺带宽(M)" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.committed_bw}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="突发带宽(M)" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.burst_bw}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="路由统计" />
          </Col>
          <Col span={18}>
            <DescriptionItem
              value={drawerData
                && _.find(routesNumTypeChoices, ['value', drawerData.routes_num_type_id]).label}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="普通路由条目" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.prefixes_num}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="黑洞路由条目" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.blackholes_num}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="资源归属" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.owner
                && getDomainNames(drawerData.owner)}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="资源创建者" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.creator
                && getDomainNames(drawerData.creator)}
            />
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default ISPInfoDrawer;
