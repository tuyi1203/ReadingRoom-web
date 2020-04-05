import * as React from 'react';
import moment from 'moment';
import * as _ from 'lodash';
import { usermanager } from 'src/api';
import { Button, Form, message, Table, Divider, Popconfirm, Modal, Select, Input } from 'antd';
import AddEditModal from './addEditForm';
import PermissionForm from './permissionForm';
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
  showPermission: boolean;
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
      showPermission: false, // 显示角色权限数据
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
  }

  /*
   * 获取角色列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize
    };

    // 增加筛选条件
    if (this.state.filterParam) {
      if (this.state.filterParam.name) {
        param.name = this.state.filterParam.name;
      }
      if (this.state.filterParam.name_zn) {
        param.name_zn = this.state.filterParam.name_zn;
      }
    }

    const res = await usermanager.getRoleList(param);
    // console.log(res.code);
    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        total: res.results.total,
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

    console.log(roleList);
    const { getFieldDecorator } = this.props.form;

    /**
     * 删除一行数据
     */
    const del = async (record: any) => {
      const param = {
        id: record.id,
      };
      const res = await usermanager.delRole(record.id, param);
      if (!res || res.code) {
        message.error(res.msg);
        return;
      }
      message.success('角色删除成功');
      this.getList();
    };

    /*
    * 显示添加
    */
    const showAdd = () => {
      this.setState({
        showAdd: true
      });
    };

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
     * 显示权限窗
     */
    const showPermission = (record: any) => {
      this.setState({
        showPermission: true,
        editData: record,
      });
    };

    /**
     * 用户列
     */
    const column = [
      {
        title: '角色代号',
        key: 'name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '角色中文名称',
        key: 'name_zn',
        dataIndex: 'name_zn',
        width: 200,
      },
      // {
      //   title: '角色',
      //   key: 'role',
      //   dataIndex: 'role',
      //   width: 200,
      //   render: (text: any) => {
      //     // roleList.push({
      //     //   description: '神秘用户',
      //     //   id: 3
      //     // });
      //     const role = _.find(roleList, ['id', text]);
      //     const roleName = role ? role.description : '';
      //     return (<span>{roleName}</span>);
      //   }
      // },
      // {
      //   title: '邮箱',
      //   key: 'email',
      //   dataIndex: 'email',
      //   width: 200,
      // },
      // {
      //   title: '有效用户',
      //   key: 'validate',
      //   dataIndex: 'validate',
      //   width: 200,
      //   render: (text: any, record: any) => {
      //     return text ? '是' : '否';
      //   }
      // },
      // {
      //   title: '手机',
      //   key: 'telephone',
      //   dataIndex: 'telephone',
      //   width: 200,
      // },
      {
        title: '创建日期',
        key: 'create_at',
        dataIndex: 'create_at',
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
        key: 'update_at',
        dataIndex: 'update_at',
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
        title: '权限',
        key: 'permissions',
        dataIndex: 'permissions',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <span>
              <Button type="link" onClick={() => showPermission(record)}>配置</Button>
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
     * 模态窗取消
     */
    const onPermissionCancel = () => {
      this.setState({
        showPermission: false,
        editData: null
      });
    };

    /**
     * 权限模态窗保存
     */
    const onPermissionSave = async () => {
      console.log(this.state.editData.commitPermissions);
      const params = {
        'ids': this.state.editData.commitPermissions,
      };
      const res = await usermanager.editRolePermissions(
        this.state.editData.id,
        params,
      );
      if (res.code) {
        message.error(res.msg);
        return;
      }
      message.success('角色权限数据保存成功');
      onPermissionCancel();
      this.getList();
    };

    /**
     * 模态窗保存
     */
    const onOk = () => {
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        if (!err) {
          let res: any = null;
          // console.log(values);
          if (this.state.editData) {
            // 编辑
            values.id = this.state.editData.id; // body中追加userId
            res = await usermanager.editRole(this.state.editData.id, values);
          } else {
            // 新增y
            res = await usermanager.addRole(values);
          }
          if (res.code) {
            message.error(res.msg);
            return;
          }
          message.success('角色数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['name', 'name_zn'], async (err: boolean, values: any) => {
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
              <Option value={'name'}>用户名</Option>
              <Option value={'name_zn'}>姓名</Option>
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
                    this.state.filterItems.indexOf('name') >= 0 &&
                    <Form.Item label="角色代号">
                      {getFieldDecorator('name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入角色代号（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }

                  {
                    this.state.filterItems.indexOf('name_zn') >= 0 &&
                    <Form.Item label="角色中文名称">
                      {getFieldDecorator('name_zn', {
                        rules: [],
                      })(
                        <Input placeholder="请输入用户姓名（支持模糊匹配）" />
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
            />}
          </Modal>
        }
        {
          this.state.showPermission &&
          <Modal
            title={'权限配置'}
            visible={this.state.showPermission}
            onOk={onPermissionSave}
            maskClosable={false}
            onCancel={onPermissionCancel}
            centered={true}
            destroyOnClose={true}
            width={1000}
          >
            {<PermissionForm
              form={this.props.form}
              editData={this.state.editData}
            />}
          </Modal>
        }
      </div >
    );
  }
}

export default Form.create({})(Role);
