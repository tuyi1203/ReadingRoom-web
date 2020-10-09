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
  editData?: any;
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
    const {
      editData,
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <span>
          <FormItem label="字典类别" style={{ display: 'none' }}>
            {getFieldDecorator('dict_category', {
              initialValue: editData ? editData.dict_category : null,
              rules: [
                // { required: true, message: '请输入姓名' }
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="字典标号">
            {getFieldDecorator('dict_code', {
              initialValue: editData ? editData.dict_code : null,
              rules: [
                // { required: true, message: '请输入姓名' }
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="字典显示名称">
            {getFieldDecorator('dict_name', {
              initialValue: editData ? editData.dict_name : null,
              rules: [
                { required: true, message: '请输入字典显示名称' }
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="字典备注">
            {getFieldDecorator('remark', {
              initialValue: editData ? editData.remark : null,
              rules: [
                // { required: true, message: '请输入姓名' }
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="字典排序">
            {getFieldDecorator('order_sort', {
              initialValue: editData ? editData.order_sort : null,
              rules: [
                // { required: true, message: '请输入姓名' }
              ],
            })(
              <Input />
            )}
          </FormItem>
        </span>
      </Form>
    );
  }
}

export default AddEditModal;
