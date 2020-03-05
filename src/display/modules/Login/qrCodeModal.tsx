import * as React from 'react';
import { wechat } from 'src/api';
import storageUtils from 'src/utils/storageUtils';
import Constant from 'src/dataModel/Constant';

import {
  Card,
  message,
  Row,
  Col,
  // Form,
  // Input,
  // Select
} from 'antd';

const { Meta } = Card;

// const FormItem = Form.Item;
// const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  scanCodeStart: any;
  scanCodeEnd: any;
  // form: any;
  // editData?: any;
  // domainTypes: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  picSrc: string;
}

/**
 * AddModal
 */
class QRCodeModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      picSrc: '',
    };
  }

  UNSAFE_componentWillMount() {
    storageUtils.remove(Constant.SENCE_ID);
    this.getQRCode();
  }

  componentWillUnmount() {
    this.props.scanCodeEnd();
  }

  getQRCode = async () => {
    const res = await wechat.getLoginQRCode({
      'senceid': storageUtils.get(Constant.SENCE_ID),
    });

    if (!res || res.code !== 0) {
      message.error(res.msg);
      return;
    }

    this.setState({
      picSrc: res.results.data.url,
    }, () => {
      // 存入本地缓存中
      storageUtils.set(Constant.SENCE_ID, res.results.data.sence_id);
      this.props.scanCodeStart();
    });
  }

  render() {
    // const { editData, domainTypes } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { picSrc } = this.state;
    return (
      <Row>
        <Col>
          <Card
            hoverable={true}
            // style={{ width: 300 }}
            cover={<img src={picSrc} height="300" width="300" />}
          >
            <Meta
              title="请使用微信扫描二维码登录"
              style={{ textAlign: 'center' }}
            />
          </Card>
        </Col>
      </Row>

      // <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
      //   <FormItem label="组织名">
      //     {getFieldDecorator('name', {
      //       initialValue: editData ? editData.name : null,
      //       rules: [
      //         { required: true, message: '请输入组织名' }
      //       ],
      //     })(
      //       <Input />
      //     )}
      //   </FormItem>
      //   <FormItem label="组织类型">
      //     {getFieldDecorator('internal_domain', {
      //       initialValue: editData ? editData.internal_domain : null,
      //       rules: [
      //         { required: true, message: '请选择组织类型' }
      //       ],
      //     })(
      //       <Select
      //         style={{ width: 200 }}
      //       >
      //         {domainTypes.map((type: any) => (
      //           <Option value={type.value} key={type.value}>{type.label}</Option>
      //         ))}
      //       </Select>
      //     )}
      //   </FormItem>
      //   <FormItem label="描述">
      //     {getFieldDecorator('description', {
      //       initialValue: editData ? editData.description : null,
      //       rules: [
      //         // { required: true, message: '请输入姓名' }
      //       ],
      //     })(
      //       <Input />
      //     )}
      //   </FormItem>
      // </Form>
    );
  }
}

export default QRCodeModal;
