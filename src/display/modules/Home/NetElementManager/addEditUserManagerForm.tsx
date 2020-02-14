import * as React from 'react';
import { Form, Input } from 'antd';
// import CommonUtils from 'src/utils/commonUtils';

const FormItem = Form.Item;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

/**
 * AddModal
 */
class AddEditUserManagerModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      // protocolSupportList: [],
    };
  }

  render() {
    const { editData } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <FormItem label="用户名">
          {getFieldDecorator('username', {
            initialValue: editData ? editData.username : null,
            rules: [
              { required: true, message: '请输入用户名' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="密码">
          {getFieldDecorator('password', {
            initialValue: editData ? editData.password : null,
            rules: [
              { required: true, message: '请输入密码' }
            ],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem label="组名">
          {getFieldDecorator('group', {
            initialValue: editData ? editData.group : null,
            rules: [
              { required: true, message: '请输入组名' }
            ],
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default AddEditUserManagerModal;
