import * as React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { progress, files } from 'src/api';
import Constant from 'src/dataModel/Constant';
import IToken from 'src/dataModel/IToken';
import storageUtils from 'src/utils/storageUtils';
import Urls from 'src/config/Urls';
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
  Switch,
  Row,
  Descriptions,
  Upload,
  Icon,
  List,
  Typography
} from 'antd';
import AddEditModal from './addEditForm';
import AchievementDrawer from './achievementDrawer';

import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';

const { Option } = Select;
const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const { TextArea } = Input;

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
  baseinfoAttachList: any;
  dictList: any;
  showAdd: boolean;
  editAble: boolean;
  editData: any;
  baseinfoData: any;
  filterItems: string[];
  filterParam: any;
  showAchievementDrawer: boolean;
  achievementDrawerData: any;
  uploadedFiles: any;
}

/**
 * Educate
 */
class Educate extends React.PureComponent<IProps, IState> {
  fileIdsForAddOrEdit: any[];
  constructor(props: any) {
    super(props);
    this.state = {
      defaultActiveKey: '1',
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      achievementList: [], // 业绩列表
      baseinfoAttachList: [], // 基本信息附件列表
      dictList: [], // 数据字典列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      baseinfoData: null, // 基本信息数据
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
    if (this.state.defaultActiveKey === '1') {
      this.getBaseInfo();
    } else {
      this.getList();
    }

    this.getDictList();
  }

  /*
   * 获取用户基本教学信息
   */
  getBaseInfo = async () => {
    let params: any = null;

    const res = await progress.getEducateBaseInfoDetail(params);

    if (res.code) {
      message.error(res.msg);
      return;
    }

    this.setState({
      baseinfoData: res.results.data,
    }, () => {
      if (!this.state.baseinfoData) {
        this.setState({
          editAble: true,
        });
      }
      this.getAttachList();
    });
  }

  /**
   * 取得印证材料列表
   */
  getAttachList = async () => {
    let params: any = {};
    params.bize_type = 'educate/baseinfo';

    params.bize_id = this.state.baseinfoData ? this.state.baseinfoData.id : null;

    const res = await files.getFileList(params);
    if (res.code) {
      message.error(res.msg);
      return;
    }

    this.setState({
      baseinfoAttachList: res.results.data
    });
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
      type: parseInt(this.state.defaultActiveKey, 10) - 1,
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

    const res = await progress.getEducateAchievementList(param);
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
      editAble,
      baseinfoData,
      baseinfoAttachList,
    } = this.state;

    const { getFieldDecorator } = this.props.form;
    const uploadAttachUrl = window.$$_web_env.apiDomain + Urls.addFile;

    /**
     * 获取token
     */
    const getToken = () => {
      let token: string = '';
      const loginInfoStr = storageUtils.get(Constant.LOGIN_KEY);
      if (loginInfoStr && loginInfoStr.length > 0) {
        const tokenInfo: IToken = JSON.parse(loginInfoStr);
        if (tokenInfo !== null && tokenInfo.token) {
          token = 'Bearer ' + tokenInfo.token;
        }
      }
      return token;
    };

    /**
     * 删除一行数据
     */
    const del = async (record: any) => {
      const param = {};
      const res = await progress.delEducateAchievement(record.id, param);
      if (res.code) {
        message.error(res.msg);
        return;
      }
      message.success('教学删除成功');
      this.getList();
    };

    /**
     * 删除附件
     */
    const delFile = async (record: any) => {
      const res = await files.delFile(record.id, {});
      if (res && res.code) {
        message.error(res.msg);
        return;
      }
      message.success('删除成功');
      this.getAttachList();
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
    if (this.state.defaultActiveKey === '2') {
      column = [
        {
          title: '成果类型',
          key: 'achievement_type',
          dataIndex: 'achievement_type',
          width: 200,
          render: (text: any, record: any) => {
            console.log(getOption('achievement_type'));
            return (
              <span>
                {text && _.find(getOption('achievement_type'), ['value', text.toString()])?.label}
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

    if (this.state.defaultActiveKey === '3') {
      column = [
        {
          title: '成果类型',
          key: 'achievement_type',
          dataIndex: 'achievement_type',
          width: 200,
          render: (text: any, record: any) => {
            console.log(getOption('achievement_type'));
            return (
              <span>
                {text && _.find(getOption('achievement_type'), ['value', text.toString()])?.label}
              </span>
            );
          }
        },
        {
          title: '讲座、示范课时间',
          key: 'lecture_date',
          dataIndex: 'lecture_date',
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
          title: '讲座、示范课主题',
          key: 'lecture_content',
          dataIndex: 'lecture_content',
          width: 200,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '主讲人',
          key: 'lecture_person',
          dataIndex: 'lecture_person',
          width: 200,
        },
        {
          title: '主办单位',
          key: 'lecture_organization',
          dataIndex: 'lecture_organization',
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
          params.type = parseInt(this.state.defaultActiveKey, 10) - 1;

          params.fileids = this.fileIdsForAddOrEdit;

          if (this.state.defaultActiveKey === '2') {
            if (params.award_date) {
              params.award_date = moment(params.award_date).format('YYYY-MM') + '-' + '01';
            }
          }

          if (this.state.defaultActiveKey === '3') {
            if (params.lecture_date) {
              params.lecture_date = moment(params.lecture_date).format('YYYY-MM') + '-' + '01';
            }

          }

          if (this.state.editData) {

            res = await progress.editEducateAchievement(this.state.editData.id, params);
          } else {
            // 新增
            res = await progress.addEducateAchievement(params);
          }
          if (res.code) {
            message.error(res.msg);
            return;
          }
          message.success('教学成果数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['award_date_from', 'award_date_to', 'award_title', 'award_authoriry_organization', 'lecture_date_from', 'lecture_date_to', 'teacher_guide_name', 'lecture_content', 'lecture_organization'], async (err: boolean, values: any) => {
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

    /**
     * 改变锁定状态
     */
    const onChange = (checked: boolean, event: Event) => {
      if (checked) {
        this.setState({
          editAble: true,
        });
      } else {
        // 保存数据
        if (this.state.defaultActiveKey === '1') {
          this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
            let params: any = values;
            params.fileids = this.state.uploadedFiles;
            if (!err) {
              const res = await progress.addOrEditEducateBaseInfo(params);
              if (res.code) {
                message.error(res.msg);
                return;
              }
              message.success('教学成果基本信息保存成功');
              this.setState({
                editAble: false,
              }, () => {
                this.getBaseInfo();
              });
            }
          });
        }
      }
    };

    /**
     * 文件上传
     */
    const onUplodChange = async (info: any) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (!info.file.response.code) {
          // 如果上传成功
          const { uploadedFiles } = this.state;
          uploadedFiles.push(info.file.response.results.data.fileId);
          this.setState({
            uploadedFiles
          }, () => {
            this.getAttachList();
          });
        } else {
          message.error(info.file.response.msg);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    };

    /**
     * 文件下载
     */
    const download = async (id: number, fileType: string, fileName: string) => {
      // console.log(id);
      const res = await files.download(id, {});

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

    return (
      <div>
        <div className="layout-breadcrumb">
          <div className="page-name">
            <CurrentPage />
          </div>
          <div className="page-button">
            <CommonButton />
            {/* 下面写本页面需要的按钮 */}
            {this.state.defaultActiveKey !== '1' &&
              <Button type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button>
            }
            {this.state.defaultActiveKey === '1' &&
              <Switch
                checkedChildren="解锁"
                unCheckedChildren="锁定"
                checked={editAble}
                onChange={onChange}
              />
            }
            {/* 下面本页的筛选项 */}
            {
              this.state.defaultActiveKey === '2'
              &&
              <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
                <Option value={'award_date_from'}>获奖时间（开始）</Option>
                <Option value={'award_date_to'}>获奖时间（结束）</Option>
                <Option value={'award_title'}>表彰奖励内容</Option>
                <Option value={'award_authoriry_organization'}>授奖单位</Option>
              </Select>
            }
            {
              this.state.defaultActiveKey === '3'
              &&
              <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter}>
                <Option value={'lecture_date_from'}>获奖时间（开始）</Option>
                <Option value={'lecture_date_to'}>获奖时间（结束）</Option>
                <Option value={'lecture_content'}>讲座内容</Option>
                <Option value={'lecture_organization'}>主办单位</Option>
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
              <TabPane tab="业绩基本情况" key="1" />
              <TabPane tab="现场课/录像课/微课/课件/基本功" key="2" />
              <TabPane tab="讲座/示范课" key="3" />
            </Tabs>
            {this.state.defaultActiveKey === '1' &&
              <span>
                <Row>
                  <Descriptions
                    title=""
                    layout="vertical"
                    bordered={true}
                  >
                    <Descriptions.Item label="教学效果" span={3}>
                      <Form className="modal-form" layout="inline" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <FormItem label="">
                          {getFieldDecorator('effect', {
                            initialValue: baseinfoData ? baseinfoData.effect : null,
                            rules: [
                              // { required: true, message: '请输入师德师风综述' }
                            ],
                          })(
                            <TextArea
                              disabled={!!editAble ? false : true}
                              placeholder="请输入教学效果内容"
                              autoSize={{ minRows: 6, maxRows: 10 }}
                            />
                          )}
                        </FormItem>
                      </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="命题与监测" span={3}>
                      <Form className="modal-form" layout="inline" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <FormItem label="">
                          {getFieldDecorator('observe', {
                            initialValue: baseinfoData ? baseinfoData.observe : null,
                            rules: [
                              // { required: true, message: '请输入师德师风综述' }
                            ],
                          })(
                            <TextArea
                              disabled={!!editAble ? false : true}
                              placeholder="请输入命题与监测内容"
                              autoSize={{ minRows: 6, maxRows: 10 }}
                            />
                          )}
                        </FormItem>
                      </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="教研交流" span={3}>
                      <Form className="modal-form" layout="inline" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <FormItem label="">
                          {getFieldDecorator('communicate', {
                            initialValue: baseinfoData ? baseinfoData.communicate : null,
                            rules: [
                              // { required: true, message: '请输入师德师风综述' }
                            ],
                          })(
                            <TextArea
                              disabled={!!editAble ? false : true}
                              placeholder="请输入教研交流内容"
                              autoSize={{ minRows: 6, maxRows: 10 }}
                            />
                          )}
                        </FormItem>
                      </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="指导教师" span={3}>
                      <Form className="modal-form" layout="inline" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <FormItem label="">
                          {getFieldDecorator('guide', {
                            initialValue: baseinfoData ? baseinfoData.guide : null,
                            rules: [
                              // { required: true, message: '请输入师德师风综述' }
                            ],
                          })(
                            <TextArea
                              disabled={!!editAble ? false : true}
                              placeholder="请输入指导教师内容"
                              autoSize={{ minRows: 6, maxRows: 10 }}
                            />
                          )}
                        </FormItem>
                      </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="开设选修课或综合实践活动课" span={3}>
                      <Form className="modal-form" layout="inline" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <FormItem label="">
                          {getFieldDecorator('elective', {
                            initialValue: baseinfoData ? baseinfoData.elective : null,
                            rules: [
                              // { required: true, message: '请输入师德师风综述' }
                            ],
                          })(
                            <TextArea
                              disabled={!!editAble ? false : true}
                              placeholder="请输入开设选修课或综合时间活动课内容"
                              autoSize={{ minRows: 6, maxRows: 10 }}
                            />
                          )}
                        </FormItem>
                      </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="上传印证材料" span={3}>
                      <Upload
                        disabled={!!editAble ? false : true}
                        name="file"
                        action={uploadAttachUrl}
                        headers={{
                          'authorization': getToken(),
                          // 'Content-Type': ContentType.MULTIPART
                        }}
                        data={{
                          bize_type: 'educate/baseinfo',
                          bize_id: this.state.baseinfoData && this.state.baseinfoData.id ? this.state.baseinfoData.id : '',
                        }}
                        showUploadList={false}
                        onChange={onUplodChange}
                        multiple={true}
                        style={{ marginBottom: 5 }}
                      >
                        <Button>
                          <Icon type="upload" />点击上传印证材料
                        </Button>
                      </Upload>
                      {
                        baseinfoAttachList
                        && baseinfoAttachList.length > 0
                        &&
                        <List
                          bordered={true}
                          dataSource={baseinfoAttachList}
                          style={{ marginTop: 10 }}
                          renderItem={(item: any) => (
                            <List.Item>
                              <Typography.Text>
                                <Icon type="paper-clip" />
                              </Typography.Text>
                              <Button type="link" onClick={download.bind(this, item.id, item.file_type, item.original_name)}>{item.original_name}</Button>
                              <span style={{ marginLeft: 30 }}>上传日期：{moment(item.created_at).format('YYYY/MM/DD')}</span>
                              <span style={{ marginLeft: 30 }}>
                                <Popconfirm title="确认删除吗?" onConfirm={() => delFile(item)} disabled={!!editAble ? false : true}>
                                  <Button
                                    type="danger"
                                    disabled={!!editAble ? false : true}
                                  >删除
                                  </Button>
                                </Popconfirm>
                              </span>
                            </List.Item>
                          )}
                        />
                      }
                    </Descriptions.Item>
                  </Descriptions>
                </Row>
              </span>
            }
            {this.state.defaultActiveKey !== '1' &&
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

export default Form.create({})(Educate);
