import * as React from 'react';
import { Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  domainList: any;
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
    const { editData, domainList } = this.props;
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
        <FormItem label="组织">
          {getFieldDecorator('domain_id', {
            initialValue: editData ? editData.domain_id : null,
            rules: [
              { required: true, message: '请选择组织' }
            ],
          })(
            <Select
              style={{ width: 200 }}
            >
              {domainList.map((domain: any) => (
                <Option value={domain.id} key={domain.id}>{domain.name}</Option>
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
