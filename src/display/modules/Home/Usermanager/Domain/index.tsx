import * as React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { usermanagerdomains } from 'src/api';
import { Button, Form, message, Table, Divider, Popconfirm, Modal } from 'antd';
import AddEditModal from './addEditForm';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
import { Link } from 'react-router-dom';
import UserInfoDrawer from './userInfoDrawer';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  domainList: any;
  userList: any;
  showAdd: boolean;
  editData: any;
  showDrawer: boolean;
  drawerData: any;
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
      domainList: [], // 组织列表
      userList: [], // 管理员列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      showDrawer: false, // 是否显示抽屉
      drawerData: null, // 抽屉显示数据
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
  }

  /**
   * 组织类型
   */
  domainTypes = [{
    label: '内部组织',
    value: true
  }, {
    label: '外部组织',
    value: false
  }];

  /*
   * 获取组织列表
   */
  getList = async () => {
    // console.log(this.state.defaultActiveKey);
    const res = await usermanagerdomains.getList({
      page: this.state.page,
      page_size: this.state.pageSize
    });
    // console.log(res.code);
    if (!res.code) {
      return;
    }

    if (res) {
      this.setState({
        domainList: res.results.data,
        total: res.results.count
      });
    }
  }

  /*
   * 获取授权用户列表
   */
  getUserList = async (record: any) => {
    // console.log(this.state.defaultActiveKey);
    const res = await usermanagerdomains.getDetail(record.id, {});

    if (!res.code) {
      return;
    }

    if (res) {
      this.setState({
        userList: res.results.admin_user_info,
      });
    }
  }

  render() {

    const {
      total,
      page,
      pageSize,
      domainList,
    } = this.state;

    /**
     * 删除一行数据
     */
    const del = async (record: any) => {
      const param = {
        id: record.id,
        name: record.name,
      };
      const res = await usermanagerdomains.del(record.id, param);
      if (res && !res.code) {
        message.error(res.msg);
        return;
      }
      message.success('组织数据删除成功');
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
     * 组织列
     */
    const column = [
      {
        title: '组织名',
        key: 'name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '组织类别',
        key: 'internal_domain',
        dataIndex: 'internal_domain',
        width: 200,
        render: (text: any, record: any) => {
          return (_.find(this.domainTypes, ['value', text])?.label);
        }
      },
      {
        title: '工作空间',
        key: 'group_count',
        dataIndex: 'group_count',
        width: 200,
        render: (text: any, record: any) => {
          return (<span><Link to="/usermanager/domain">{text}</Link></span>);
        }
      },
      {
        title: '组织管理员',
        key: 'domain_admin_role_count',
        dataIndex: 'domain_admin_role_count',
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
          if (this.state.editData) {
            // 编辑
            values.id = this.state.editData.id;
            res = await usermanagerdomains.edit(this.state.editData.id, values);
          } else {
            // 新增
            res = await usermanagerdomains.add(values);
          }
          if (!res.code) {
            message.error(res.msg);
            return;
          }
          message.success('组织数据保存成功');
          onCancel();
          this.getList();
        }
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
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面是本页的内容 */}
            <Table
              columns={column}
              rowKey="id"
              dataSource={domainList}
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
              domainTypes={this.domainTypes}
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
