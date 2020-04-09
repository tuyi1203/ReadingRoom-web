import * as React from 'react';
import moment from 'moment';
import * as _ from 'lodash';
import { usermanager } from 'src/api';
import { Button, Form, message, Table, Divider, Popconfirm, Modal, Select, Input, Tag } from 'antd';
import AddEditModal from './addEditForm';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';

const { Option } = Select;

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
  showAdd: boolean;
  editData: any;
  filterItems: string[];
  filterParam: any;
}

/**
 * User
 */
class User extends React.PureComponent<IProps, IState> {
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
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
    // this.getDomainList();
    // this.getGroupList();
    this.getRoleList();
  }

  /*
   * 获取用户列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize
    };

    console.log(this.state.filterParam);
    // 增加筛选条件
    if (this.state.filterParam) {

      /*
      if (this.state.filterParam.name) {
        param.username__icontains = this.state.filterParam.s_username;
      }
      */
      if (this.state.filterParam.name) {
        param.name = this.state.filterParam.name;
      }
      if (this.state.filterParam.email) {
        param.email = this.state.filterParam.email;
      }
      if (this.state.filterParam.mobile) {
        param.mobile = this.state.filterParam.mobile;
      }
      if (this.state.filterParam.roles) {
        param.roles = this.state.filterParam.roles;
      }
      if (typeof (this.state.filterParam.is_active) !== 'undefined') {
        param.is_active = this.state.filterParam.is_active;
      }
    }

    const res = await usermanager.getList(param);
    // console.log(res.code);
    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        userList: res.results.data,
        total: res.results.total
      });
    }
  }

  /*
   * 获取角色列表
   */
  getRoleList = async () => {
    const res = await usermanager.getRoleList({
      page: 1,
      page_size: 1000,
    });
    // console.log(res.code);
    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        roleList: res.results.data,
      });
    }
  }

  /*
   * 获取组织列表
   */
  getGroupList = async () => {
    const res = await usermanager.getGroupList({});
    if (!res.code) {
      return;
    }

    if (res) {
      this.setState({
        groupList: res.results.data,
      });
    }
  }

  /*
   * 有效用户选项
   */
  validateList = [
    { id: 0, label: '否' },
    { id: 1, label: '是' },
  ];

  render() {

    const {
      total,
      page,
      pageSize,
      userList,
      roleList,
      domainList,
      groupList,
    } = this.state;

    const { getFieldDecorator } = this.props.form;

    /**
     * 删除一行数据
     */
    const del = async (record: any) => {
      const param = {};
      const res = await usermanager.del(record.id, param);
      if (res.code) {
        message.error(res.msg);
        return;
      }
      message.success('用户删除成功');
      this.getList();
    };

    /*
    * 显示添加
    */
    // const showAdd = () => {
    //   this.setState({
    //     showAdd: true
    //   });
    // };

    /**
     * 显示编辑
     */
    const showEdit = (record: any) => {
      this.setState({
        editData: record,
        showAdd: true
      });
    };

    /**
     * 改变分页
     */
    const changePage = (page: number) => {
      this.setState({
        page: page
      }, () => {
        this.getList();
      });
    };

    /**
     * 改变页大小
     */
    const changePageSize = (current: number, size: number) => {
      this.setState({
        pageSize: size
      }, () => {
        this.getList();
      });
    };

    /**
     * 用户列
     */
    const column = [
      {
        title: '姓名',
        key: 'name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
        width: 200,
      },
      {
        title: '角色',
        key: 'roles',
        dataIndex: 'roles',
        width: 200,
        render: (text: any, record: any) => {
          const roles = record.roles;
          return (
            <span>{roles.map((item: any) => {
              return (<Tag key={item.id}>{item.name_zn}</Tag>);
            })}</span>
          );
        }
      },
      {
        title: '有效用户',
        key: 'is_active',
        dataIndex: 'is_active',
        width: 200,
        render: (text: any, record: any) => {
          return text ? '是' : '否';
        }
      },
      {
        title: '手机',
        key: 'mobile',
        dataIndex: 'mobile',
        width: 200,
      },
      {
        title: '创建日期',
        key: 'created_at',
        dataIndex: 'created_at',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <span>
              {moment(text).format('YYYY-MM-DD & HH:mm:ss')}
            </span>
          );
        }
      },
      {
        title: '更新日期',
        key: 'updated_at',
        dataIndex: 'updated_at',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <span>
              {moment(text).format('YYYY-MM-DD & HH:mm:ss')}
            </span>
          );
        }
      },
      // {
      //   title: '最近登陆',
      //   key: 'last_login',
      //   dataIndex: 'last_login',
      //   width: 200,
      //   render: (text: any, record: any) => {
      //     return (
      //       <span>
      //         {text ? moment(text).format('YYYY-MM-DD & HH:mm:ss') : ''}
      //       </span>
      //     );
      //   }
      // },
      {
        title: '',
        key: 'action',
        dataIndex: 'action',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <div>
              <Button type="primary" onClick={() => showEdit(record)}>编辑</Button>
              <Divider type="vertical" />
              <Popconfirm title="确认删除吗?" onConfirm={() => del(record)}>
                <Button type="danger">删除</Button>
              </Popconfirm>
            </div>
          );
        }
      },
    ];

    /*
    * 显示添加
    */
    const showAdd = () => {
      this.setState({
        showAdd: true
      });
    };

    /**
     * 模态窗保存
     */
    const onCancel = () => {
      this.setState({
        showAdd: false,
        editData: null
      });
    };

    /**
     * 模态窗保存
     */
    const onOk = () => {
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        if (!err) {
          let res: any = null;
          console.log(values);
          if (this.state.editData) {
            // 编辑
            if (!values.is_active) {
              values.is_active = 0;
            } else {
              values.is_active = 1;
            }
            if (_.isEmpty(values.password)) {
              values = {
                name: values.name,
                email: values.email,
                mobile: values.mobile,
                roles: values.roles,
                is_active: values.is_active,
              };
            }
            res = await usermanager.edit(this.state.editData.id, values);
          } else {
            // 新增
            res = await usermanager.add(values);
          }
          if (res.code) {
            message.error(res.msg);
            return;
          }
          message.success('用户数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['name', 'email', 'mobile', 'roles', 'is_active'], async (err: boolean, values: any) => {
        if (!err) {
          this.setState({
            filterParam: values
          }, () => {
            this.getList();
          });
        }
      });
    };

    /**
     * 改变筛选项
     */
    const changeFilter = (val: any) => {
      // console.log(val);
      this.setState({
        filterItems: val
      }, () => {
        onSearch();
      });
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
            <Button type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button>
            {/* 下面本页的筛选项 */}
            <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
              <Option value={'name'}>姓名</Option>
              <Option value={'email'}>邮箱</Option>
              <Option value={'mobile'}>电话号码</Option>
              <Option value={'roles'}>角色</Option>
              <Option value={'is_active'}>有效用户</Option>
            </Select>
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面本页的筛选内容，根据筛选项选择显示 */}
            {
              this.state.filterItems && this.state.filterItems.length > 0 &&
              <div className="filter-content">
                <Form className="filter-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  {/* {
                    this.state.filterItems.indexOf('s_username') >= 0 &&
                    <Form.Item label="用户名">
                      {getFieldDecorator('s_username', {
                        rules: [],
                      })(
                        <Input placeholder="请输入用户名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  } */}

                  {
                    this.state.filterItems.indexOf('name') >= 0 &&
                    <Form.Item label="姓名">
                      {getFieldDecorator('name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入用户姓名（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('email') >= 0 &&
                    <Form.Item label="邮箱">
                      {getFieldDecorator('email', {
                        rules: [],
                      })(
                        <Input placeholder="请输入用户邮箱地址（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('mobile') >= 0 &&
                    <Form.Item label="手机">
                      {getFieldDecorator('mobile', {
                        rules: [],
                      })(
                        <Input placeholder="请输入手机（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('roles') >= 0 &&
                    <Form.Item label="角色">
                      {getFieldDecorator('roles', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {roleList.map((role: any) => (
                            <Option value={role.id} key={role.id}>{role.name_zn}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('is_active') >= 0 &&
                    <Form.Item label="有效用户">
                      {getFieldDecorator('is_active', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {this.validateList.map((validate: any) => (
                            <Option value={validate.id} key={validate.id}>{validate.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" onClick={onSearch}>查询</Button>
                  </Form.Item>
                </Form>
              </div>
            }
            {/* 下面是本页的内容 */}
            <Table
              columns={column}
              rowKey="id"
              dataSource={userList}
              bordered={true}
              pagination={{
                size: 'small',
                showQuickJumper: true,
                showSizeChanger: true,
                onChange: changePage,
                onShowSizeChange: changePageSize,
                total,
                current: page,
                pageSize,
              }}
            />
          </div>
        </div>
        {
          this.state.showAdd &&
          <Modal
            title={this.state.editData ? '修改' : '新增'}
            visible={this.state.showAdd}
            onOk={onOk}
            maskClosable={false}
            onCancel={onCancel}
            centered={true}
            destroyOnClose={true}
            width={600}
          >
            {<AddEditModal
              form={this.props.form}
              editData={this.state.editData}
              roleList={roleList}
              domainList={domainList}
              groupList={groupList}
            />}
          </Modal>
        }
      </div >
    );
  }
}

export default Form.create({})(User);
