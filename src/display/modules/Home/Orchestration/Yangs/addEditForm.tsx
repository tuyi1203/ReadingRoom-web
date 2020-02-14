import * as React from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  methodList?: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

/**
 * AddModal
 */
class AddEditModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      protocolSupportList: [],
    };
  }

  render() {
    const { editData } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <FormItem label="YANG模型">
          {getFieldDecorator('name', {
            initialValue: editData ? editData.name : null,
            rules: [
              { required: true, message: '请输入YANG模型' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="关联模块">
          {getFieldDecorator('description', {
            initialValue: editData ? editData.description : null,
            rules: [
              { required: true, message: '请输入关联模块' }
            ],
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default AddEditModal;
