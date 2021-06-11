import * as React from 'react';
// import moment from 'moment';
import _ from 'lodash';
import { progress, students } from 'src/api';
import {
  Button,
  Form,
  Table,
  // Modal,
  Select,
  Input,
  Cascader,
  // Tabs,
  // DatePicker,
} from 'antd';
// import AddEditModal from './addEditForm';
import AchievementDrawer from './achievementDrawer';

import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';

const { Option } = Select;
// const { TabPane } = Tabs;
// const { MonthPicker } = DatePicker;

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
  specialityTypeList: any;
  classList: any;
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
 * SpecialityInfoSearch
 */
class SpecialityInfoSearch extends React.PureComponent<IProps, IState> {
  fileIdsForAddOrEdit: any[];
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      achievementList: [], // 数据列表
      specialityTypeList: [], // 特长类型列表
      dictList: [], // 数据字典列表
      classList: [], // 班级列表
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
    this.getDictList();
    this.getSpecialityType();
    this.getCampusClassList();
    this.getList();

  }

  /*
   * 获取上传的文件ID
   */
  updateFileIds = (ids: any) => {
    this.fileIdsForAddOrEdit = ids;
  }

  /*
   * 获取学生特长列表
   */
  getList = async () => {

    let params: any = this.getParams();

    const res = await students.getStudentSpecialityInfoList(params);
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
  * 获取校园班级级联数据列表
  */
  getCampusClassList = async () => {
    const res = await students.getCampusClasses({});

    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        classList: res.results.data,
      });
    }
  }

  /*
   * 获取特长类别列表
   */
  getSpecialityType = async () => {
    const res = await students.getStudentSpecialityTypeList({});
    // console.log(res.code);
    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        specialityTypeList: res.results.data,
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
      if (this.state.filterParam.filter_campus) {
        param.campus = this.state.filterParam.campus;
      }
      if (this.state.filterParam.filter_class) {
        param.class_id = this.state.filterParam.filter_class[2];
      }
      if (this.state.filterParam.filter_speciality_type) {
        param.speciality_type = this.state.filterParam.filter_speciality_type;
      }
      if (this.state.filterParam.filter_name) {
        param.student_name = this.state.filterParam.filter_name;
      }
      if (this.state.filterParam.filter_speciality_name) {
        param.speciality_name = this.state.filterParam.filter_speciality_name;
      }
      if (this.state.filterParam.filter_speciality_level) {
        param.speciality_level = this.state.filterParam.filter_speciality_level;
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
        'campus',
        'gender'
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
      specialityTypeList,
      classList,
    } = this.state;

    const { getFieldDecorator } = this.props.form;

    /*
     * 导出excel
     */
    const exportExcel = async () => {
      let params: any = this.getParams();

      const res = await students.outputStudentSpecialityInfoExcel(params);

      const file = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      console.log(res);
      const a = document.createElement('a');
      a.download = '学生特长信息一览表.xlsx';
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
    const showDrawer = (record: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {
      this.setState({
        showAchievementDrawer: true,
        achievementDrawerData: record
      });
    };

    /*
    * 关闭抽屉
    */
    const onDrawerClose = (e: any, achievementOrNot?: boolean, awardOrNot?: boolean) => {

      this.setState({
        showAchievementDrawer: false,
        achievementDrawerData: null
      });
    };

    /**
     * 列
     */
    let column = [
      {
        title: '校区',
        key: 'student_class.campus',
        dataIndex: 'student_class.campus',
        width: 150,
        render: (text: any, record: any) => {
          return (
            <span>
              {text && _.find(getOption('campus'), ['value', record.student_class.campus.toString()])?.label}
            </span>
          );
        }
      },
      {
        title: '班级',
        key: 'student_class.class',
        dataIndex: 'student_class.class',
        width: 100,
        render: (text: any, record: any) => {
          return (<span>{record.student_class.grade + '级' + record.student_class.class + '班'}</span>);
        }
      },
      {
        title: '姓名',
        key: 'student.name',
        dataIndex: 'student.name',
        width: 100,
        render: (text: any, record: any) => {
          return (<span>{record.student.name}</span>);
        }
      },
      {
        title: '性别',
        key: 'student.gender',
        dataIndex: 'student.gender',
        width: 150,
        render: (text: any, record: any) => {
          return (
            <span>
              {text && _.find(getOption('gender'), ['value', record.student.gender.toString()])?.label}
            </span>
          );
        }
      },
      {
        title: '类别',
        key: 'speciality_type',
        dataIndex: 'speciality_type',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <span>
              {text && _.find(specialityTypeList, ['dict_value', text.toString()])?.dict_name}
            </span>
          );
        }
      },
      {
        title: '特长名称',
        key: 'speciality_name',
        dataIndex: 'speciality_name',
        width: 200,
      },
      {
        title: '特长等级',
        key: 'speciality_level_comment',
        dataIndex: 'speciality_level_comment',
        width: 200,
      },
      {
        title: '印证材料',
        key: 'action',
        dataIndex: 'action',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <div>
              {record.attach_files.length > 0
                ? <Button type="primary" onClick={() => showDrawer(record)}>查看</Button>
                : ''
              }
            </div>
          );
        }
      },
    ];

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields([
        'filter_campus',
        'filter_class',
        'filter_speciality_type',
        'filter_speciality_name',
        'filter_speciality_level',
        'filter_name'
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
              <Option value={'filter_campus'}>校区</Option>
              <Option value={'filter_class'}>班级</Option>
              <Option value={'filter_speciality_type'}>特长类别</Option>
              <Option value={'filter_speciality_name'}>特长名称</Option>
              <Option value={'filter_speciality_level'}>特长等级</Option>
              <Option value={'filter_name'}>学生姓名</Option>
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
                  {this.state.filterItems.indexOf('filter_campus') >= 0 &&
                    <Form.Item label="校区">
                      {getFieldDecorator('filter_campus', {
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
                  {this.state.filterItems.indexOf('filter_class') >= 0 &&
                    <Form.Item label="班级">
                      {getFieldDecorator('filter_class', {
                        rules: [
                          // { required: true, message: '请选择学科领域' }
                        ],
                      })(
                        <Cascader style={{ width: 250 }} options={classList} />
                      )}
                    </Form.Item>
                  }
                  {this.state.filterItems.indexOf('filter_speciality_type') >= 0 &&
                    <Form.Item label="特长类别">
                      {getFieldDecorator('filter_speciality_type', {
                        rules: [
                          // { required: true, message: '请选择学科领域' }
                        ],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {specialityTypeList.map((item: any) => (
                            <Option value={item.dict_value} key={item.dict_value}>{item.dict_name}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {this.state.filterItems.indexOf('filter_speciality_name') >= 0 &&
                    <Form.Item label="特长名称">
                      {getFieldDecorator('filter_speciality_name', {
                        rules: [],
                      })(
                        <Input placeholder="支持模糊匹配" />
                      )}
                    </Form.Item>
                  }
                  {this.state.filterItems.indexOf('filter_speciality_level') >= 0 &&
                    <Form.Item label="特长等级">
                      {getFieldDecorator('filter_speciality_level', {
                        rules: [],
                      })(
                        <Input placeholder="支持模糊匹配" />
                      )}
                    </Form.Item>
                  }
                  {this.state.filterItems.indexOf('filter_name') >= 0 &&
                    <Form.Item label="学生姓名">
                      {getFieldDecorator('filter_name', {
                        rules: [],
                      })(
                        <Input placeholder="支持模糊匹配" />
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
        {
          this.state.showAchievementDrawer
          && <AchievementDrawer
            drawerData={this.state.achievementDrawerData}
            onClose={(e: any) => { return onDrawerClose(e, true); }}
            visible={this.state.showAchievementDrawer}
          />
        }
      </div >
    );
  }
}

export default Form.create({})(SpecialityInfoSearch);
