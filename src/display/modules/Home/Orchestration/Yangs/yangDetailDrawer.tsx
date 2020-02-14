import * as React from 'react';
import { Drawer, Col, Row, message } from 'antd';
import yangs from 'src/api/yangs';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  drawerData: any;
  onClose: any;
  visible: boolean;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  info: any;
}

/**
 * AddModal
 */
class YangDetailDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      info: {},
    };
    console.log('constructor');
  }

  UNSAFE_componentWillMount() {
    if (this.props.drawerData) {
      this.getDetail(this.props.drawerData.id);
    }
  }

  // UNSAFE_componentWillUpdate() {
  //   console.log(this.props.drawerData);
  // }

  /**
   * 获取编排模型数据列表
   */
  getDetail = async (id: number) => {
    const res = await yangs.getYangsDetail(id, {});
    if (!res.code) {
      return message.error(res.msg);
    }
    console.log(res);

    if (res) {
      this.setState({
        info: {
          yang_name: res.results.yang_name,
          yang_info: res.results.yang_info,
        }
      });
    } else {
      this.setState({
        info: {
          yang_name: '',
          yang_info: '',
        }
      });
    }
  }

  render() {
    const { drawerData, onClose } = this.props;

    console.log(drawerData);
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
        <pre>
          {props.value}
        </pre>
      </div>
    );

    return (
      <Drawer
        width={800}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
        maskClosable={false}
      >
        <p style={{ ...pStyle, marginBottom: 24 }}>YANG模型：{drawerData && drawerData.name}</p>
        <Row style={{ marginBottom: 12 }}>
          <Col span={24}>
            <DescriptionItem name={this.state.info.yang_name} value={this.state.info.yang_info} />
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default YangDetailDrawer;
