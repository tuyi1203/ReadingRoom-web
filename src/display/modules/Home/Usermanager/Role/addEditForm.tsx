import * as React from 'react';
import {
  Form,
  Input,
  InputNumber,
} from 'antd';
import CommonUtils from 'src/utils/commonUtils';
// import { usermanager } from 'src/api';

const FormItem = Form.Item;
// const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  // groupOptions: any;
}

/**
 * AddModal
 */
class AddEditModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    // this.state = {
    // };
  }

  render() {
    const { editData } = this.props;
    const { getFieldDecorator } = this.props.form;
    // console.log(groupList);
    /**
     * 校验确认密码
     */
    // const validatePasswordConfirm = (rule: any, value: any, callback: any) => {
    //   if (!value || this.props.form.getFieldValue('password') !== value) {
    //     callback(new Error('确认密码不能为空，且两次输入的密码必须一致！'));
    //   }
    //   callback();
    // };

    /**
     * 校验角色代号
     */
    const validateAlphabet = (rule: any, value: any, callback: any) => {
      if (!value) {
        callback();
      }

      if (!CommonUtils.regex('alphabet', value)) {
        callback(new Error('角色代号只能由字母和下划线组成'));
      }
      callback();
    };

    /**
     * 校验角色中文名称
     */
    const validateKanji = (rule: any, value: any, callback: any) => {
      if (!value) {
        callback();
      }

      if (!CommonUtils.regex('kanji', value)) {
        callback(new Error('角色中文名称只能输入中文字符'));
      }
      callback();
    };

    /**
     * 校验序号
     */
    const validateUint = (rule: any, value: any, callback: any) => {
      if (!value) {
        callback();
      }
      if (!Number.isInteger(parseInt(value, 10))) {
        // if (!CommonUtils.regex('unit', value)) {
        callback(new Error('请输入0或者正整数'));
      }
      callback();
    };

    /**
     * 校验手机号码
     */
    // const validateMobile = (rule: any, value: any, callback: any) => {
    //   if (!value || !CommonUtils.regex('mobile', value)) {
    //     callback('请输入正确的手机号码！');
    //   }
    //   callback();
    // };

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <FormItem label="角色代号">
          {getFieldDecorator('name', {
            initialValue: editData ? editData.name : null,
            rules: [
              { required: true, message: '请输入角色代号' },
              { validator: validateAlphabet }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="角色中文名称">
          {getFieldDecorator('name_zn', {
            initialValue: editData ? editData.name_zn : null,
            rules: [
              { required: true, message: '请输入角色中文名称' },
              { validator: validateKanji }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="序号">
          {getFieldDecorator('order_sort', {
            initialValue: editData ? editData.order_sort : 0,
            rules: [
              { required: true, message: '请输入数字序号' },
              { validator: validateUint }
            ],
          })(
            <InputNumber />
          )}
        </FormItem>
        {/* {editData &&
          <FormItem label="密码">
            {getFieldDecorator('password', {
              initialValue: editData ? editData.password : null,
              rules: [
                { required: true, message: '请选择输入密码' }
              ],
            })(
              <Input type="password" disabled={true} />
            )}
          </FormItem>
        } */}
        {/* {editData &&
          <FormItem label="有效用户">
            {getFieldDecorator('validate', {
              valuePropName: 'checked',
              initialValue: editData.validate,
            })(
              <Switch checkedChildren="是" unCheckedChildren="否" />
            )}
          </FormItem>
        } */}
      </Form>
    );
  }
}

export default AddEditModal;
