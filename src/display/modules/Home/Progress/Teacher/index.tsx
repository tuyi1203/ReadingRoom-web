import * as React from 'react';
// import moment from 'moment';
import * as _ from 'lodash';
import { progress } from 'src/api';
import DataDic from 'src/dataModel/DataDic';
import {
  Button, Form,
  // message, 
  Table,
  Divider,
  // Popconfirm, 
  // Modal, 
  Select,
  Input,
  //  Tabs, 
  // DatePicker
} from 'antd';
// import AddEditModal from './addEditForm';
import BaseinfoDrawer from './baseinfoDrawer';
import MoralDrawer from './moralDrawer';
import TeachDrawer from './teachDrawer';
import EducateDrawer from './educateDrawer';
import ResearchDrawer from './researchDrawer';

import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
import QualificationDrawer from './qualificationDrawer';

const { Option } = Select;
// const { TabPane } = Tabs;
// const { MonthPicker } = DatePicker;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  // defaultActiveKey: string;
  page: number;
  pageSize: number;
  total: number;
  teacherInfoList: any;
  dictList: any;
  showAdd: boolean;
  editData: any;
  filterItems: string[];
  filterParam: any;
  activeDrawer: string;
  showBaseinfoDrawer: boolean;
  showMoralDrawer: boolean;
  // showAwardDrawer: boolean;
  showQualificationDrawer: boolean;
  showTeachDrawer: boolean;
  showEducateDrawer: boolean;
  showResearchDrawer: boolean;
  baseinfoDetailData: any;
}

/**
 * Teacher
 */
