import * as React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { progress } from 'src/api';
import {
  // Button,
  Form,
  Row,
  Col,
  message,
  // Table,
  // Divider,
  // Popconfirm,
  Switch,
  Select,
  Input,
  // DatePicker,
  // Tag
} from 'antd';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
// import locale from 'antd/es/date-picker/locale/zh_CN';

moment.locale('zh-cn');
const { Option } = Select;
const FormItem = Form.Item;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  userList: any;
  roleList: any;
  domainList: any;
  groupList: any;
  dictList: any;
  showAdd: boolean;
  editData: any;
  filterItems: string[];
  filterParam: any;
  editAble: boolean;
}

/**
 * BaseInfo
 */
class Moral extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      userList: [], // 用户列表
      roleList: [], // 角色列表
      domainList: [], // 获取域列表
      groupList: [], // 获取组织列表
      dictList: [], // 获取数据字典列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
      editAble: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.getDetail();
    this.getDictList();
  }

  /*
   * 获取用户职称基本信息
   */
  getDetail = async () => {
    const res = await progress.getBaseInfoDetail({});

    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        editData: res.results.data,
      }, () => {
        if (!this.state.editData) {
          this.setState({
            editAble: true,
          });
        }
      });
    }
  }

  /*
   * 获取职称数据字典
   */
  getDictList = async () => {
    const res = await progress.getDictList({
      'category_name': [
        'gender',
        'min_zu',
        'company_type',
        'series',
        'course',
        'position',
        'review_team',
        'education',
      ],
    });

    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        dictList: res.results.data,
      });
    }
  }

  render() {

    const {
      editData,
      dictList,
      editAble,
    } = this.state;

    const { getFieldDecorator } = this.props.form;

    /*
     * 获取数据字典中某个类别的列表
     */
    const getOption = (keyName: string): any[] => {
      const list: any[] = [];
      if (!_.isEmpty(dictList)) {
        const data = dictList[keyName];
        console.log(data);

        data.map((item: any) => {
          list.push({
            value: item.dict_value,
            label: item.dict_name,
          });
        });
      }
      return list;
    };

    /*
    * 显示添加
    */
    // const showAdd = () => {
    //   this.setState({
    //     showAdd: true
    //   });
    // };

    /*
    * 显示添加
    */
    /*
     const showAdd = () => {
       this.setState({
         showAdd: true
       });
     };
     */

    /**
     * 模态窗保存
     */
    // const onCancel = () => {
    //   this.setState({
    //     showAdd: false,
    //     editData: null
    //   });
    // };

    /**
     * 模态窗保存
     */
    // const onOk = () => {
    //   this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
    //     if (!err) {
    //       let res: any = null;
    //       console.log(values);
    //       if (this.state.editData) {
    //         // 编辑
    //         if (!values.is_active) {
    //           values.is_active = 0;
    //         } else {
    //           values.is_active = 1;
    //         }
    //         if (_.isEmpty(values.password)) {
    //           values = {
    //             name: values.name,
    //             email: values.email,
    //             mobile: values.mobile,
    //             roles: values.roles,
    //             is_active: values.is_active,
    //           };
    //         }
    //         res = await usermanager.edit(this.state.editData.id, values);
    //       } else {
    //         // 新增
    //         res = await usermanager.add(values);
    //       }
    //       if (res.code) {
    //         message.error(res.msg);
    //         return;
    //       }
    //       message.success('用户数据保存成功');
    //       onCancel();
    //       this.getList();
    //     }
    //   });
    // };

    /**
     * 改变筛选项
     */
    /*
    const changeFilter = (val: any) => {
      // console.log(val);
      this.setState({
        filterItems: val
      }, () => {
        onSearch();
      });
    };
    */

    /**
     * 改变锁定状态
     */
    const onChange = (checked: boolean, event: Event) => {
      if (checked) {
        this.setState({
          editAble: true,
        });
      } else {
        // 保存数据
        this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
          if (!err) {
            values.graduate_time = moment(values.graduate_time).format('YYYY-MM-DD');
            const res = await progress.addOrEditBaseInfo(values);

            if (res.code) {
              message.error(res.msg);
              return;
            }
            message.success('基本信息保存成功');
            this.setState({
              editAble: false,
            }, () => {
              this.getDetail();
            });
          }
        });
      }

    };

    return (
      <div>
        <div className="layout-breadcrumb">
          <div className="page-name">
            <CurrentPage />
          </div>
          <div className="page-button">
            <CommonButton />
            {/* 下面写本页面需要的按钮 */}
            {/* <Button type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button> */}
            <Switch
              checkedChildren="解锁"
              unCheckedChildren="锁定"
              checked={editAble}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面是本页的内容 */}

            <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Row>
                <Col span={8}>
                  <FormItem label="姓名">
                    {getFieldDecorator('name', {
                      initialValue: editData ? editData.name : null,
                      rules: [
                        { required: true, message: '请输入姓名' }
                      ],
                    })(
                      <Input
                        disabled={!!editAble ? false : true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="曾用名">
                    {getFieldDecorator('old_name', {
                      initialValue: editData ? editData.old_name : null,
                      rules: [
                        { required: true, message: '请输入曾用名' }
                      ],
                    })(
                      <Input
                        disabled={!!editAble ? false : true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="民族">
                    {getFieldDecorator('min_zu', {
                      initialValue: editData ? editData.min_zu.toString() : null,
                      rules: [
                        { required: true, message: '请选择民族' }
                      ],
                    })(
                      // <Checkbox.Group options={getGroupOptions()} />
                      <Select
                        // style={{ width: 200 }}
                        disabled={!!editAble ? false : true}
                      >
                        {getOption('min_zu').map((item: any) => (
                          <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label="性别">
                    {getFieldDecorator('gender', {
                      initialValue: editData ? editData.gender.toString() : null,
                      rules: [
                        { required: true, message: '请选择性别' }
                      ],
                    })(
                      <Select
                        // style={{ width: 200 }}
                        disabled={!!editAble ? false : true}
                      >
                        {getOption('gender').map((item: any) => (
                          <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="身份证号码">
                    {getFieldDecorator('id_card', {
                      initialValue: editData ? editData.id_card : null,
                      rules: [
                        { required: true, message: '请输入身份证号码' }
                      ],
                    })(
                      <Input
                        disabled={!!editAble ? false : true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="工作单位">
                    {getFieldDecorator('company', {
                      initialValue: editData ? editData.company : null,
                      rules: [
                        { required: true, message: '请输入工作单位' }
                      ],
                    })(
                      <Input
                        disabled={!!editAble ? false : true}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label="单位类别">
                    {getFieldDecorator('company_type', {
                      initialValue: editData ? editData.company_type.toString() : null,
                      rules: [
                        { required: true, message: '请选择单位类别' }
                      ],
                    })(
                      <Select
                        // style={{ width: 200 }}
                        disabled={!!editAble ? false : true}
                      >
                        {getOption('company_type').map((item: any) => (
                          <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="申报系列">
                    {getFieldDecorator('apply_series', {
                      initialValue: editData ? editData.apply_series.toString() : null,
                      rules: [
                        { required: true, message: '请选择申报系列' }
                      ],
                    })(
                      <Select
                        // style={{ width: 200 }}
                        disabled={!!editAble ? false : true}
                      >
                        {getOption('series').map((item: any) => (
                          <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="申报学科">
                    {getFieldDecorator('apply_course', {
                      initialValue: editData ? editData.apply_course.toString() : null,
                      rules: [
                        { required: true, message: '请选择申报学科' }
                      ],
                    })(
                      <Select
                        // style={{ width: 200 }}
                        disabled={!!editAble ? false : true}
                      >
                        {getOption('course').map((item: any) => (
                          <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label="现有职务级别">
                    {getFieldDecorator('had_position', {
                      initialValue: editData ? editData.had_position.toString() : null,
                      rules: [
                        { required: true, message: '请选择现有职务级别' }
                      ],
                    })(
                      <Select
                        // style={{ width: 200 }}
                        disabled={!!editAble ? false : true}
                      >
                        {getOption('position').map((item: any) => (
                          <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="申报职务级别">
                    {getFieldDecorator('apply_position', {
                      initialValue: editData ? editData.apply_position.toString() : null,
                      rules: [
                        { required: true, message: '请选择申报职务级别' }
                      ],
                    })(
                      <Select
                        // style={{ width: 200 }}
                        disabled={!!editAble ? false : true}
                      >
                        {getOption('position').map((item: any) => (
                          <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="评审委员会名称">
                    {getFieldDecorator('review_team_name', {
                      initialValue: editData ? editData.review_team_name.toString() : null,
                      rules: [
                        { required: true, message: '请选择评审委员会' }
                      ],
                    })(
                      <Select
                        // style={{ width: 200 }}
                        disabled={!!editAble ? false : true}
                      >
                        {getOption('review_team').map((item: any) => (
                          <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              {/* <Row>
                <Col span={8}>
                  <FormItem label="最后毕业院校">
                    {getFieldDecorator('graduate_school', {
                      initialValue: editData ? editData.graduate_school : null,
                      rules: [
                        { required: true, message: '请输入姓名' }
                      ],
                    })(
                      <Input
                        disabled={!!editAble ? false : true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="最后毕业时间">
                    {getFieldDecorator('graduate_time', {
                      initialValue: editData ? moment(editData.graduate_time, 'YYYY-MM-DD') : null,
                      rules: [
                        { required: true, message: '请输入最后毕业时间' }
                      ],
                    })(
                      <DatePicker
                        locale={locale}
                        format="YYYY-MM-DD"
                        disabled={editAble ? false : true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="最高学历">
                    {getFieldDecorator('education', {
                      initialValue: editData ? editData.education.toString() : null,
                      rules: [
                        { required: true, message: '请选择评审委员会' }
                      ],
                    })(
                      <Select
                        // style={{ width: 200 }}
                        disabled={!!editAble ? false : true}
                      >
                        {getOption('education').map((item: any) => (
                          <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label="学历证书号">
                    {getFieldDecorator('education_no', {
                      initialValue: editData ? editData.education_no : null,
                      rules: [
                        { required: true, message: '请输入学历证书号' }
                      ],
                    })(
                      <Input
                        disabled={!!editAble ? false : true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="学位证书号">
                    {getFieldDecorator('degree_no', {
                      initialValue: editData ? editData.degree_no : null,
                      rules: [
                        { required: true, message: '请输入学位证书号' }
                      ],
                    })(
                      <Input
                        disabled={!!editAble ? false : true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="专业">
                    {getFieldDecorator('subject', {
                      initialValue: editData ? editData.subject : null,
                      rules: [
                        { required: true, message: '请输入专业' }
                      ],
                    })(
                      <Input
                        disabled={!!editAble ? false : true}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row> */}
              {/* <FormItem label="手机">
                {getFieldDecorator('mobile', {
                  initialValue: editData ? editData.mobile : null,
                  rules: [
                    { required: true, message: '请输入手机号' },
                    { validator: validateMobile }
                  ],
                  validateFirst: true
                })(
                  <Input />
                )}
              </FormItem> */}
              {/* <FormItem label="用户角色">
                {getFieldDecorator('roles', {
                  initialValue: editData ? editData.roles.map((role: any) => role.name) : [],
                  rules: [
                    { required: true, message: '请选择用户角色' }
                  ],
                })(
                  <Select
                    style={{ width: 200 }}
                    mode="multiple"
                  >
                    {getRoleOptions().map((role: any) => (
                      <Option value={role.value} key={role.value}>{role.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem> */}
              {/* <FormItem label="组织">
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
        </FormItem> */}
              {/* {editData &&
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
        } */}
              {/* {editData &&
                <FormItem label="有效用户">
                  {getFieldDecorator('is_active', {
                    valuePropName: 'checked',
                    initialValue: editData.is_active ? true : false,
                  })(
                    <Switch checkedChildren="是" unCheckedChildren="否" />
                  )}
                </FormItem>
              } */}
            </Form>
          </div>
        </div>
      </div >
    );
  }
}

export default Form.create({})(Moral);
