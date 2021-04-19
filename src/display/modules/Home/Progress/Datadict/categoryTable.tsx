import * as React from 'react';
import {
  // Form,
  // Input,
  Button,
  Divider,
  Table,
  Popconfirm,
  message,
  Modal,
} from 'antd';
// import CommonUtils from 'src/utils/commonUtils';

import { progress } from 'src/api';
import AddEditModal from './addEditForm';

// const FormItem = Form.Item;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  categoryData?: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  dictList: any;
  showAdd: boolean;
  editData: any;
}

/**
 * CategoryTableModal
 */
class CategoryTableModal extends React.PureComponent<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      dictList: [], // 数据字典列表
      showAdd: false,
      editData: null,
    };

  }

  UNSAFE_componentWillMount() {
    this.getList();
  }

  /*
   * 获取数据字典列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize,
      category_name: this.props.categoryData.category_name,
    };

    const res = await progress.getDicts(param);
    console.log(res.results.data);
    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        dictList: res.results.data,
        total: res.results.total
      });
    }
  }

  render() {
    // const {
    //   categoryData,
    // } = this.props;

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
     * 打开修改数据modal
     */
    const showEdit = (record: any) => {
      this.setState({
        showAdd: true,
        editData: record,
      });
    };

    /**
     * 打开新增数据modal
     */
    const showAdd = (record: any) => {
      this.setState({
        showAdd: true,
        editData: null,
      });
    };

    /**
     * 删除一行数据
     */
    const del = async (record: any) => {
      const param = {};
      const res = await progress.deleteDictData(param, record.id);
      if (res.code) {
        message.error(res.msg);
        return;
      }
      message.success('数据删除成功');
      this.getList();
    };

    /**
     * 模态窗取消
     */
    const onCancel = () => {
      this.setState({
        showAdd: false,
        editData: null
      });
      // 删除临时上传的文件
    };

    /**
     * 模态窗保存
     */
    const onOk = () => {
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        if (!err) {
          let res: any = null;
          let params: any = null;
          params = { ...values };

          if (this.state.editData) {

            res = await progress.editDictData(params, this.state.editData.id);
          } else {
            // 新增
            params.dict_category = this.props.categoryData.id;
            res = await progress.addDictData(params);
          }
          if (res.code) {
            message.error(res.msg);
            return;
          }
          message.success('数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    const {
      dictList,
      page,
      pageSize,
      total
    } = this.state;
    // const { getFieldDecorator } = this.props.form;

    let columns = [
      {
        title: '字典备注',
        key: 'remark',
        dataIndex: 'remark',
        width: 100,
      },
      {
        title: '字典标号',
        key: 'dict_code',
        dataIndex: 'dict_code',
        width: 100,
      },
      {
        title: '字典显示名称',
        key: 'dict_name',
        dataIndex: 'dict_name',
        width: 200,
      },
      {
        title: '字典值',
        key: 'dict_value',
        dataIndex: 'dict_value',
        width: 100,
      },
      {
        title: '字典排序',
        key: 'order_sort',
        dataIndex: 'order_sort',
        width: 100,
      },
      {
        title: '',
        key: 'action',
        dataIndex: 'action',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <div>
              <Button type="primary" onClick={() => showAdd(record)}>增加</Button>
              <Divider type="vertical" />
              <Button type="primary" onClick={() => showEdit(record)}>修改</Button>
              <Divider type="vertical" />
              <Popconfirm title="确认删除吗?" onConfirm={() => del(record)}>
                <Button type="danger">删除</Button>
              </Popconfirm>
            </div>
          );
        }
      },
    ];

    return (
      <div>
        <Table
          columns={columns}
          rowKey="id"
          dataSource={dictList}
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
            width={800}
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

export default CategoryTableModal;
