import * as React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { progress } from 'src/api';
import {
  Button,
  Form,
  message,
  Table,
  Divider,
  Popconfirm,
  Modal,
  Select,
  Input,
  Tabs,
  DatePicker,
} from 'antd';
import AddEditModal from './addEditForm';
import AchievementDrawer from './achievementDrawer';

import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';

const { Option } = Select;
const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  defaultActiveKey: string;
  page: number;
  pageSize: number;
  total: number;
  achievementList: any;
  dictList: any;
  showAdd: boolean;
  editAble: boolean;
  editData: any;
  filterItems: string[];
  filterParam: any;
  showAchievementDrawer: boolean;
  achievementDrawerData: any;
  uploadedFiles: any;
}

/**
 * Award
 */
class Award extends React.PureComponent<IProps, IState> {
  fileIdsForAddOrEdit: any[];
  constructor(props: any) {
    super(props);
    this.state = {
      defaultActiveKey: '1',
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      achievementList: [], // 业绩列表
      dictList: [], // 数据字典列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
      uploadedFiles: [],
      editAble: false,
      showAchievementDrawer: false,
      achievementDrawerData: null,
    };
    this.fileIdsForAddOrEdit = [];
  }

  UNSAFE_componentWillMount() {
    this.getList();

    this.getDictList();
  }

  /*
   * 获取上传的文件ID
   */
  updateFileIds = (ids: any) => {
    this.fileIdsForAddOrEdit = ids;
  }

