import * as React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { progress } from 'src/api';
import {
  Button,
  Form,
  Table,
  // Modal,
  Select,
  Input,
  // Tabs,
  DatePicker,
} from 'antd';
// import AddEditModal from './addEditForm';
// import AchievementDrawer from './achievementDrawer';

import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';

const { Option } = Select;
// const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
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
 * AwardSearch
 */
class AwardSearch extends React.PureComponent<IProps, IState> {
  fileIdsForAddOrEdit: any[];
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      achievementList: [], // 成果列表
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

    let params: any = this.getParams();

    const res = await progress.getTeacherAwardList(params);
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
   * 组装参数
   */
  getParams = () => {
    let param: any = {
      page: this.state.page,
      page_size: this.state.pageSize,
    };

    // 增加筛选条件
    if (this.state.filterParam) {
      if (this.state.filterParam.date_from) {
        param.date_from = moment(this.state.filterParam.date_from).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.date_to) {
        param.date_to = moment(this.state.filterParam.date_to).format('YYYY-MM') + '-01';
      }
      if (this.state.filterParam.campus) {
        param.campus = this.state.filterParam.campus;
      }
      if (this.state.filterParam.award_or_achievement) {
        param.award_or_achievement = this.state.filterParam.award_or_achievement;
      }
      if (this.state.filterParam.user_name) {
        param.user_name = this.state.filterParam.user_name;
      }
    }
    return param;

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
        'campus'
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

  /*
   * 成果或是获奖
   */
  awardOrAchievementOptions = [
    { value: 1, label: '获奖' },
    { value: 2, label: '成果' },
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

    /*
     * 导出excel
     */
    const exportExcel = async () => {
      let params: any = this.getParams();

      const res = await progress.outputAwardExcel(params);

      const file = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      console.log(res);
      const a = document.createElement('a');
      a.download = '教师获奖成果一览表.xlsx';
      a.href = URL.createObjectURL(file);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

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
    // const showDrawer = (record: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {
    //   if (achievementOrNot) {
    //     this.setState({
    //       showAchievementDrawer: true,
    //       achievementDrawerData: record
    //     });
    //   }
    // };

    /*
    * 关闭抽屉
    */
    // const onDrawerClose = (e: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {

    //   if (achievementOrNot) {
    //     this.setState({
    //       showAchievementDrawer: false,
    //       achievementDrawerData: null
    //     });
    //   }
    // };

    /**
     * 列
     */
    let column = [
      {
        title: '类别',
        key: 'award_or_achievement',
        dataIndex: 'award_or_achievement',
        width: 70,
        render: (text: any, record: any) => {
          return (
            <span>
              {text && _.find(this.awardOrAchievementOptions, ['value', text])?.label}
            </span>
          );
        }
      },
      {
        title: '校区',
        key: 'campus',
        dataIndex: 'campus',
        width: 150,
        render: (text: any, record: any) => {
          return (
            <span>
              {text && _.find(getOption('campus'), ['value', text.toString()])?.label}
            </span>
          );
        }
      },
      {
        title: '姓名',
        key: 'user_name',
        dataIndex: 'user_name',
        width: 100,
      },
      {
        title: '类别',
        key: 'award_name',
        dataIndex: 'award_name',
        width: 200,
      },
      {
        title: '项目内容/发表题目/得奖内容',
        key: 'title',
        dataIndex: 'title',
        width: 200,
      },
      {
        title: '颁发单位/刊物名称及期数/指导对象/主办单位',
        key: 'organization',
        dataIndex: 'organization',
        width: 200,
      },
      {
        title: '刊物刊号/出版社',
        key: 'kan_hao_deng',
        dataIndex: 'kan_hao_deng',
        width: 200,
      },
      {
        title: '奖项级别/发表范围',
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
        title: '获奖等级',
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
        title: '获奖/发表时间',
        key: 'the_date',
        dataIndex: 'the_date',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <span>
              {text && moment(text).format('YYYY-MM-DD')}
            </span>
          );
        }
      },
      {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark',
        width: 200,
      },
    ];

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields([
        'date_from',
        'date_to',
        'campus',
        'award_or_achievement',
        'user_name'
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
            <Button type="primary" icon="plus" onClick={() => { exportExcel(); }}>结果导出EXCEL</Button>
            {/* 下面本页的筛选项 */}
            <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
              <Option value={'date_from'}>获奖发表时间（开始）</Option>
              <Option value={'date_to'}>获奖发表时间（结束）</Option>
              <Option value={'campus'}>校区</Option>
              <Option value={'award_or_achievement'}>类别</Option>
              <Option value={'user_name'}>教师姓名</Option>
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
                  {this.state.filterItems.indexOf('date_from') >= 0 &&
                    <Form.Item label="获奖/发表时间（开始）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('date_from', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {this.state.filterItems.indexOf('date_to') >= 0 &&
                    <Form.Item label="获奖/发表时间（结束）" style={{ margin: 0 }}>
                      {
                        getFieldDecorator('date_to', {
                          // initialValue: record[dataIndex],
                          rules: [],
                        })
                          (<MonthPicker />)
                      }
                    </Form.Item >
                  }
                  {this.state.filterItems.indexOf('campus') >= 0 &&
                    <Form.Item label="校区">
                      {getFieldDecorator('campus', {
                        rules: [
                          // { required: true, message: '请选择学科领域' }
                        ],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {getOption('campus').map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {this.state.filterItems.indexOf('award_or_achievement') >= 0 &&
                    <Form.Item label="类别">
                      {getFieldDecorator('award_or_achievement', {
                        rules: [
                          // { required: true, message: '请选择学科领域' }
                        ],
                      })(
                        <Select
                          style={{ width: 100 }}
                        >
                          {this.awardOrAchievementOptions.map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {this.state.filterItems.indexOf('user_name') >= 0 &&
                    <Form.Item label="教师姓名">
                      {getFieldDecorator('user_name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入教师姓名（支持模糊匹配）" />
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
              <TabPane tab="荣誉&其他" key="1" />
            </Tabs> */}
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
        {/* {
          this.state.showAchievementDrawer
          && <AchievementDrawer
            drawerData={this.state.achievementDrawerData}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showAchievementDrawer}
            type={this.state.defaultActiveKey}
            yesOrNoOptions={this.yesOrNoOptions}
            getOption={getOption}
          />
        } */}
      </div >
    );
  }
}

export default Form.create({})(AwardSearch);
