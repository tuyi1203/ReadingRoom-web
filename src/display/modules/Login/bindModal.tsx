import * as React from 'react';

import {
  Row,
  Col,
  Form,
  Input,
  Button,
} from 'antd';
import CommonUtils from 'src/utils/commonUtils';

const FormItem = Form.Item;
// const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  onSendVerifyCode: any;
  verifyCodeSending: any;
  countSeconds: number;
  form: any;
  loading: boolean;
  // editData?: any;
  // domainTypes: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  // picSrc: string;
}

/**
 * AddModal
 */
class BindModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      // picSrc: '',
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    /**
     * 校验手机号码
     */
    const validateMobile = (rule: any, value: any, callback: any) => {
      if (!value || !CommonUtils.regex('mobile', value)) {
        callback('请输入正确的手机号码！');
      }
      callback();
    };

    return (

      <Form className="modal-form" layout="inline" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Row>
          <Col>
            <FormItem label="电话号码">
              {getFieldDecorator('mobile', {
                initialValue: null,
                rules: [
                  { validator: validateMobile }
                ],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem label="验证码">
            {getFieldDecorator('verifycode', {
              initialValue: null,
              rules: [
                { required: true, message: '请输入验证码' }
              ],
            })(
              <Input />
            )}
          </FormItem>
        </Row>
        <Row>
          <Button
            loading={this.props.loading}
            htmlType="submit"
            onClick={this.props.onSendVerifyCode}
            style={{ float: 'right' }}
          >
            {this.props.loading ? this.props.countSeconds + '秒' : '发送验证码'}
          </Button>
        </Row>
      </Form>
    );
  }
}

export default BindModal;
