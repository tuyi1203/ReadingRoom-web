import * as React from 'react';
import { Form, Input } from 'antd';
import { netelement } from 'src/api';

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
class AddEditCustomModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  /**
   * 获取支持协议
   */
  getProtocolSupportList = async () => {
    const res = await netelement.getProtocolSupport({});
    if (res.code) {
      this.setState({
        protocolSupportList: res.results
      });
    }
  }

  render() {
    const { editData } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <FormItem label="类别名称">
          {getFieldDecorator('type_name', {
            initialValue: editData ? editData.type_name : null,
            rules: [
              { required: true, message: '请输入类别名称' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="能力名称">
          {getFieldDecorator('capability_name', {
            initialValue: editData ? editData.capability_name : null,
            rules: [
              { required: true, message: '请输入能力名称' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="能力描述">
          {getFieldDecorator('capability_desc', {
            initialValue: editData ? editData.capability_desc : null,
            rules: [
              { required: true, message: '请输入能力描述' }
            ],
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default AddEditCustomModal;