class Teacher extends React.PureComponent<IProps, IState> {
  fileIdsForAddOrEdit: any[];
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      activeDrawer: '',
      teacherInfoList: [], // 教师信息列表
      dictList: [], // 数据字典列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
      showBaseinfoDrawer: false,
      showMoralDrawer: false,
      showQualificationDrawer: false,
      showTeachDrawer: false,
      showEducateDrawer: false,
      showResearchDrawer: false,
      // showAwardDrawer: false,
      baseinfoDetailData: null,
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
   * 获取教师列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize,
    };

    console.log(this.state.filterParam);
    // 增加筛选条件
    if (this.state.filterParam) {
      if (this.state.filterParam.filter_name) {
        param.name = this.state.filterParam.filter_name;
      }
      if (this.state.filterParam.filter_gender) {
        param.gender = this.state.filterParam.filter_gender;
      }
      if (this.state.filterParam.filter_min_zu) {
        param.min_zu = this.state.filterParam.filter_min_zu;
      }
      if (this.state.filterParam.filter_zai_bian) {
        param.zai_bian = this.state.filterParam.filter_zai_bian;
      }
      if (this.state.filterParam.filter_age_from) {
        param.age_from = this.state.filterParam.filter_age_from;
      }
      if (this.state.filterParam.filter_age_to) {
        param.age_to = this.state.filterParam.filter_age_to;
      }
      if (this.state.filterParam.filter_apply_position) {
        param.apply_position = this.state.filterParam.filter_apply_position;
      }
      if (this.state.filterParam.filter_had_position) {
        param.had_position = this.state.filterParam.filter_had_position;
      }

      // if (this.state.filterParam.filter_gender) {
      //   param.paper_date_from = moment(this.state.filterParam.paper_date_from).format('YYYY-MM') + '-01';
      // }
      // if (this.state.filterParam.paper_date_to) {
      //   param.paper_date_to = moment(this.state.filterParam.paper_date_to).format('YYYY-MM') + '-01';
      // }

    }

    const res = await progress.getTeacherBaseinfoList(param);
    // console.log(res.code);
    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        teacherInfoList: res.results.data,
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
        'min_zu',
        'education',
        'course',
        'position',
        'series',
        'award_level',
        'kaohe_level',
        'achievement_type',
        'award_position',
        'award_type',
        'subject_type',
        'subject_status',
        'subject_level',
        'paper_role',
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
      teacherInfoList,
      dictList,
    } = this.state;

    const { getFieldDecorator } = this.props.form;

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
    // const changeTab = (val: string) => {
    //   // console.log(val);
    //   this.setState({
    //     defaultActiveKey: val,
    //     page: 1,
    //     pageSize: 10,
    //     filterItems: [],
    //     filterParam: {},
    //   }, () => {
    //     this.getList();
    //   });
    // };

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
     * 根据Key查找值
     */
    const findLabel = (dataList: any, key: number) => {
      let lst = dataList.filter(
        (item: any) => {
          return item.value.toString() === key.toString();
        }) || [];
      // console.log(dataList, key, lst);
      if (_.isEmpty(lst)) {
        return '';
      }

      return lst[0].label;
    };

    /*
    * 显示抽屉
    */
    const showDrawer = (record: any, drawerType: string) => {
      console.log(drawerType);
      this.setState({
        // showBaseinfoDrawer: true,
        activeDrawer: drawerType,
        baseinfoDetailData: record
      });
      switch (drawerType) {
        case 'moral':
          this.setState({
            showMoralDrawer: true,
          });
          break;
        case 'educate':
          this.setState({
            showEducateDrawer: true,
          });
          break;
        case 'qualification':
          this.setState({
            showQualificationDrawer: true,
          });
          break;
        case 'teach':
          this.setState({
            showTeachDrawer: true,
          });
          break;
        case 'research':
          this.setState({
            showResearchDrawer: true,
          });
          break;
        default:
          this.setState({
            showBaseinfoDrawer: true,
          });
      }
    };

    /*
    * 关闭抽屉
    */
    const onDrawerClose = (e: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {

      this.setState({
        showBaseinfoDrawer: false,
        showEducateDrawer: false,
        showMoralDrawer: false,
        showQualificationDrawer: false,
        showResearchDrawer: false,
        showTeachDrawer: false,
        activeDrawer: '',
        baseinfoDetailData: null
      });
    };

    /**
     * 文件下载
     */
    const download = async (id: number, fileType: string, fileName: string) => {
      // console.log(id);
      const res = await progress.getTeacherPDF({}, id);

      const file = new Blob([res.data], {
        type: fileType
      });
      console.log(res);
      const a = document.createElement('a');
      a.download = fileName;
      a.href = URL.createObjectURL(file);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    /**
     * 列
     */
    let column;
    column = [
      {
        title: '教师姓名',
        key: 'name',
        dataIndex: 'name',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <span>
              {<a onClick={() => showDrawer(record, 'baseinfo')}>{text}</a>}
            </span>
          );
        }
      },
      // {
      //   title: '师德师风情况',
      //   key: 'name',
      //   dataIndex: 'name',
      //   width: 200,
      //   render: (text: any, record: any) => {
      //     return (
      //       <span>
      //         {<a onClick={() => showDrawer(record, 'shideshifeng')}>师德师风</a>}
      //       </span>
      //     );
      //   }
      // },
      // {
      //   title: '学科领域',
      //   key: 'course',
      //   dataIndex: 'course',
      //   width: 200,
      //   render: (text: any, record: any) => {
      //     return (
      //       <span>
      //         {_.find(getOption('course'), ['value', text.toString()])?.label}
      //       </span>
      //     );
      //   }
      // },
      // {
      //   title: '是否获奖',
      //   key: 'award',
      //   dataIndex: 'award',
      //   width: 200,
      //   render: (text: any, record: any) => {
      //     return (
      //       <span>
      //         {text
      //           ? <a onClick={() => showDrawer(record, 'baseinfo')}>{this.awardList.filter(item => item.id === record.award)[0].label}</a>
      //           : this.awardList.filter(item => item.id === record.award)[0].label
      //         }
      //       </span>
      //     );
      //   }
      // },
      // {
      //   title: '论文名称',
      //   key: 'paper_title',
      //   dataIndex: 'paper_title',
      //   width: 200,
      //   render: (text: any, record: any) => {
      //     return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
      //   }
      // },
      // {
      //   title: '发表刊物名称',
      //   key: 'paper_book_title',
      //   dataIndex: 'paper_book_title',
      //   width: 200,
      // },
      // {
      //   title: '刊号',
      //   key: 'paper_book_kanhao',
      //   dataIndex: 'paper_book_kanhao',
      //   width: 200,
      // },
      // {
      //   title: '卷号',
      //   key: 'paper_book_juanhao',
      //   dataIndex: 'paper_book_juanhao',
      //   width: 200,
      // },
      // {
      //   title: '发表时间',
      //   key: 'paper_date',
      //   dataIndex: 'paper_date',
      //   width: 200,
      //   render: (text: any, record: any) => {
      //     return (
      //       <span>
      //         {text && moment(text).format('YYYY-MM')}
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
              {/* <Button type="primary" onClick={() => showEdit(record)}>编辑</Button> */}
              {<a onClick={() => showDrawer(record, 'moral')}>师德师风</a>}
              <Divider type="vertical" />
              {<a onClick={() => showDrawer(record, 'qualification')}>基本资格</a>}
              <Divider type="vertical" />
              {<a onClick={() => showDrawer(record, 'teach')}>教育成果</a>}
              <Divider type="vertical" />
              {<a onClick={() => showDrawer(record, 'educate')}>教学成果</a>}
              <Divider type="vertical" />
              {<a onClick={() => showDrawer(record, 'research')}>科研成果</a>}
              <Divider type="vertical" />
              <Button type="link" onClick={download.bind(this, record.user_id, 'application/x-pdf', record.name)}>下载PDF</Button>
              {/* <Popconfirm title="确认删除吗?" onConfirm={() => del(record)}>
                  <Button type="danger">删除</Button>
                </Popconfirm> */}
            </div>
          );
        }
      },
    ];

    /*
    * 显示添加
    */
    // const showAdd = () => {
    //   this.setState({
    //     showAdd: true
    //   });
    // };

    /**
     * 模态窗取消
     */
    // const onCancel = () => {
    //   this.setState({
    //     showAdd: false,
    //     editData: null
    //   });
    //   // 删除临时上传的文件
    // };

    /**
     * 模态窗保存
     */
    // const onOk = () => {
    //   this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
    //     if (!err) {
    //       let res: any = null;
    //       let params: any = null;
    //       params = { ...values };
    //       params.type = this.state.defaultActiveKey;
    //       if (params.award) {
    //         params.award = 1;
    //       } else {
    //         params.award = 0;
    //       }

    //       if (params.award && params.award_date) {
    //         params.award_date = moment(params.award_date).format('YYYY-MM') + '-' + '01';
    //       }

    //       params.fileids = this.fileIdsForAddOrEdit;

    //       console.log(values);
    //       if (this.state.defaultActiveKey === '1') {
    //         if (params.paper_core_book) {
    //           params.paper_core_book = 1;
    //         } else {
    //           params.paper_core_book = 0;
    //         }
    //         if (params.paper_date) {
    //           params.paper_date = moment(params.paper_date).format('YYYY-MM') + '-' + '01';
    //         }

    //       }

    //       if (this.state.defaultActiveKey === '2') {
    //         if (params.subject_start_date) {
    //           params.subject_start_date = moment(params.subject_start_date).format('YYYY-MM') + '-' + '01';
    //         }
    //         if (params.subject_end_date) {
    //           params.subject_end_date = moment(params.subject_end_date).format('YYYY-MM') + '-' + '01';
    //         }
    //       }

    //       if (this.state.defaultActiveKey === '3') {
    //         if (params.book_publish_date) {
    //           params.book_publish_date = moment(params.book_publish_date).format('YYYY-MM') + '-' + '01';
    //         }
    //       }

    //       if (this.state.defaultActiveKey === '4') {
    //         if (params.copyright_ratification) {
    //           params.copyright_ratification = moment(params.copyright_ratification).format('YYYY-MM') + '-' + '01';
    //         }
    //       }

    //       if (this.state.editData) {

    //         res = await progress.editResearchAchievement(this.state.editData.id, params);
    //       } else {
    //         // 新增
    //         res = await progress.addResearchAchievement(params);
    //       }
    //       if (res.code) {
    //         message.error(res.msg);
    //         return;
    //       }
    //       message.success('研究成果数据保存成功');
    //       onCancel();
    //       this.getList();
    //     }
    //   });
    // };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['filter_name', 'filter_gender', 'filter_age_from',
        'filter_age_to', 'filter_min_zu', 'filter_zai_bian', 'filter_apply_position', 'filter_had_position'
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
            {/* <Button type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button> */}
            {/* 下面本页的筛选项 */}
            <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
              <Option value={'filter_name'}>姓名</Option>
              <Option value={'filter_gender'}>性别</Option>
              <Option value={'filter_age_from'}>年龄（大于）</Option>
              <Option value={'filter_age_to'}>年龄（小于）</Option>
              <Option value={'filter_min_zu'}>民族</Option>
              <Option value={'filter_zai_bian'}>是否在编</Option>
              <Option value={'filter_apply_position'}>申请职称</Option>
              <Option value={'filter_had_position'}>已有职称</Option>
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
                    this.state.filterItems.indexOf('filter_name') >= 0 &&
                    <Form.Item label="姓名">
                      {getFieldDecorator('filter_name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入姓名（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('filter_gender') >= 0 &&
                    <Form.Item label="性别">
                      {getFieldDecorator('filter_gender', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {DataDic.genderList.map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('filter_age_from') >= 0 &&
                    <Form.Item label="年龄（大于）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('filter_age_from', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<Input placeholder="请输入年龄（大于）" />)
                      }
                    </Form.Item >
                  }
                  {
                    this.state.filterItems.indexOf('filter_age_to') >= 0 &&
                    <Form.Item label="年龄（小于）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('filter_age_to', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<Input placeholder="请输入年龄（小于）" />)
                      }
                    </Form.Item >
                  }
                  {
                    this.state.filterItems.indexOf('filter_min_zu') >= 0 &&
                    <Form.Item label="民族">
                      {getFieldDecorator('filter_min_zu', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {getOption('min_zu').map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('filter_zai_bian') >= 0 &&
                    <Form.Item label="在编">
                      {getFieldDecorator('filter_zai_bian', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {DataDic.zaibianList.map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('filter_apply_position') >= 0 &&
                    <Form.Item label="申请职位">
                      {getFieldDecorator('filter_apply_position', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {getOption('position').map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('filter_had_position') >= 0 &&
                    <Form.Item label="现有职位">
                      {getFieldDecorator('filter_had_position', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {getOption('position').map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
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
            {/* 下面是本页的内容 */}
            {/* <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
              <TabPane tab="论文" key="1" />
              <TabPane tab="课题" key="2" />
              <TabPane tab="著作" key="3" />
              <TabPane tab="专利或著作权" key="4" />
            </Tabs> */}
            <Table
              columns={column}
              rowKey="id"
              dataSource={teacherInfoList}
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
          this.state.activeDrawer === 'baseinfo'
          && <BaseinfoDrawer
            drawerData={this.state.baseinfoDetailData}
            dictList={this.state.dictList}
            findLabel={findLabel}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showBaseinfoDrawer}
            yesOrNoOptions={this.yesOrNoOptions}
            getOption={getOption}
          />
        }
        {
          this.state.activeDrawer === 'moral'
          && <MoralDrawer
            drawerData={this.state.baseinfoDetailData}
            dictList={this.state.dictList}
            findLabel={findLabel}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showMoralDrawer}
            yesOrNoOptions={this.yesOrNoOptions}
            getOption={getOption}
          />
        }
        {
          this.state.activeDrawer === 'qualification'
          && <QualificationDrawer
            drawerData={this.state.baseinfoDetailData}
            dictList={this.state.dictList}
            findLabel={findLabel}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showQualificationDrawer}
            yesOrNoOptions={this.yesOrNoOptions}
            getOption={getOption}
          />
        }
        {
          this.state.activeDrawer === 'teach'
          && <TeachDrawer
            drawerData={this.state.baseinfoDetailData}
            dictList={this.state.dictList}
            findLabel={findLabel}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showTeachDrawer}
            yesOrNoOptions={this.yesOrNoOptions}
            getOption={getOption}
          />
        }
        {
          this.state.activeDrawer === 'educate'
          && <EducateDrawer
            drawerData={this.state.baseinfoDetailData}
            dictList={this.state.dictList}
            findLabel={findLabel}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showEducateDrawer}
            yesOrNoOptions={this.yesOrNoOptions}
            getOption={getOption}
          />
        }
        {
          this.state.activeDrawer === 'research'
          && <ResearchDrawer
            drawerData={this.state.baseinfoDetailData}
            dictList={this.state.dictList}
            findLabel={findLabel}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showResearchDrawer}
            yesOrNoOptions={this.yesOrNoOptions}
            getOption={getOption}
          />
        }
      </div >
    );
  }
}

export default Form.create({})(Teacher);
