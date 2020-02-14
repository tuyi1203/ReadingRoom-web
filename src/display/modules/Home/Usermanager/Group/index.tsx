import * as React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { usermanagergroups, usermanagerdomains } from 'src/api';
import { Button, Form, message, Table, Divider, Popconfirm, Modal, Select, Input } from 'antd';
import AddEditModal from './addEditForm';
import UserInfoDrawer from './userInfoDrawer';
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
  groupList: any;
  userList: any;
  domainList: any;
  showAdd: boolean;
  editData: any;
  showDrawer: boolean;
  drawerData: any;
  filterItems: string[];
  filterParam: any;
}

/**
 * Domain
 */
class Domain extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      groupList: [], // 工作空间列表
      userList: [], // 授权用户列表
      domainList: [], // 组织列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      showDrawer: false, // 是否显示抽屉
      drawerData: null, // 抽屉显示数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
  }

  /*
   * 获取工作空间列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize
    };

    // 增加筛选条件
    if (this.state.filterParam) {
      if (this.state.filterParam.s_groupname) {
        param.groupname__icontains = this.state.filterParam.s_groupname;
      }
      if (this.state.filterParam.s_domainname) {
        param.domainname = this.state.filterParam.s_domainname;
      }
    }

    const res = await usermanagergroups.getList(param);

    const domainRes = await usermanagerdomains.getList({});
    // console.log(res.code);
    if (!res.code || !domainRes.code) {
      return;
    }

    if (res && domainRes) {
      this.setState({
        groupList: res.results.data,
        domainList: domainRes.results.data,
        total: res.results.count
      });
    }
  }

  /*
   * 获取授权用户列表
   */
  getUserList = async (record: any) => {
    // console.log(this.state.defaultActiveKey);
    const res = await usermanagergroups.getDetail(record.id, {});

    if (!res.code) {
      return;
    }

    if (res) {
      this.setState({
        userList: res.results.authorized_user_info,
      });
    }
  }

  render() {

    const {
      total,
      page,
      pageSize,
      groupList,
      domainList
    } = this.state;

    const { getFieldDecorator } = this.props.form;

    /**
     * 删除一行数据
     */
    const del = async (record: any) => {
      const param = {
        id: record.id,
        name: record.name,
        domain_id: record.domain_id,
        domain_name: record.domain_name,
      };
      const res = await usermanagergroups.del(record.id, param);
      if (res && !res.code) {
        message.error(res.msg);
        return;
      }
      message.success('数据删除成功');
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

    /*
    * 显示抽屉
    */
    const showDrawer = (record: any) => {
      this.getUserList(record);
      this.setState({
        showDrawer: true,
        drawerData: record
      });
      // console.log(this.state.showDrawer);
    };

    /*
    * 关闭抽屉
    */
    const onDrawerClose = () => {
      this.setState({
        showDrawer: false,
        drawerData: null
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
     * 工作空间列
     */
    const column = [
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '组织',
        key: 'domain_name',
        dataIndex: 'domain_name',
        width: 200,
      },
      {
        title: '授权用户',
        key: 'authorized_user_count',
        dataIndex: 'authorized_user_count',
        width: 200,
        render: (text: any, record: any) => {
          return (<span><a onClick={() => showDrawer(record)}>{text}</a></span>);
        }
      },
      {
        title: '描述',
        key: 'description',
        dataIndex: 'description',
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
          values.domain_name = _.find(domainList, ['id', values.domain_id])?.name;
          if (this.state.editData) {
            // 编辑
            values.id = this.state.editData.id;
            res = await usermanagergroups.edit(this.state.editData.id, values);
          } else {
            // 新增
            res = await usermanagergroups.add(values);
          }
          if (!res.code) {
            message.error(res.msg);
            return;
          }
          message.success('工作空间数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['s_groupname', 's_domainname'], async (err: boolean, values: any) => {
        if (!err) {
          this.setState({
            filterParam: values
          }, () => {
            console.log(this.state.filterParam);
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
              <Option value={'s_groupname'}>工作空间名称</Option>
              <Option value={'s_domainname'}>上级组织</Option>
            </Select>
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面是本页的内容 */}
            {/* 下面本页的筛选内容，根据筛选项选择显示 */}
            {
              this.state.filterItems && this.state.filterItems.length > 0 &&
              <div className="filter-content">
                <Form className="filter-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  {
                    this.state.filterItems.indexOf('s_groupname') >= 0 &&
                    <Form.Item label="工作空间名称">
                      {getFieldDecorator('s_groupname', {
                        rules: [],
                      })(
                        <Input placeholder="请输入工作空间名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_domainname') >= 0 &&
                    <Form.Item label="上级组织">
                      {getFieldDecorator('s_domainname', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {domainList.map((domain: any) => (
                            <Option value={domain.name} key={domain.name}>{domain.name}</Option>
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
            <Table
              columns={column}
              rowKey="id"
              dataSource={groupList}
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
              domainList={domainList}
            />}
          </Modal>
        }
        {
          <UserInfoDrawer
            drawerData={this.state.drawerData}
            onClose={onDrawerClose}
            visible={this.state.showDrawer}
            userList={this.state.userList}
          />
        }
      </div >
    );
  }
}

export default Form.create({})(Domain);
