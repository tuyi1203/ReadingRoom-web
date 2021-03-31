import * as React from 'react';
import {
  Form,
  Input,
} from 'antd';
// import CommonUtils from 'src/utils/commonUtils';

const FormItem = Form.Item;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  // editData?: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

/**
 * AddModal
 */
class PasswordResetForm extends React.PureComponent<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
    };

  }

  render() {
    const {
      // editData,
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <span>
          <FormItem label="当前密码">
            {getFieldDecorator('current_password', {
              // initialValue: editData ? editData.dict_code : null,
              rules: [
                { required: true, message: '请输入当前密码' }
              ],
            })(
              <Input.Password placeholder="请输入当前密码"/>
            )}
          </FormItem>
          <FormItem label="新密码">
            {getFieldDecorator('new_password', {
              // initialValue: editData ? editData.dict_name : null,
              rules: [
                { required: true, message: '请输入新密码' }
              ],
            })(
              <Input.Password placeholder="请输入新密码"/>
            )}
          </FormItem>
          <FormItem label="确认新密码">
            {getFieldDecorator('confirm_password', {
              // initialValue: editData ? editData.remark : null,
              rules: [
                { required: true, message: '请再输入一遍新密码' }
              ],
            })(
              <Input.Password placeholder="请再输入一遍新密码"/>
            )}
          </FormItem>
        </span>
      </Form>
    );
  }
}

export default PasswordResetForm;
