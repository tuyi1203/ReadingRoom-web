import * as React from 'react';
import { heatbeatgroups } from 'src/api';
import { Button, Form, Table, message, Divider, Popconfirm, Modal, Select, Input, } from 'antd';
import AddEditModal from './addEditForm';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
import _ from 'lodash';

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
  heatbeatGroupList: any;
  methodList: any;
  showAdd: boolean;
  editData: any;
  filterItems: string[];
  filterParam: any;
}

/**
 * heatbeatGroupList
 */
class Heatbeatgroups extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      heatbeatGroupList: [], // 冗余心跳列表
      methodList: [], // 测试方法列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
    this.getMethodList();
  }

  /**
   * 获取冗余心跳列表
   */
  getList = async () => {
    // console.log(this.state.defaultActiveKey);
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize
    };

    // 增加筛选条件
    if (this.state.filterParam) {
      if (this.state.filterParam.s_name) {
        param.name = this.state.filterParam.s_name;
      }
    }

    // 调用接口查询
    const res = await heatbeatgroups.getList(param);
    const methodRes = await heatbeatgroups.getMethodList({
      page: 1,
      page_size: 1000,
    });
    // console.log(res);
    if (!res.code || !methodRes.code) {
      return;
    }
    // 获取探测方式的名称
    if (res && methodRes) {
      const list: Array<any> = [];
      res.results.data.forEach((item, index) => {
        item.methodInfo = _.find(methodRes.results.data, ['id', item.method]);
        list.push(item);
      });
      this.setState({
        heatbeatGroupList: list,
        total: list.length
      });
    }
  }

  /*
  * 测试方法列表
  */
  getMethodList = async () => {
    // console.log(this.state.defaultActiveKey);
    let res;
    res = await heatbeatgroups.getMethodList({
      page: 1,
      page_size: 1000
    });

    // console.log(res);
    if (!res.code) {
      return;
    }

    if (res) {
      this.setState({
        methodList: res.results.data,
      });
    }
  }

  render() {

    const {
      total,
      page,
      pageSize,
      heatbeatGroupList,
      // methodList
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    /**
     * 删除一行数据
     */
    const del = async (record: any) => {
      const res = await heatbeatgroups.del(record.id, {});
      if (res && !res.code) {
        message.error(res.msg);
        return;
      }
      message.success('冗余心跳数据删除成功');
      this.getList();
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
     * 网元能力字典列
     */
    const column = [
      {
        title: '冗余组',
        key: 'name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '探测间隔（秒）',
        key: 'interval',
        dataIndex: 'interval',
        width: 200,
      },
      {
        title: '探测方式',
        key: 'methodInfo.name',
        dataIndex: 'methodInfo.name',
        width: 200,
      },
      {
        title: '等待时间',
        key: 'wait',
        dataIndex: 'wait',
        width: 200,
      },
      {
        title: '告警阈值',
        key: 'warning',
        dataIndex: 'warning',
        width: 200,
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
            res = await heatbeatgroups.edit(this.state.editData.id, values);
          } else {
            // 新增
            res = await heatbeatgroups.add(values);
          }
          if (!res.code) {
            message.error(res.msg);
            return;
          }
          message.success('冗余心跳数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['s_name', 's_method'], async (err: boolean, values: any) => {
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
              <Option value={'s_name'}>组名称</Option>
              <Option value={'s_method'}>探测方式</Option>
            </Select>
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面本页的筛选内容，根据筛选项选择显示 */}
            {
              this.state.filterItems && this.state.filterItems.length > 0 &&
              <div className="filter-content">
                <Form className="filter-form" layout="inline" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  {
                    this.state.filterItems.indexOf('s_name') >= 0 &&
                    <Form.Item label="组名称">
                      {getFieldDecorator('s_name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入组名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_method') >= 0 &&
                    <Form.Item label="探测方式">
                      {getFieldDecorator('s_method', {
                        rules: [],
                      })(
                        <Input placeholder="请输入探测方式" />
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
              dataSource={heatbeatGroupList}
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
              methodList={this.state.methodList}
            />}
          </Modal>
        }
      </div >
    );
  }
}

export default Form.create({})(Heatbeatgroups);