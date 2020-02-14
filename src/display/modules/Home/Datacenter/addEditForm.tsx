import * as React from 'react';
import { Form, Input } from 'antd';
import CommonUtils from 'src/utils/commonUtils';

const FormItem = Form.Item;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  selectedTreeNode: any;
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

    /**
     * 楼层正整数校验
     */
    const validateFloor = (rule: any, value: any, callback: any) => {
      if (!value || !CommonUtils.regex('uint', value)) {
        callback('楼层必须为正整数！');
      }
      callback();
    };

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        {
          !this.props.selectedTreeNode &&
          <div>
            <FormItem label="国家">
              {getFieldDecorator('nation', {
                initialValue: editData ? editData.nation : null,
                rules: [
                  { required: true, message: '请输入国家' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="国家缩写">
              {getFieldDecorator('nation_abbreviation', {
                initialValue: editData ? editData.nation_abbreviation : null,
                rules: [
                  { required: true, message: '请输入国家缩写' }
                ],
              })(
                <Input />
              )}
            </FormItem>
          </div>
        }
        {
          this.props.selectedTreeNode && this.props.selectedTreeNode.type === 'nation' &&
          <div>
            <FormItem label="城市">
              {getFieldDecorator('city', {
                initialValue: editData ? editData.city : null,
                rules: [
                  { required: true, message: '请输入城市' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="城市缩写">
              {getFieldDecorator('city_abbreviation', {
                initialValue: editData ? editData.city_abbreviation : null,
                rules: [
                  { required: true, message: '请输入城市缩写' }
                ],
              })(
                <Input />
              )}
            </FormItem>
          </div>
        }
        {
          this.props.selectedTreeNode && this.props.selectedTreeNode.type === 'city' &&
          <FormItem label="机房">
            {getFieldDecorator('room', {
              initialValue: editData ? editData.room : null,
              rules: [
                { required: true, message: '请输入机房' }
              ],
            })(
              <Input />
            )}
          </FormItem>
        }
        {
          this.props.selectedTreeNode && this.props.selectedTreeNode.type === 'room' &&
          <FormItem label="楼层">
            {getFieldDecorator('floor', {
              initialValue: editData ? editData.floor : null,
              rules: [
                {
                  required: true, message: '请输入楼层'
                },
                {
                  validator: validateFloor,
                }
              ],
            })(
              <Input />
            )}
          </FormItem>
        }
      </Form>
    );
  }
}

export default AddEditModal;
