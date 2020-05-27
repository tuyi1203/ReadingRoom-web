import * as React from 'react';
import moment from 'moment';
import * as _ from 'lodash';
import { progress } from 'src/api';
import { Button, Form, message, Table, Divider, Popconfirm, Modal, Select, Input, Tabs, } from 'antd';
import AddEditModal from './addEditForm';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';

const { Option } = Select;
const { TabPane } = Tabs;

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
}

/**
 * Research
 */
class Research extends React.PureComponent<IProps, IState> {
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
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
    this.getDictList();
  }

  /*
   * 获取研究成果列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize,
      achievement_type: this.state.defaultActiveKey
    };

    console.log(this.state.filterParam);
    // 增加筛选条件
    if (this.state.filterParam) {

      /*
      if (this.state.filterParam.name) {
        param.username__icontains = this.state.filterParam.s_username;
      }
      */
      // if (this.state.filterParam.name) {
      //   param.name = this.state.filterParam.name;
      // }
      // if (this.state.filterParam.email) {
      //   param.email = this.state.filterParam.email;
      // }
      // if (this.state.filterParam.mobile) {
      //   param.mobile = this.state.filterParam.mobile;
      // }
      // if (this.state.filterParam.roles) {
      //   param.roles = this.state.filterParam.roles;
      // }
      // if (typeof (this.state.filterParam.is_active) !== 'undefined') {
      //   param.is_active = this.state.filterParam.is_active;
      // }
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

    /*
    * 显示添加
    */
    // const showAdd = () => {
    //   this.setState({
    //     showAdd: true
    //   });
    // };

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
        },
        {
          title: '是否获奖',
          key: 'award',
          dataIndex: 'award',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <span>
                {this.awardList.filter(item => item.id === record.award)[0].label}
              </span>
            );
          }
        },
        {
          title: '论文名称',
          key: 'paper_title',
          dataIndex: 'paper_title',
          width: 200,
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
                {moment(text).format('YYYY-MM')}
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
          let params: any = null;
          params = { ...values };
          params.achievement_type = this.state.defaultActiveKey;
          if (params.award) {
            params.award = 1;
          } else {
            params.award = 0;
          }

          if (params.award && params.award_date) {
            params.award_date = moment(params.award_date).format('YYYY-MM') + '-' + '01';
          }

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
            // TODO
          }

          if (this.state.editData) {
            // 编辑
            // if (!values.is_active) {
            //   values.is_active = 0;
            // } else {
            //   values.is_active = 1;
            // }
            // if (_.isEmpty(values.password)) {
            //   values = {
            //     name: values.name,
            //     email: values.email,
            //     mobile: values.mobile,
            //     roles: values.roles,
            //     is_active: values.is_active,
            //   };
            // }

            res = await progress.editResearchAchievement(this.state.editData.id, params);
          } else {
            // 新增
            res = await progress.addResearchAchievement(params);
          }
          if (res.code) {
            message.error(res.msg);
            return;
          }
          message.success('研究业绩数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['name', 'email', 'mobile', 'roles', 'is_active'], async (err: boolean, values: any) => {
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
              <Option value={'name'}>姓名</Option>
              <Option value={'email'}>邮箱</Option>
              <Option value={'mobile'}>电话号码</Option>
              <Option value={'roles'}>角色</Option>
              <Option value={'is_active'}>有效用户</Option>
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
                  {/* {
                    this.state.filterItems.indexOf('s_username') >= 0 &&
                    <Form.Item label="用户名">
                      {getFieldDecorator('s_username', {
                        rules: [],
                      })(
                        <Input placeholder="请输入用户名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  } */}

                  {
                    this.state.filterItems.indexOf('name') >= 0 &&
                    <Form.Item label="姓名">
                      {getFieldDecorator('name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入用户姓名（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('email') >= 0 &&
                    <Form.Item label="邮箱">
                      {getFieldDecorator('email', {
                        rules: [],
                      })(
                        <Input placeholder="请输入用户邮箱地址（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('mobile') >= 0 &&
                    <Form.Item label="手机">
                      {getFieldDecorator('mobile', {
                        rules: [],
                      })(
                        <Input placeholder="请输入手机（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('is_active') >= 0 &&
                    <Form.Item label="有效用户">
                      {getFieldDecorator('is_active', {
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
            />}
          </Modal>
        }
      </div >
    );
  }
}

export default Form.create({})(Research);
