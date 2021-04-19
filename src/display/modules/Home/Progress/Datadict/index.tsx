import * as React from 'react';
// import moment from 'moment';
import * as _ from 'lodash';
import { progress } from 'src/api';
import {
  Button,
  Form,
  message,
  Table,
  Divider,
  Popconfirm,
  Modal,
  // Select, 
  // Input, 
  // Tabs, 
  // DatePicker
} from 'antd';
import CategoryTableModal from './categoryTable';

import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  location: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  // dictCategoryId: number;
  // dictCategoryName: string;
  page: number;
  pageSize: number;
  total: number;
  dictList: any;
  // showAdd: boolean;
  editData: any;
  categoryData: any;
  filterItems: string[];
  filterParam: any;
  showCategoryTable: boolean;
}

/**
 * Datadict
 */
class Datadict extends React.PureComponent<IProps, IState> {

  // dictCategoryId?: number;

  // dictCategoryName?: string;

  constructor(props: any) {
    super(props);
    this.state = {
      // dictCategoryId: -1,
      // dictCategoryName: '',
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      dictList: [], // 数据字典列表
      // showAdd: false, // 是否显示添加
      editData: null, // 字典编辑数据
      categoryData: null, // 字典类别数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
      showCategoryTable: false,
    };
  }

  UNSAFE_componentWillMount() {

    // console.log(this.props, this.dictCategoryName);
    // this.getCategoryId();
    this.getList();

  }

