import * as React from 'react';
import moment from 'moment';
import * as _ from 'lodash';
import { progress } from 'src/api';
import { Button, Form, message, Table, Divider, Popconfirm, Modal, Select, Input, Tabs, DatePicker } from 'antd';
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
  editData: any;
  filterItems: string[];
  filterParam: any;
  showAchievementDrawer: boolean;
  achievementDrawerData: any;
}

/**
 * Teach
 */
class Teach extends React.PureComponent<IProps, IState> {
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
   * 获取教育成果列表
   */
  getList = async () => {
    let param: any = {
      page: this.state.page,
      page_size: this.state.pageSize,
      type: this.state.defaultActiveKey
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
      if (this.state.filterParam.manage_exp_communicate_from) {
        param.manage_exp_communicate_from = moment(this.state.filterParam.manage_exp_communicate_from).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.manage_exp_communicate_to) {
        param.manage_exp_communicate_to = moment(this.state.filterParam.manage_exp_communicate_to).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.award_main) {
        param.award_main = this.state.filterParam.award_main;
      }
      if (this.state.filterParam.manage_exp_communicate_content) {
        param.manage_exp_communicate_content = this.state.filterParam.manage_exp_communicate_content;
      }
      if (this.state.filterParam.teacher_guide_name) {
        param.teacher_guide_name = this.state.filterParam.teacher_guide_name;
      }
      if (this.state.filterParam.teacher_guide_content) {
        param.teacher_guide_content = this.state.filterParam.teacher_guide_content;
      }
    }

    const res = await progress.getTeachAchievementList(param);
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
      const res = await progress.delTeachAchievement(record.id, param);
      if (res.code) {
        message.error(res.msg);
        return;
      }
      message.success('研究成果删除成功');
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
    const getOption = (keyName: string): any[] => {
      const list: any[] = [];
      if (!_.isEmpty(dictList)) {
        const data = dictList[keyName];
        console.log(data);

        data.map((item: any) => {
          list.push({
            value: item.dict_value,
            label: item.dict_name,
          });
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
          title: '成果类型',
          key: 'achievement_type',
          dataIndex: 'achievement_type',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && _.find(getOption('achievement_type'), ['value', text.toString()])?.label}
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
          title: '表彰主体(本人、本人所带班队、本人所带学生)',
          key: 'award_title',
          dataIndex: 'award_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
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
          title: '本人作用',
          key: 'award_role',
          dataIndex: 'award_role',
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
    }

    if (this.state.defaultActiveKey === '2') {
      column = [
        {
          title: '交流管理经验时间',
          key: 'manage_exp_communicate_date',
          dataIndex: 'manage_exp_communicate_date',
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
          title: '交流管理经验内容',
          key: 'manage_exp_communicate_content',
          dataIndex: 'manage_exp_communicate_content',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '本人作用',
          key: 'manage_exp_communicate_role',
          dataIndex: 'manage_exp_communicate_role',
          width: 200,
        },
        {
          title: '交流范围',
          key: 'manage_exp_communicate_range',
          dataIndex: 'manage_exp_communicate_range',
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
    }

    if (this.state.defaultActiveKey === '3') {
      column = [
        {
          title: '指导开始时间',
          key: 'teacher_guide_date_start',
          dataIndex: 'teacher_guide_date_start',
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
          title: '指导结束时间',
          key: 'teacher_guide_date_end',
          dataIndex: 'teacher_guide_date_end',
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
          title: '指导对象姓名',
          key: 'teacher_guide_name',
          dataIndex: 'teacher_guide_name',
          width: 200,
        },
        {
          title: '指导内容',
          key: 'teacher_guide_content',
          dataIndex: 'teacher_guide_content',
          width: 200,
        },
        {
          title: '指导效果及荣誉和备注',
          key: 'teacher_guide_effect',
          dataIndex: 'teacher_guide_effect',
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
          if (params.award) {
            params.award = 1;
          } else {
            params.award = 0;
          }

          params.fileids = this.fileIdsForAddOrEdit;

          console.log(values);
          if (this.state.defaultActiveKey === '1') {
            if (params.award_date) {
              params.award_date = moment(params.award_date).format('YYYY-MM') + '-' + '01';
            }
          }

          if (this.state.defaultActiveKey === '2') {
            if (params.manage_exp_communicate_date) {
              params.manage_exp_communicate_date = moment(params.manage_exp_communicate_date).format('YYYY-MM') + '-' + '01';
            }
          }

          if (this.state.defaultActiveKey === '3') {
            if (params.teacher_guide_date_start) {
              params.teacher_guide_date_start = moment(params.teacher_guide_date_start).format('YYYY-MM') + '-' + '01';
            }

            if (params.teacher_guide_date_end) {
              params.teacher_guide_date_end = moment(params.teacher_guide_date_end).format('YYYY-MM') + '-' + '01';
            }
          }

          if (this.state.editData) {

            res = await progress.editTeachAchievement(this.state.editData.id, params);
          } else {
            // 新增
            res = await progress.addTeachAchievement(params);
          }
          if (res.code) {
            message.error(res.msg);
            return;
          }
          message.success('教育成果数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['award_date_from', 'award_date_to', 'manage_exp_communicate_from', 'manage_exp_communicate_to', 'award_main', 'manage_exp_communicate_content', 'teacher_guide_name', 'teacher_guide_content'], async (err: boolean, values: any) => {
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
                <Option value={'award_main'}>表彰主体(本人、本人所带班队、本人所带学生)</Option>
              </Select>
            }
            {
              this.state.defaultActiveKey === '2'
              &&
              <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
                <Option value={'manage_exp_communicate_from'}>交流管理经验时间（开始）</Option>
                <Option value={'manage_exp_communicate_to'}>交流管理经验时间（结束）</Option>
                <Option value={'manage_exp_communicate_content'}>交流管理经验内容</Option>
              </Select>
            }
            {
              this.state.defaultActiveKey === '3'
              &&
              <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
                <Option value={'teacher_guide_name'}>指导对象姓名</Option>
                <Option value={'teacher_guide_content'}>指导内容</Option>
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
                  {this.state.defaultActiveKey === '1' &&
                    this.state.filterItems.indexOf('award_date_from') >= 0 &&
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
                  {this.state.defaultActiveKey === '1' &&
                    this.state.filterItems.indexOf('award_date_to') >= 0 &&
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
                  {this.state.defaultActiveKey === '1' &&
                    this.state.filterItems.indexOf('award_main') >= 0 &&
                    <Form.Item label="表彰主体(本人、本人所带班队、本人所带学生)">
                      {getFieldDecorator('award_main', {
                        rules: [],
                      })(
                        <Input placeholder="请输入表彰主体（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {this.state.defaultActiveKey === '2' &&
                    this.state.filterItems.indexOf('manage_exp_communicate_from') >= 0 &&
                    <Form.Item label="交流管理经验时间（开始）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('manage_exp_communicate_from', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {this.state.defaultActiveKey === '2' &&
                    this.state.filterItems.indexOf('manage_exp_communicate_to') >= 0 &&
                    <Form.Item label="交流管理经验时间（结束）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('manage_exp_communicate_to', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {this.state.defaultActiveKey === '2' &&
                    this.state.filterItems.indexOf('manage_exp_communicate_content') >= 0 &&
                    <Form.Item label="交流管理经验内容">
                      {getFieldDecorator('manage_exp_communicate_content', {
                        rules: [],
                      })(
                        <Input placeholder="请输入交流管理经验内容（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {this.state.defaultActiveKey === '3' &&
                    this.state.filterItems.indexOf('teacher_guide_name') >= 0 &&
                    <Form.Item label="指导对象姓名">
                      {getFieldDecorator('teacher_guide_name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入指导对象姓名（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {this.state.defaultActiveKey === '3' &&
                    this.state.filterItems.indexOf('teacher_guide_content') >= 0 &&
                    <Form.Item label="指导内容">
                      {getFieldDecorator('teacher_guide_content', {
                        rules: [],
                      })(
                        <Input placeholder="请输入指导内容（支持模糊匹配）" />
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
            <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
              <TabPane tab="表彰奖励情况" key="1" />
              <TabPane tab="交流管理经验情况" key="2" />
              <TabPane tab="指导情况" key="3" />
            </Tabs>
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

export default Form.create({})(Teach);