  /*
   * 获取教学成果列表
   */
  getList = async () => {
    let param: any = {
      page: this.state.page,
      page_size: this.state.pageSize,
      type: this.state.defaultActiveKey,
    };

    console.log(this.state.filterParam);
    // 增加筛选条件
    if (this.state.filterParam) {
      if (this.state.filterParam.award_date_from) {
        param.award_date_from = moment(this.state.filterParam.award_date_from).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.award_date_to) {
        param.award_date_to = moment(this.state.filterParam.award_date_to).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.lecture_date_from) {
        param.lecture_date_from = moment(this.state.filterParam.lecture_date_from).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.lecture_date_to) {
        param.lecture_date_to = moment(this.state.filterParam.lecture_date_to).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.award_authoriry_organization) {
        param.award_authoriry_organization = this.state.filterParam.award_authoriry_organization;
      }
      if (this.state.filterParam.lecture_content) {
        param.lecture_content = this.state.filterParam.lecture_content;
      }
      if (this.state.filterParam.lecture_organization) {
        param.lecture_organization = this.state.filterParam.lecture_organization;
      }
    }

    const res = await progress.getAwardAchievementList(param);
    // console.log(res.code);
    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        achievementList: res.results.data,
        total: res.results.total
      });
    }
  }

  /*
   * 显示是否
   */
  yesOrNoOptions = (value: any) => {
    if (value) {
      return '是';
    }
    return '否';
  }

  /*
   * 获取职称数据字典
   */
  getDictList = async () => {
    const res = await progress.getDictList({
      'category_name': [
        'award_type',
        'award_level',
        'achievement_type',
        'award_position',
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

  /*
   * 是否获奖选项
   */
  awardList = [
    { id: 0, label: '否' },
    { id: 1, label: '是' },
  ];

  render() {

    const {
      total,
      page,
      pageSize,
      achievementList,
      dictList,
    } = this.state;

    const { getFieldDecorator } = this.props.form;

    /**
     * 删除一行数据
     */
    const del = async (record: any) => {
      const param = {};
      const res = await progress.delAwardAchievement(record.id, param);
      if (res.code) {
        message.error(res.msg);
        return;
      }
      message.success('教学删除成功');
      this.getList();
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
     * 改变选项卡
     */
    const changeTab = (val: string) => {
      // console.log(val);
      this.setState({
        defaultActiveKey: val,
        page: 1,
        pageSize: 10,
        filterItems: [],
        filterParam: {},
      }, () => {
        this.getList();
      });
    };

    /*
     * 获取数据字典中某个类别的列表
     */
    const getOption = (keyName: string, range?: any): any[] => {
      const list: any[] = [];
      if (!_.isEmpty(dictList)) {
        const data = dictList[keyName];
        console.log(data);

        data.map((item: any) => {
          if (range) {
            if (range.find((i: any) => i === item.dict_value)) {
              list.push({
                value: item.dict_value,
                label: item.dict_name,
              });
            }
          } else {
            list.push({
              value: item.dict_value,
              label: item.dict_name,
            });
          }

        });
      }
      return list;
    };

    /*
    * 显示抽屉
    */
    const showDrawer = (record: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {
      if (achievementOrNot) {
        this.setState({
          showAchievementDrawer: true,
          achievementDrawerData: record
        });
      }
    };

    /*
    * 关闭抽屉
    */
    const onDrawerClose = (e: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {

      if (achievementOrNot) {
        this.setState({
          showAchievementDrawer: false,
          achievementDrawerData: null
        });
      }
    };

    /**
     * 列
     */
    let column;
    if (this.state.defaultActiveKey === '1') {
      column = [
        {
          title: '奖励类型',
          key: 'award_type',
          dataIndex: 'award_type',
          width: 200,
          render: (text: any, record: any) => {
            console.log(getOption('award_type'));
            return (
              <span>
                {text && _.find(getOption('award_type'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '表彰奖励内容',
          key: 'award_title',
          dataIndex: 'award_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '获奖级别',
          key: 'award_level',
          dataIndex: 'award_level',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && _.find(getOption('award_level'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '获奖等次',
          key: 'award_position',
          dataIndex: 'award_position',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && _.find(getOption('award_position'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '获奖时间',
          key: 'award_date',
          dataIndex: 'award_date',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && moment(text).format('YYYY-MM')}
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
    }

    /*
    * 显示添加
    */
    const showAdd = () => {
      this.setState({
        showAdd: true
      });
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
          params.type = this.state.defaultActiveKey;

          params.fileids = this.fileIdsForAddOrEdit;

          if (this.state.defaultActiveKey === '1') {
            if (params.award_date) {
              params.award_date = moment(params.award_date).format('YYYY-MM') + '-' + '01';
            }
          }

          if (this.state.editData) {

            res = await progress.editAwardAchievement(this.state.editData.id, params);
          } else {
            // 新增
            res = await progress.addAwardAchievement(params);
          }
          if (res.code) {
            message.error(res.msg);
            return;
          }
          message.success('荣誉数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields([
        'award_date_from',
        'award_date_to',
        'award_title',
        'award_authoriry_organization',
      ], async (err: boolean, values: any) => {
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
            {
              this.state.defaultActiveKey === '1'
              &&
              <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
                <Option value={'award_date_from'}>获奖时间（开始）</Option>
                <Option value={'award_date_to'}>获奖时间（结束）</Option>
                <Option value={'award_title'}>表彰奖励内容</Option>
                <Option value={'award_authoriry_organization'}>授奖单位</Option>
              </Select>
            }
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面本页的筛选内容，根据筛选项选择显示 */}
            {
              this.state.filterItems && this.state.filterItems.length > 0 &&
              <div className="filter-content">
                <Form className="filter-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  {this.state.filterItems.indexOf('award_date_from') >= 0 &&
                    <Form.Item label="获奖时间（开始）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('award_date_from', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {this.state.filterItems.indexOf('award_date_to') >= 0 &&
                    <Form.Item label="获奖时间（结束）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('award_date_to', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {this.state.filterItems.indexOf('award_title') >= 0 &&
                    <Form.Item label="表彰奖励内容">
                      {getFieldDecorator('award_title', {
                        rules: [],
                      })(
                        <Input placeholder="请输入表彰奖励内容（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {this.state.filterItems.indexOf('award_authoriry_organization') >= 0 &&
                    <Form.Item label="授奖单位">
                      {getFieldDecorator('award_authoriry_organization', {
                        rules: [],
                      })(
                        <Input placeholder="请输入授奖单位（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {this.state.filterItems.indexOf('lecture_date_from') >= 0 &&
                    <Form.Item label="讲座、示范课时间（开始）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('lecture_date_from', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {this.state.filterItems.indexOf('lecture_date_to') >= 0 &&
                    <Form.Item label="讲座、示范课时间（结束）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('lecture_date_to', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {this.state.filterItems.indexOf('lecture_content') >= 0 &&
                    <Form.Item label="讲座内容）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('lecture_content', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {this.state.filterItems.indexOf('lecture_organization') >= 0 &&
                    <Form.Item label="主办单位" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('lecture_organization', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" onClick={onSearch}>查询</Button>
                  </Form.Item>
                </Form>
              </div>
            }
            {/* 下面是本页的内容 */}
            <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
              <TabPane tab="荣誉&其他" key="1" />
            </Tabs>
            {this.state.defaultActiveKey === '1' &&
              <Table
                columns={column}
                rowKey="id"
                dataSource={achievementList}
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
            }
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
            width={800}
          >
            {<AddEditModal
              form={this.props.form}
              editData={this.state.editData}
              defaultActiveKey={this.state.defaultActiveKey}
              getOption={getOption}
              updateFileIds={this.updateFileIds}
            />}
          </Modal>
        }
        {
          this.state.showAchievementDrawer
          && <AchievementDrawer
            drawerData={this.state.achievementDrawerData}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showAchievementDrawer}
            type={this.state.defaultActiveKey}
            yesOrNoOptions={this.yesOrNoOptions}
            getOption={getOption}
          />
        }
      </div >
    );
  }
}

export default Form.create({})(Award);
