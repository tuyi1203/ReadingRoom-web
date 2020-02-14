import * as React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { netelement } from 'src/api';

const FormItem = Form.Item;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  selectedTreeNode?: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  protocolSupportList: any[];
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

  UNSAFE_componentWillMount() {
    this.getProtocolSupportList();
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
    const { protocolSupportList } = this.state;

    /**
     * 获取ProtocolSupport选项
     */
    const getProtocolSupportOptions = () => {
      const list: any[] = [];
      if (protocolSupportList && protocolSupportList.length > 0) {
        protocolSupportList.forEach(p => {
          list.push({
            label: p.name,
            value: p.id
          });
        });
      }
      return list;
    };

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        {
          !this.props.selectedTreeNode &&
          <FormItem label="Vendor">
            {getFieldDecorator('vendor', {
              initialValue: editData ? editData.vendor : null,
              rules: [
                { required: true, message: '请输入Vendor' }
              ],
            })(
              <Input />
            )}
          </FormItem>
        }
        {
          this.props.selectedTreeNode && this.props.selectedTreeNode.type === 'vendor' &&
          <FormItem label="Os">
            {getFieldDecorator('os', {
              initialValue: editData ? editData.os : null,
              rules: [
                { required: true, message: '请输入Os' }
              ],
            })(
              <Input />
            )}
          </FormItem>
        }
        {
          this.props.selectedTreeNode && this.props.selectedTreeNode.type === 'os' &&
          <div>
            <FormItem label="Version">
              {getFieldDecorator('version', {
                initialValue: editData ? editData.version : null,
                rules: [
                  { required: true, message: '请输入Version' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="Protocol support">
              {getFieldDecorator('protocols_support', {
                initialValue: editData ? editData.protocols_support.map((p: any) => { return p.id; }) : null,
                rules: [
                  { required: true, message: '请选择Protocol support' }
                ],
              })(
                <Checkbox.Group options={getProtocolSupportOptions()} />
              )}
            </FormItem>
          </div>
        }
      </Form>
    );
  }
}

export default AddEditModal;
