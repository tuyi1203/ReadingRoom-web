import * as React from 'react';
import moment from 'moment';
import * as _ from 'lodash';
import { progress } from 'src/api';
import { Button, Form, message, Table, Divider, Popconfirm, Modal, Select, Input, Tabs, DatePicker } from 'antd';
import AddEditModal from './addEditForm';
import AchievementDrawer from './achievementDrawer';
import AwardDrawer from './awardDrawer';

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
  showAwardDrawer: boolean;
  achievementDrawerData: any;
  awardDrawerData: any;
}

/**
 * Research
 */
class Research extends React.PureComponent<IProps, IState> {
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
      showAwardDrawer: false,
      achievementDrawerData: null,
      awardDrawerData: null,
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
   * 获取研究成果列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize,
      type: this.state.defaultActiveKey
    };

    console.log(this.state.filterParam);
    // 增加筛选条件
    if (this.state.filterParam) {
      if (this.state.filterParam.paper_title) {
        param.paper_title = this.state.filterParam.paper_title;
      }
      if (this.state.filterParam.paper_date_from) {
        param.paper_date_from = moment(this.state.filterParam.paper_date_from).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.paper_date_to) {
        param.paper_date_to = moment(this.state.filterParam.paper_date_to).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.award) {
        param.award = this.state.filterParam.award;
      }
      if (this.state.filterParam.subject_title) {
        param.subject_title = this.state.filterParam.subject_title;
      }
      if (this.state.filterParam.subject_responseable_man) {
        param.subject_responseable_man = this.state.filterParam.subject_responseable_man;
      }
      if (this.state.filterParam.subject_status) {
        param.subject_status = this.state.filterParam.subject_status;
      }
      if (this.state.filterParam.book_title) {
        param.book_title = this.state.filterParam.book_title;
      }
      if (this.state.filterParam.book_type) {
        param.book_type = this.state.filterParam.book_type;
      }
      if (this.state.filterParam.book_publish_company_name) {
        param.book_publish_company_name = this.state.filterParam.book_publish_company_name;
      }
      if (this.state.filterParam.book_publish_date_from) {
        param.book_publish_date_from = moment(this.state.filterParam.book_publish_date_from).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.book_publish_date_to) {
        param.book_publish_date_to = moment(this.state.filterParam.book_publish_date_to).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.copyright_type) {
        param.copyright_type = this.state.filterParam.copyright_type;
      }
      if (this.state.filterParam.copyright_title) {
        param.copyright_title = this.state.filterParam.copyright_title;
      }
    }

    const res = await progress.getResearchAchievementList(param);
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
        'education',
        'course',
        'paper_role',
        'award_type',
        'award_level',
        'subject_type',
        'subject_status',
        'subject_level',
        'achievement_type',
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
      const res = await progress.delResearchAchievement(record.id, param);
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

      if (awardOrNot) {
        this.setState({
          showAwardDrawer: true,
          awardDrawerData: record
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

      if (awardOrNot) {
        this.setState({
          showAwardDrawer: false,
          awardDrawerData: null
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
          title: '学科领域',
          key: 'course',
          dataIndex: 'course',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {_.find(getOption('course'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '是否获奖',
          key: 'award',
          dataIndex: 'award',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text
                  ? <a onClick={() => showDrawer(record, false, true)}>{this.awardList.filter(item => item.id === record.award)[0].label}</a>
                  : this.awardList.filter(item => item.id === record.award)[0].label
                }
              </span>
            );
          }
        },
        {
          title: '论文名称',
          key: 'paper_title',
          dataIndex: 'paper_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '发表刊物名称',
          key: 'paper_book_title',
          dataIndex: 'paper_book_title',
          width: 200,
        },
        {
          title: '刊号',
          key: 'paper_book_kanhao',
          dataIndex: 'paper_book_kanhao',
          width: 200,
        },
        {
          title: '卷号',
          key: 'paper_book_juanhao',
          dataIndex: 'paper_book_juanhao',
          width: 200,
        },
        {
          title: '发表时间',
          key: 'paper_date',
          dataIndex: 'paper_date',
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

    if (this.state.defaultActiveKey === '2') {
      column = [
        {
          title: '学科领域',
          key: 'course',
          dataIndex: 'course',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {_.find(getOption('course'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '是否获奖',
          key: 'award',
          dataIndex: 'award',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text
                  ? <a onClick={() => showDrawer(record, false, true)}>{this.awardList.filter(item => item.id === record.award)[0].label}</a>
                  : this.awardList.filter(item => item.id === record.award)[0].label
                }
              </span>
            );
          }
        },
        {
          title: '课题名称',
          key: 'subject_title',
          dataIndex: 'subject_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '课题批准号',
          key: 'subject_no',
          dataIndex: 'subject_no',
          width: 200,
        },
        {
          title: '课题类别',
          key: 'subject_type',
          dataIndex: 'subject_type',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text && _.find(getOption('subject_type'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '课题负责人',
          key: 'subject_responseable_man',
          dataIndex: 'subject_responseable_man',
          width: 200,
        },
        {
          title: '课题开始日期',
          key: 'subject_start_date',
          dataIndex: 'subject_start_date',
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
          title: '课题结束日期',
          key: 'subject_end_date',
          dataIndex: 'subject_end_date',
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

    if (this.state.defaultActiveKey === '3') {
      column = [
        {
          title: '学科领域',
          key: 'course',
          dataIndex: 'course',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {_.find(getOption('course'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '是否获奖',
          key: 'award',
          dataIndex: 'award',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text
                  ? <a onClick={() => showDrawer(record, false, true)}>{this.awardList.filter(item => item.id === record.award)[0].label}</a>
                  : this.awardList.filter(item => item.id === record.award)[0].label
                }
              </span>
            );
          }
        },
        {
          title: '著作名称',
          key: 'book_title',
          dataIndex: 'book_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '著作类别',
          key: 'book_type',
          dataIndex: 'book_type',
          width: 200,
        },
        {
          title: '出版社名称',
          key: 'book_publish_company_name',
          dataIndex: 'book_publish_company_name',
          width: 200,
        },
        {
          title: '出版号',
          key: 'book_publish_no',
          dataIndex: 'book_publish_no',
          width: 200,
        },
        {
          title: '出版日期',
          key: 'book_publish_date',
          dataIndex: 'book_publish_date',
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
          title: '总字数',
          key: 'book_write_count',
          dataIndex: 'book_write_count',
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

    if (this.state.defaultActiveKey === '4') {
      column = [
        {
          title: '学科领域',
          key: 'course',
          dataIndex: 'course',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {_.find(getOption('course'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '是否获奖',
          key: 'award',
          dataIndex: 'award',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {text
                  ? <a onClick={() => showDrawer(record, false, true)}>{this.awardList.filter(item => item.id === record.award)[0].label}</a>
                  : this.awardList.filter(item => item.id === record.award)[0].label
                }
              </span>
            );
          }
        },
        {
          title: '专利或软件著作权类型',
          key: 'copyright_type',
          dataIndex: 'copyright_type',
          width: 200,
        },
        {
          title: '专利或软件著作权名称',
          key: 'copyright_title',
          dataIndex: 'copyright_title',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '审批时间',
          key: 'copyright_ratification',
          dataIndex: 'copyright_ratification',
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
          title: '本人角色',
          key: 'copyright_role',
          dataIndex: 'copyright_role',
          width: 200,
        },
        {
          title: '专利号（登记号）',
          key: 'copyright_no',
          dataIndex: 'copyright_no',
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

          if (params.award && params.award_date) {
            params.award_date = moment(params.award_date).format('YYYY-MM') + '-' + '01';
          }

          params.fileids = this.fileIdsForAddOrEdit;

          console.log(values);
          if (this.state.defaultActiveKey === '1') {
            if (params.paper_core_book) {
              params.paper_core_book = 1;
            } else {
              params.paper_core_book = 0;
            }
            if (params.paper_date) {
              params.paper_date = moment(params.paper_date).format('YYYY-MM') + '-' + '01';
            }

          }

          if (this.state.defaultActiveKey === '2') {
            if (params.subject_start_date) {
              params.subject_start_date = moment(params.subject_start_date).format('YYYY-MM') + '-' + '01';
            }
            if (params.subject_end_date) {
              params.subject_end_date = moment(params.subject_end_date).format('YYYY-MM') + '-' + '01';
            }
          }

          if (this.state.defaultActiveKey === '3') {
            if (params.book_publish_date) {
              params.book_publish_date = moment(params.book_publish_date).format('YYYY-MM') + '-' + '01';
            }
          }

          if (this.state.defaultActiveKey === '4') {
            if (params.copyright_ratification) {
              params.copyright_ratification = moment(params.copyright_ratification).format('YYYY-MM') + '-' + '01';
            }
          }

          if (this.state.editData) {

            res = await progress.editResearchAchievement(this.state.editData.id, params);
          } else {
            // 新增
            res = await progress.addResearchAchievement(params);
          }
          if (res.code) {
            message.error(res.msg);
            return;
          }
          message.success('研究成果数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['paper_title', 'paper_date_from', 'paper_date_to', 'award', 'subject_title', 'subject_responseable_man', 'subject_status', 'book_title', 'book_type', 'book_publish_company_name', 'book_publish_date_from', 'book_publish_date_to'], async (err: boolean, values: any) => {
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
                <Option value={'paper_title'}>论文名称</Option>
                <Option value={'paper_date_from'}>论文发表时间（开始）</Option>
                <Option value={'paper_date_to'}>论文发表时间（结束）</Option>
                <Option value={'award'}>是否获奖</Option>
              </Select>
            }
            {
              this.state.defaultActiveKey === '2'
              &&
              <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
                <Option value={'subject_title'}>课题名称</Option>
                <Option value={'subject_responseable_man'}>课题负责人</Option>
                <Option value={'subject_status'}>课题状态</Option>
                <Option value={'award'}>是否获奖</Option>
              </Select>
            }
            {
              this.state.defaultActiveKey === '3'
              &&
              <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
                <Option value={'book_title'}>著作名称</Option>
                <Option value={'book_type'}>著作类别</Option>
                <Option value={'book_publish_company_name'}>出版社名称</Option>
                <Option value={'book_publish_date_from'}>出版日期（开始）</Option>
                <Option value={'book_publish_date_to'}>出版日期（结束）</Option>
                <Option value={'award'}>是否获奖</Option>
              </Select>
            }
            {
              this.state.defaultActiveKey === '4'
              &&
              <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
                <Option value={'copyright_type'}>专利或软件著作权类型</Option>
                <Option value={'copyright_title'}>专利或软件著作权名称</Option>
                <Option value={'award'}>是否获奖</Option>
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
            }
            {/* 下面是本页的内容 */}
            <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
              <TabPane tab="论文" key="1" />
              <TabPane tab="课题" key="2" />
              <TabPane tab="著作" key="3" />
              <TabPane tab="专利或著作权" key="4" />
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
        {
          this.state.showAwardDrawer
          && <AwardDrawer
            drawerData={this.state.awardDrawerData}
            onClose={(e: any) => { return onDrawerClose(e, false, true); }}
            visible={this.state.showAwardDrawer}
            achievementType={this.state.defaultActiveKey}
            getOption={getOption}
          />
        }
      </div >
    );
  }
}

export default Form.create({})(Research);
