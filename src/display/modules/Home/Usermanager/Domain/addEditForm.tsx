import * as React from 'react';
import { Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  domainTypes: any;
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
    };
  }

  render() {
    const { editData, domainTypes } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <FormItem label="组织名">
          {getFieldDecorator('name', {
            initialValue: editData ? editData.name : null,
            rules: [
              { required: true, message: '请输入组织名' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="组织类型">
          {getFieldDecorator('internal_domain', {
            initialValue: editData ? editData.internal_domain : null,
            rules: [
              { required: true, message: '请选择组织类型' }
            ],
          })(
            <Select
              style={{ width: 200 }}
            >
              {domainTypes.map((type: any) => (
                <Option value={type.value} key={type.value}>{type.label}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="描述">
          {getFieldDecorator('description', {
            initialValue: editData ? editData.description : null,
            rules: [
              // { required: true, message: '请输入姓名' }
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
