import * as React from 'react';
import { Form, Input } from 'antd';

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
class AddEditProtocolModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const { editData } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <FormItem label="名称">
          {getFieldDecorator('name', {
            initialValue: editData ? editData.name : null,
            rules: [
              { required: true, message: '请输入名称' }
            ],
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default AddEditProtocolModal;
