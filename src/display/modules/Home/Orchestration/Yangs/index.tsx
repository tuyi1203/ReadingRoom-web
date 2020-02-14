import * as React from 'react';
import { yangs } from 'src/api';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
import { Button, Table, Form, Divider, Popconfirm, Modal, message, Input, Select } from 'antd';
import YangDetailDrawer from './yangDetailDrawer';
import AddEditModal from './addEditForm';

const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  yangsList: any;
  showDrawer: boolean;
  drawerData: any;
  showAdd: boolean;
  editData: any;
  filterItems: string[];
  filterParam: any;
}

/**
 * NetElementManager
 */
class Yangs extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      yangsList: [], // 编排数据列表
      showDrawer: false, // 是否显示抽屉
      drawerData: null, // 抽屉显示数据
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
  }

  /**
   * 获取编排模型数据列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize
    };

    // 增加筛选条件
    if (this.state.filterParam) {
      if (this.state.filterParam.s_name) {
        param.name__icontains = this.state.filterParam.s_name;
      }
      if (this.state.filterParam.s_description) {
        param.description__icontains = this.state.filterParam.s_description;
      }
    }

    const res = await yangs.getList(param);
    if (!res.code) {
      return;
    }
    // console.log(res);

    if (res) {
      this.setState({
        yangsList: res.results.data,
        total: res.results.count
      });
    }
  }

  render() {

    const { total, page, pageSize, yangsList } = this.state;
    const { getFieldDecorator } = this.props.form;
    /*
    * 显示抽屉
    */
    const showDrawer = (record: any) => {
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

    /*
     * 删除一行数据
     */
    const del = async (record: any) => {
      const res = await yangs.del(record.id, {});
      if (res && !res.code) {
        message.error(res.msg);
        return;
      }
      message.success('编排模型数据删除成功');
      this.getList();
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
     * 模态窗保存
     */
    const onOk = () => {
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        if (!err) {
          let res: any = null;
          if (this.state.editData) {
            // 编辑
            res = await yangs.edit(this.state.editData.id, values);
          } else {
            // 新增
            res = await yangs.add(values);
          }
          if (!res.code) {
            message.error(res.msg);
            return;
          }
          message.success('编排模型数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 编排列
     */
    const column = [
      {
        title: 'Yang模型',
        key: 'name',
        dataIndex: 'name',
        width: 300,
      },
      {
        title: '关联模块',
        key: 'description',
        dataIndex: 'description',
        width: 300,
        render: (text: any, record: any) => {
          return (<span><a onClick={() => showDrawer(record)}>{text}</a></span>);
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
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['s_name', 's_description'], async (err: boolean, values: any) => {
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
              <Option value={'s_name'}>yang模型</Option>
              <Option value={'s_description'}>关联模块</Option>
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
                    this.state.filterItems.indexOf('s_name') >= 0 &&
                    <Form.Item label="yang模型">
                      {getFieldDecorator('s_name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入yang模型名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_description') >= 0 &&
                    <Form.Item label="关联模块">
                      {getFieldDecorator('s_description', {
                        rules: [],
                      })(
                        <Input placeholder="请输入关联模块名称（支持模糊匹配）" />
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
              dataSource={yangsList}
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
        {this.state.showDrawer &&
          <YangDetailDrawer
            drawerData={this.state.drawerData}
            onClose={onDrawerClose}
            visible={this.state.showDrawer}
          />
        }
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
      </div>
    );
  }
}

export default Form.create({})(Yangs);