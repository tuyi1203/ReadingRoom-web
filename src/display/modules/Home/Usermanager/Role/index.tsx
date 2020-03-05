import * as React from 'react';
import moment from 'moment';
import * as _ from 'lodash';
import { usermanager, system } from 'src/api';
import { Button, Form, message, Table, Divider, Popconfirm, Modal, Select, Input } from 'antd';
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
  roleList: any;
  showAdd: boolean;
  editData: any;
  filterItems: string[];
  filterParam: any;
}

/**
 * User
 */
class Role extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      roleList: [], // 角色列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
    };
  }

  UNSAFE_componentWillMount() {
    // this.getList();
    // this.getDomainList();
    // this.getGroupList();
    // this.getRoleList();
  }

  /*
   * 获取用户列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize
    };

    // 增加筛选条件
    if (this.state.filterParam) {
      if (this.state.filterParam.s_username) {
        param.username__icontains = this.state.filterParam.s_username;
      }
      if (this.state.filterParam.s_aliasname) {
        param.aliasname__icontains = this.state.filterParam.s_aliasname;
      }
      if (this.state.filterParam.s_email) {
        param.email__icontains = this.state.filterParam.s_email;
      }
      if (this.state.filterParam.s_telephone) {
        param.telephone__icontains = this.state.filterParam.s_telephone;
      }
      if (this.state.filterParam.s_role) {
        param.role = this.state.filterParam.s_role;
      }
      if (this.state.filterParam.s_validate) {
        param.validate = this.state.filterParam.s_validate;
      }
    }

    const res = await usermanager.getList(param);
    // console.log(res.code);
    if (!res.code) {
      return;
    }

    if (res) {
      this.setState({
        total: res.results.count
      });
    }
  }

  /*
   * 获取角色列表
   */
  getRoleList = async () => {
    const res = await system.getRole();
    // console.log(res.code);
    if (!res.code) {
      return;
    }

    if (res) {
      this.setState({
        roleList: res.results.data,
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
      roleList,
    } = this.state;

    const { getFieldDecorator } = this.props.form;

    /**
     * 删除一行数据
     */
    const del = async (record: any) => {
      const param = {
        id: record.id,
        domain_id: record.domain_id,
        username: record.username
      };
      const res = await usermanager.del(record.id, param);
      if (res && !res.code) {
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
        title: '用户名',
        key: 'username',
        dataIndex: 'username',
        width: 200,
      },
      {
        title: '姓名',
        key: 'alias_name',
        dataIndex: 'alias_name',
        width: 200,
      },
      {
        title: '角色',
        key: 'role',
        dataIndex: 'role',
        width: 200,
        render: (text: any) => {
          // roleList.push({
          //   description: '神秘用户',
          //   id: 3
          // });
          const role = _.find(roleList, ['id', text]);
          const roleName = role ? role.description : '';
          return (<span>{roleName}</span>);
        }
      },
      {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
        width: 200,
      },
      {
        title: '有效用户',
        key: 'validate',
        dataIndex: 'validate',
        width: 200,
        render: (text: any, record: any) => {
          return text ? '是' : '否';
        }
      },
      {
        title: '手机',
        key: 'telephone',
        dataIndex: 'telephone',
        width: 200,
      },
      {
        title: '创建日期',
        key: 'create_date',
        dataIndex: 'create_date',
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
        title: '最近登陆',
        key: 'last_login',
        dataIndex: 'last_login',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <span>
              {text ? moment(text).format('YYYY-MM-DD & HH:mm:ss') : ''}
            </span>
          );
        }
      },
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
            values.id = this.state.editData.id; // body中追加userId
            res = await usermanager.edit(this.state.editData.id, values);
          } else {
            // 新增
            res = await usermanager.add(values);
          }
          if (!res.code) {
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
      this.props.form.validateFields(['s_username', 's_aliasname', 's_email', 's_telephone', 's_role', 's_validate'], async (err: boolean, values: any) => {
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
            {/* <Button type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button> */}
            {/* 下面本页的筛选项 */}
            <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
              <Option value={'s_username'}>用户名</Option>
              <Option value={'s_aliasname'}>姓名</Option>
              <Option value={'s_email'}>邮箱</Option>
              <Option value={'s_telephone'}>电话号码</Option>
              <Option value={'s_role'}>角色</Option>
              <Option value={'s_validate'}>有效用户</Option>
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
                  {
                    this.state.filterItems.indexOf('s_username') >= 0 &&
                    <Form.Item label="用户名">
                      {getFieldDecorator('s_username', {
                        rules: [],
                      })(
                        <Input placeholder="请输入用户名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }

                  {
                    this.state.filterItems.indexOf('s_aliasname') >= 0 &&
                    <Form.Item label="姓名">
                      {getFieldDecorator('s_aliasname', {
                        rules: [],
                      })(
                        <Input placeholder="请输入用户姓名（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_email') >= 0 &&
                    <Form.Item label="邮箱">
                      {getFieldDecorator('s_email', {
                        rules: [],
                      })(
                        <Input placeholder="请输入用户邮箱地址（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_telephone') >= 0 &&
                    <Form.Item label="手机">
                      {getFieldDecorator('s_telephone', {
                        rules: [],
                      })(
                        <Input placeholder="请输入手机（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_role') >= 0 &&
                    <Form.Item label="角色">
                      {getFieldDecorator('s_role', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {roleList.map((role: any) => (
                            <Option value={role.id} key={role.id}>{role.description}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_validate') >= 0 &&
                    <Form.Item label="有效用户">
                      {getFieldDecorator('s_validate', {
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
              dataSource={roleList}
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
            />}
          </Modal>
        }
      </div >
    );
  }
}

export default Form.create({})(Role);
