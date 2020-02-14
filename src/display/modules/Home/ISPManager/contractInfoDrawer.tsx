import * as React from 'react';
import { Drawer, Divider, Col, Row, Tag, Table } from 'antd';
import _ from 'lodash';
import moment from 'moment';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  // form: any;
  drawerData: any;
  onClose: any;
  visible: boolean;
  purchaseChannelChoices: any[];
  monetaryUnitChoices: any[];
  burstBillingChoices: any[];
  changeTypeChoices: any[];
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * NetElementInfoDrawer
 */
class ContractInfoDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: this.props.drawerData
        ? (this.props.drawerData.changehistories
          ? this.props.drawerData.changehistories.length
          : 0)
        : 0, // 总条数
    };
  }

  render() {
    const {
      drawerData,
      onClose,
      purchaseChannelChoices,
      monetaryUnitChoices,
      burstBillingChoices,
      changeTypeChoices,
    } = this.props;

    const {
      total,
      page,
      pageSize,
    } = this.state;
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

    const LineItem = (props: any) => (
      <div>
        {props.value && props.value.map((p: any) => {
          return (<Tag key={p.line_num}>{p.line_num}</Tag>);
        })
        }
      </div>
    );

    /**
     * 改变分页
     */
    const changePage = (page: number) => {
      this.setState({
        page: page
      });
    };

    /**
     * 改变页大小
     */
    const changePageSize = (current: number, size: number) => {
      this.setState({
        pageSize: size
      });
    };

    const column = [
      {
        title: '变更时间',
        key: 'created',
        dataIndex: 'created',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <span>
              {moment(text).format('YYYY-MM-DD & HH:mm:ss')}
            </span>
          );
        }
      },
      {
        title: '行为',
        key: 'change_type',
        dataIndex: 'change_type',
        width: 200,
        render: (text: any, record: any) => {
          return (<span>{_.find(changeTypeChoices, ['value', text])?.label}</span>);
        }
      },
      {
        title: '变更前',
        key: 'change_before',
        dataIndex: 'change_before',
        width: 200,
      },
      {
        title: '变更后',
        key: 'change_after',
        dataIndex: 'change_after',
        width: 200,
      },
    ];

    return (
      <Drawer
        width={800}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
      >
        <p style={{ ...pStyle, marginBottom: 24 }}>查看 合同编号：
          {drawerData && drawerData.contract_num}</p>
        <Divider orientation="left">基础信息</Divider>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="商务实体" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.business_entity}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="授权主体" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.authorized_subject}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="服务起始" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.start_date}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="服务结束" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.end_date}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="代购渠道" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && _.find(purchaseChannelChoices, ['value', drawerData.purchase_channel_id])?.label}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="备注" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData && drawerData.desc}
            />
          </Col>
        </Row>
        <Divider orientation="left">费用信息</Divider>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="货币单位" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && _.find(monetaryUnitChoices, ['value', drawerData.monetary_unit_id])?.label}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="突发计费" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && _.find(burstBillingChoices, ['value', drawerData.burst_billing_id])?.label}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="承诺月付" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.committed_fee}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="突发浮动" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={drawerData
                && drawerData.burst_float}
            />
          </Col>
        </Row>
        <Divider orientation="left">关联链路</Divider>
        <Row style={{ marginBottom: 12 }}>
          <Col span={24}>
            <LineItem value={drawerData && drawerData.lines} />
          </Col>
        </Row>
        <Divider orientation="left">资源历史</Divider>
        <Row style={{ marginBottom: 12 }}>
          <Col span={24}>
            <Table
              columns={column}
              rowKey="id"
              dataSource={(drawerData && drawerData.changehistories) || []}
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
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default ContractInfoDrawer;
