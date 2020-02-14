import * as React from 'react';
import { Form, Input, Select } from 'antd';
import CommonUtils from 'src/utils/commonUtils';

const FormItem = Form.Item;
const { Option } = Select;

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
    const { editData, methodList } = this.props;
    const { getFieldDecorator } = this.props.form;

    /**
     * 获取网元信息选项
     */
    const getMethodOptions = () => {
      const list: any[] = [];
      if (methodList && methodList.length > 0) {
        methodList.forEach((p: any) => {
          list.push({
            label: p.name,
            value: p.id
          });
        });
      }
      return list;
    };

    /**
     * 正整数校验
     */
    const validateUnsignedInt = (rule: any, value: number, callback: any, label: string) => {
      if (!value || !CommonUtils.regex('uint', value.toString())) {
        callback(label + '必须为正整数！');
      }
      callback();
    };

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <FormItem label="冗余组">
          {getFieldDecorator('name', {
            initialValue: editData ? editData.name : null,
            rules: [
              { required: true, message: '请输入冗余组' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="探测方式">
          {getFieldDecorator('method', {
            initialValue: editData ? editData.method : null,
            rules: [
              { required: true, message: '请选择探测方式' }
            ],
          })(
            <Select
              style={{ width: 200 }}
            >
              {getMethodOptions().map((type: any) => (
                <Option value={type.value} key={type.value}>{type.label}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="探测间隔">
          {getFieldDecorator('interval', {
            initialValue: editData ? editData.interval : null,
            rules: [
              {
                validator: (rule: any, value: number, callback: any, label: string) => {
                  validateUnsignedInt(rule, value, callback, '探测间隔');
                }
              },
              { required: true, message: '请输入探测间隔' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="等待时间">
          {getFieldDecorator('wait', {
            initialValue: editData ? editData.wait : null,
            rules: [
              {
                validator: (rule: any, value: number, callback: any, label: string) => {
                  validateUnsignedInt(rule, value, callback, '等待时间');
                }
              },
              { required: true, message: '请输入等待时间' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="告警阈值">
          {getFieldDecorator('warning', {
            initialValue: editData ? editData.warning : null,
            rules: [
              {
                validator: (rule: any, value: number, callback: any, label: string) => {
                  validateUnsignedInt(rule, value, callback, '告警阈值');
                }
              },
              { required: true, message: '请输入告警阈值' }
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
