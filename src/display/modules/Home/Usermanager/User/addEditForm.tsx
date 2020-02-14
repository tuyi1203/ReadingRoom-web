import * as React from 'react';
import { Form, Input, Radio, Switch, Select } from 'antd';
import CommonUtils from 'src/utils/commonUtils';
// import { usermanager } from 'src/api';

const FormItem = Form.Item;
const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  roleList: any;
  domainList: any;
  groupList: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  groupOptions: any;
}

/**
 * AddModal
 */
class AddEditModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      groupOptions: this.props.editData ? this.getGroupOptions(this.props.editData.domain_id) : [],
    };
  }

  /**
   * 获取组织选项
   */
  getGroupOptions = (domainId: number) => {
    const list: any[] = [];
    const { groupList } = this.props;
    if (groupList && groupList.length > 0) {
      groupList.forEach((p: any) => {
        if (domainId === p.domain_id) {
          list.push({
            label: p.name,
            value: p.id
          });
        }
      });
    }
    return list;
  }

  render() {
    const { editData, roleList, domainList, groupList } = this.props;
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
     * 校验手机号码
     */
    const validateMobile = (rule: any, value: any, callback: any) => {
      if (!value || !CommonUtils.regex('mobile', value)) {
        callback('请输入正确的手机号码！');
      }
      callback();
    };

    /**
     * 获取角色选项
     */
    const getRoleOptions = () => {
      const list: any[] = [];
      if (roleList && roleList.length > 0) {
        roleList.forEach((p: any) => {
          list.push({
            label: p.description,
            value: p.id
          });
        });
      }
      return list;
    };

    /**
     * 获取域选项
     */
    const getDomainOptions = () => {
      const list: any[] = [];
      if (domainList && domainList.length > 0) {
        domainList.forEach((p: any) => {
          list.push({
            label: p.name,
            value: p.id
          });
        });
      }
      return list;
    };

    /**
     * 组织选中值发生变化时改变相关信息
     */
    const onChangeDomain = (domainId: number) => {
      const list: any[] = [];
      if (groupList && groupList.length > 0) {
        groupList.forEach((p: any) => {
          if (domainId === p.domain_id) {
            list.push({
              label: p.name,
              value: p.id
            });
          }
        });
      }
      this.setState({
        groupOptions: list,
      });
      this.props.form.setFieldsValue({
        'group_ids': null,
      });
    };

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <FormItem label="用户名">
          {getFieldDecorator('username', {
            initialValue: editData ? editData.username : null,
            rules: [
              { required: true, message: '请输入用户名' }
            ],
          })(
            <Input disabled={editData ? true : false} />
          )}
        </FormItem>
        <FormItem label="姓名">
          {getFieldDecorator('alias_name', {
            initialValue: editData ? editData.alias_name : null,
            rules: [
              { required: true, message: '请输入姓名' }
            ],
          })(
            <Input />
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
        <FormItem label="邮箱">
          {getFieldDecorator('email', {
            initialValue: editData ? editData.email : null,
            rules: [
              { required: true, type: 'email', message: '请输入正确的邮箱' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        {!editData
          && <FormItem label="邮件信息">
            {getFieldDecorator('email_msg', {
              initialValue: editData ? editData.email_msg : null,
              rules: [
                { required: true, message: '请输入邮件信息' }
              ],
            })(
              <Input />
            )}
          </FormItem>}
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
        <FormItem label="手机">
          {getFieldDecorator('telephone', {
            initialValue: editData ? editData.telephone : null,
            rules: [
              { validator: validateMobile }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="用户角色">
          {getFieldDecorator('role', {
            initialValue: editData ? editData.role : null,
            rules: [
              { required: true, message: '请选择用户角色' }
            ],
          })(
            <Radio.Group options={getRoleOptions()} />
          )}
        </FormItem>
        <FormItem label="组织">
          {getFieldDecorator('domain_id', {
            initialValue: editData ? editData.domain_id : null,
            rules: [
              { required: true, message: '请选择组织' }
            ],
          })(
            // <Radio.Group options={getDomainOptions()} />
            <Select
              style={{ width: 200 }}
              onChange={onChangeDomain}
              disabled={!!editData}
            >
              {getDomainOptions().map((domain: any) => (
                <Option value={domain.value} key={domain.value}>{domain.label}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        {editData &&
          <FormItem label="空间">
            {getFieldDecorator('group_ids', {
              initialValue: editData ? editData.group_ids : null,
              rules: [
                { required: true, message: '请选择空间' }
              ],
            })(
              // <Checkbox.Group options={getGroupOptions()} />
              <Select
                style={{ width: 200 }}
                mode="multiple"
              >
                {this.state.groupOptions.map((group: any) => (
                  <Option value={group.value} key={group.value}>{group.label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        }
        {editData &&
          <FormItem label="有效用户">
            {getFieldDecorator('validate', {
              valuePropName: 'checked',
              initialValue: editData.validate,
            })(
              <Switch checkedChildren="是" unCheckedChildren="否" />
            )}
          </FormItem>
        }
      </Form>
    );
  }
}

export default AddEditModal;