  /*
   * 获取类型ID
   */
  getCategoryId = async () => {
    let dictCategoryName = this.props.location.pathname.substring(this.props.location.pathname.lastIndexOf('/') + 1);
    const param: any = {
      category_name: dictCategoryName
    };

    const res = await progress.getDictCategory(param);
    // console.log(res.code);
    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        // dictCategoryName: dictCategoryName,
        // dictCategoryId: res.results.data[0].id,
      }, () => {
        this.getList();
      });
    }

  }

  /*
   * 获取数据字典列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize,
      // category_name: this.state.dictCategoryName,
    };

    const res = await progress.getDictCategory(param);
    console.log(res.results.data.data);
    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        dictList: res.results.data.data,
        total: res.results.data.total
      });
    }
  }

  render() {
    const {
      total,
      page,
      pageSize,
      dictList,
      // dictCategoryName,
    } = this.state;

    // if (this.props.location.pathname.substring(this.props.location.pathname.lastIndexOf('/') + 1)
    //   !== dictCategoryName) {
    //   this.getCategoryId();
    // }

    // const { getFieldDecorator } = this.props.form;

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
     * 显示编辑
     */
    // const showEdit = (record: any) => {
    //   this.setState({
    //     editData: record,
    //     showAdd: true
    //   });
    // };

    /**
     * 显示详情
     */
    const showCategoryTable = (record: any) => {
      this.setState({
        categoryData: record,
        showCategoryTable: true
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
     * 获取数据字典中某个类别的列表
     */
    // const getOption = (keyName: string): any[] => {
    //   const list: any[] = [];
    //   if (!_.isEmpty(dictList)) {
    //     const data = dictList[keyName];
    //     console.log(data);

    //     data.map((item: any) => {
    //       list.push({
    //         value: item.dict_value,
    //         label: item.dict_name,
    //       });
    //     });
    //   }
    //   return list;
    // };

    /**
     * 列
     */
    let column = [
      {
        title: '字典标识',
        key: 'category_name',
        dataIndex: 'category_name',
        width: 200,
      },
      {
        title: '字典显示名称',
        key: 'remark',
        dataIndex: 'remark',
        width: 200,
      },
      {
        title: '字典排序',
        key: 'order_sort',
        dataIndex: 'order_sort',
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
              <Button type="primary" onClick={() => showCategoryTable(record)}>详情</Button>
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
     * 数据字典分类模态窗取消
     */
    const onCategoryTableCancel = () => {
      this.setState({
        showCategoryTable: false,
        categoryData: null
      });
    };

    /**
     * 改变筛选项
     */
    // const changeFilter = (val: any) => {
    //   // console.log(val);
    //   this.setState({
    //     filterItems: val
    //   }, () => {
    //     onSearch();
    //   });
    // };

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
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面本页的筛选内容，根据筛选项选择显示 */}
            {/* {
              this.state.filterItems && this.state.filterItems.length > 0 &&
              <div className="filter-content">
                <Form className="filter-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  {
                    this.state.filterItems.indexOf('paper_title') >= 0 &&
                    <Form.Item label="论文名称">
                      {getFieldDecorator('paper_title', {
                        rules: [],
                      })(
                        <Input placeholder="请输入论文名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('paper_date_from') >= 0 &&
                    <Form.Item label="论文发表时间（开始）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('paper_date_from', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {
                    this.state.filterItems.indexOf('paper_date_to') >= 0 &&
                    <Form.Item label="论文发表时间（结束）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('paper_date_to', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {
                    this.state.filterItems.indexOf('award') >= 0 &&
                    <Form.Item label="是否获奖">
                      {getFieldDecorator('award', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {this.awardList.map((item: any) => (
                            <Option value={item.id} key={item.id}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('subject_title') >= 0 &&
                    <Form.Item label="课题名称">
                      {getFieldDecorator('subject_title', {
                        rules: [],
                      })(
                        <Input placeholder="请输入课题名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('subject_responseable_man') >= 0 &&
                    <Form.Item label="课题负责人">
                      {getFieldDecorator('subject_responseable_man', {
                        rules: [],
                      })(
                        <Input placeholder="请输入课题负责人（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('subject_status') >= 0 &&
                    <Form.Item label="课题状态">
                      {getFieldDecorator('subject_status', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {getOption('subject_status').map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('book_title') >= 0 &&
                    <Form.Item label="著作名称">
                      {getFieldDecorator('book_title', {
                        rules: [],
                      })(
                        <Input placeholder="请输入著作名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('book_type') >= 0 &&
                    <Form.Item label="著作类别">
                      {getFieldDecorator('book_type', {
                        rules: [],
                      })(
                        <Input placeholder="请输入著作类别（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('book_publish_company_name') >= 0 &&
                    <Form.Item label="出版社名称">
                      {getFieldDecorator('book_publish_company_name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入出版社名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('book_publish_date_from') >= 0 &&
                    <Form.Item label="出版日期（开始）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('book_publish_date_from', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {
                    this.state.filterItems.indexOf('book_publish_date_to') >= 0 &&
                    <Form.Item label="出版日期（结束）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('book_publish_date_to', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {
                    this.state.filterItems.indexOf('copyright_type') >= 0 &&
                    <Form.Item label="专利或软件著作权类型">
                      {getFieldDecorator('copyright_type', {
                        rules: [],
                      })(
                        <Input placeholder="请输入专利或软件著作权类型（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('copyright_title') >= 0 &&
                    <Form.Item label="专利或软件著作权名称">
                      {getFieldDecorator('copyright_title', {
                        rules: [],
                      })(
                        <Input placeholder="请输入专利或软件著作权名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" onClick={onSearch}>查询</Button>
                  </Form.Item>
                </Form>
              </div>
            } */}
            {/* 下面是本页的内容 */}
            <Table
              columns={column}
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
          </div>
        </div>

        {
          this.state.showCategoryTable &&
          <Modal
            title="数据字典列表"
            visible={this.state.showCategoryTable}
            cancelText="关闭"
            footer={null}
            // onOk={onOk}
            keyboard={true}
            maskClosable={false}
            onCancel={onCategoryTableCancel}
            centered={true}
            destroyOnClose={true}
            width={1200}
          >
            {<CategoryTableModal
              form={this.props.form}
              categoryData={this.state.categoryData}
            />}
          </Modal>
        }
      </div >
    );
  }
}

export default Form.create({})(Datadict);
