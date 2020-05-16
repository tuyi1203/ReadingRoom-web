import * as React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { progress, files } from 'src/api';
import Constant from 'src/dataModel/Constant';
import IToken from 'src/dataModel/IToken';
import {
  Form,
  // Row,
  // Col,
  message,
  Tabs,
  Descriptions,
  Badge,
  Upload,
  Button,
  Icon,
  List,
  Typography,
  // Table,
  // Divider,
  Popconfirm,
  Switch,
  Select,
  Input,
  DatePicker,
  // Tag
} from 'antd';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
import Urls from 'src/config/Urls';
import storageUtils from 'src/utils/storageUtils';
import EditableTable from './editableTable';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './index.css';

moment.locale('zh-cn');
const { Option } = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;
// const { TextArea } = Input;
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
  dictList: any[];
  showAdd: boolean;
  editData: any;
  filterItems: string[];
  filterParam: any;
  editAble: boolean;
  defaultActiveKey: string;
  attachList: any;
  uploadedFiles: any[];
}

/**
 * Moral
 */
class Moral extends React.PureComponent<IProps, IState> {

  tableData: any[];

  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      dictList: [], // 获取数据字典列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
      editAble: false,
      defaultActiveKey: '1',
      attachList: [], // 附件列表
      uploadedFiles: [], // 已上传文件ID列表
    };
    this.tableData = [];
  }

  UNSAFE_componentWillMount() {
    this.getDetail();
    this.getDictList();
  }

  /*
   * 改变基本资格数据
   */
  changeTableData = (newData: any) => {
    this.tableData = newData;
    console.log(this.tableData);
  }

  /*
   * 获取用户职称基本信息
   */
  getDetail = async () => {
    let params: any = {};
    let res = await progress.getQualificationEducationDetail(params); // 基本资格教育经历
    switch (this.state.defaultActiveKey) {
      case '2':
        res = await progress.getQualificationWorkDetail(params);
        break;
      case '3':
        res = await progress.getQualificationWorkExperienceDetail(params);
        break;
      case '4':
        res = await progress.getQualificationManageExperienceDetail(params);
        break;
      default:
        res = await progress.getQualificationEducationDetail(params);
    }
    // res = await progress.getMoralDetail(params);

    if (res.code) {
      message.error(res.msg);
      return;
    }

    console.log(res);

    this.setState({
      editData: res.results.data,
    }, () => {
      if (!this.state.editData) {
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
    if (this.state.defaultActiveKey === '1') {
      params.bize_type = 'qualification/educate';
    }

    if (this.state.defaultActiveKey === '2') {
      params.bize_type = 'qualification/work';
    }

    if (this.state.defaultActiveKey === '3') {
      params.bize_type = 'qualification/work/experience';
    }

    if (this.state.defaultActiveKey === '4') {
      params.bize_type = 'qualification/manage/experience';
    }

    params.bize_id = this.state.editData ? this.state.editData.id : null;

    const res = await files.getFileList(params);
    if (res.code) {
      message.error(res.msg);
      return;
    }
    this.setState({
      attachList: res.results.data
    });
  }

  /*
   * 获取职称数据字典
   */
  getDictList = async () => {
    const res = await progress.getDictList({
      'category_name': [
        'education',
        'course',
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

  render() {

    const {
      editData,
      attachList,
      editAble,
      dictList,
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
     * 删除附件
     */
    const del = async (record: any) => {
      const res = await files.delFile(record.id, {});
      if (res && res.code) {
        message.error(res.msg);
        return;
      }
      message.success('删除成功');
      this.getAttachList();
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

    /*
     * 获取数据字典中某个类别的列表
     */
    const getOptions = (keyName: string): any[] => {
      const list: any[] = [];
      if (!_.isEmpty(dictList)) {
        const data = dictList[keyName];
        // console.log(data);

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
     * 是否选项
     */
    const YesOrNoOptions = (): any[] => {
      const list: any[] = [
        {
          value: 1,
          label: '是',
        },
        {
          value: 0,
          label: '否',
        }
      ];
      return list;
    };

    /*
    * 显示添加
    */
    // const showAdd = () => {
    //   this.setState({
    //     showAdd: true
    //   });
    // };

    /*
    * 显示添加
    */
    /*
     const showAdd = () => {
       this.setState({
         showAdd: true
       });
     };
     */

    /**
     * 改变筛选项
     */
    /*
    const changeFilter = (val: any) => {
      // console.log(val);
      this.setState({
        filterItems: val
      }, () => {
        onSearch();
      });
    };
    */

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
        this.getDetail();
      });
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
            let params: any = {
              graduate_school: values.graduate_school,
              graduate_time: moment(values.graduate_time).format('YYYY-MM') + '-' + '01',
              education: values.education,
              education_no: values.education_no,
              degree_no: values.degree_no,
              subject: values.subject,
              experiences: [],
            };

            for (let i = 0; i < this.tableData.length; i++) {
              let experience = {
                start_year: this.tableData[i].start.split('-')[0],
                start_month: this.tableData[i].start.split('-')[1],
                end_year: this.tableData[i].end.split('-')[0],
                end_month: this.tableData[i].end.split('-')[1],
                school_name: this.tableData[i].school_name,
                education: this.tableData[i].education,
                prove_person: this.tableData[i].prove_person,
                order_sort: i
              };
              params.experiences.push(experience);
            }

            if (!err) {
              const res = await progress.addOrEditQualificationEducation(params);
              if (res.code) {
                message.error(res.msg);
                return;
              }
              message.success('基本资格信息保存成功');
              this.setState({
                editAble: false,
              }, () => {
                this.getDetail();
              });
            }
          });
        }
        if (this.state.defaultActiveKey === '2') {
          this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
            let params: any = {
              work_time: moment(values.work_time).format('YYYY-MM') + '-' + '01',
              teach_year: values.teach_year,
              school_manager: values.school_manager,
              teach5years: values.teach5years,
              apply_up: values.apply_up,
              apply_course: values.apply_course,
              title: values.title,
              qualification_time: moment(values.qualification_time).format('YYYY-MM') + '-' + '01',
              work_first_time: moment(values.work_first_time).format('YYYY-MM') + '-' + '01',
              middle_school_teacher: values.middle_school_teacher,
              middle_school_time: moment(values.middle_school_time).format('YYYY-MM') + '-' + '01',
              remark: values.remark,
            };

            if (!err) {
              const res = await progress.addOrEditQualificationWork(params);
              if (res.code) {
                message.error(res.msg);
                return;
              }
              message.success('基本资格信息保存成功');
              this.setState({
                editAble: false,
              }, () => {
                this.getDetail();
              });
            }
          });
        }
        if (this.state.defaultActiveKey === '3') {
          this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
            let params: any = {
              rural_teach_years: values.rural_teach_years,
              experiences: [],
            };

            for (let i = 0; i < this.tableData.length; i++) {
              let experience = {
                start_year: this.tableData[i].start.split('-')[0],
                start_month: this.tableData[i].start.split('-')[1],
                end_year: this.tableData[i].end.split('-')[0],
                end_month: this.tableData[i].end.split('-')[1],
                company: this.tableData[i].company,
                affairs: this.tableData[i].affairs,
                prove_person: this.tableData[i].prove_person,
                order_sort: i
              };
              params.experiences.push(experience);
            }

            if (!err) {
              const res = await progress.addOrEditQualificationWorkExperience(params);
              if (res.code) {
                message.error(res.msg);
                return;
              }
              message.success('基本资格信息保存成功');
              this.setState({
                editAble: false,
              }, () => {
                this.getDetail();
              });
            }
          });
        }

        if (this.state.defaultActiveKey === '4') {
          this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
            let params: any = {
              manage_years: values.manage_years,
              experiences: [],
            };

            for (let i = 0; i < this.tableData.length; i++) {
              let experience = {
                start_year: this.tableData[i].start.split('-')[0],
                start_month: this.tableData[i].start.split('-')[1],
                end_year: this.tableData[i].end.split('-')[0],
                end_month: this.tableData[i].end.split('-')[1],
                affairs: this.tableData[i].affairs,
                prove_person: this.tableData[i].prove_person,
                order_sort: i
              };
              params.experiences.push(experience);
            }

            if (!err) {
              const res = await progress.addOrEditQualificationManageExperience(params);
              if (res.code) {
                message.error(res.msg);
                return;
              }
              message.success('基本资格信息保存成功');
              this.setState({
                editAble: false,
              }, () => {
                this.getDetail();
              });
            }
          });
        }
      }
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
            <Switch
              checkedChildren="解锁"
              unCheckedChildren="锁定"
              checked={editAble}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面是本页的内容 */}
            <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
              <TabPane tab="基本资格（一）" key="1" />
              <TabPane tab="基本资格（二）" key="2" />
              <TabPane tab="基本资格（三）" key="3" />
              <TabPane tab="基本资格（四）" key="4" />
            </Tabs>
            {this.state.defaultActiveKey === '1' &&
              <span>
                <Descriptions
                  bordered={true}
                  size="small"
                  column={2}
                >
                  <Descriptions.Item span={2} label="请填写本人情况:" >
                    <Badge status="processing" text="（1）学历。高级教师一般应具有专科及以上学历。" /></Descriptions.Item>
                  <Descriptions.Item label="最后毕业院校">
                    <FormItem wrapperCol={{ span: 16 }}>
                      {getFieldDecorator('graduate_school', {
                        initialValue: editData ? editData.graduate_school : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业院校' }
                        ],
                      })(
                        <Input
                          disabled={!!editAble ? false : true}
                          placeholder="请输入最后毕业院校"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="最后毕业时间">
                    <FormItem>
                      {getFieldDecorator('graduate_time', {
                        initialValue: editData && editData.graduate_time ? moment(editData.graduate_time, 'YYYY-MM') : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <MonthPicker
                          // onChange={onChange}
                          locale={locale}
                          disabled={!!editAble ? false : true}
                          placeholder="Select month"
                          format="YYYY-MM"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="最高学历学位">
                    <FormItem>
                      {getFieldDecorator('education', {
                        initialValue: editData && editData.education ? editData.education.toString() : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <Select
                          style={{ width: 300 }}
                          disabled={!!editAble ? false : true}
                        >
                          {getOptions('education').map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="学历证书号">
                    <FormItem>
                      {getFieldDecorator('education_no', {
                        initialValue: editData ? editData.education_no : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业院校' }
                        ],
                      })(
                        <Input
                          disabled={!!editAble ? false : true}
                          placeholder="请输入学历证书号"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="学位证书号">
                    <FormItem wrapperCol={{ span: 16 }}>
                      {getFieldDecorator('degree_no', {
                        initialValue: editData ? editData.degree_no : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业院校' }
                        ],
                      })(
                        <Input
                          disabled={!!editAble ? false : true}
                          placeholder="请输入学位证书号"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="专业">
                    <FormItem>
                      {getFieldDecorator('subject', {
                        initialValue: editData ? editData.subject : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业院校' }
                        ],
                      })(
                        <Input
                          disabled={!!editAble ? false : true}
                          placeholder="请输入专业"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions
                  size="small"
                  layout="vertical"
                  bordered={true}
                >
                  <Descriptions.Item label="学历教育经历（从高中阶段开始填起）" span={3}>
                    <EditableTable
                      form={this.props.form}
                      editAble={this.state.editAble}
                      editData={this.state.editData}
                      tablechange={this.changeTableData}
                      getOptions={getOptions}
                      activeKey={this.state.defaultActiveKey}
                    />
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
                        bize_type: 'qualification/educate',
                        bize_id: this.state.editData && this.state.editData.id ? this.state.editData.id : '',
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
                      attachList
                      && attachList.length > 0
                      &&
                      <List
                        bordered={true}
                        dataSource={attachList}
                        style={{ marginTop: 10 }}
                        renderItem={(item: any) => (
                          <List.Item>
                            <Typography.Text>
                              <Icon type="paper-clip" />
                            </Typography.Text>
                            <Button type="link" onClick={download.bind(this, item.id, item.file_type, item.original_name)}>{item.original_name}</Button>
                            <span style={{ marginLeft: 30 }}>上传日期：{moment(item.created_at).format('YYYY/MM/DD')}</span>
                            <span style={{ marginLeft: 30 }}>
                              <Popconfirm title="确认删除吗?" onConfirm={() => del(item)} disabled={!!editAble ? false : true}>
                                <Button type="danger" disabled={!!editAble ? false : true}>删除</Button>
                              </Popconfirm>
                            </span>
                          </List.Item>
                        )}
                      />
                    }
                  </Descriptions.Item>
                </Descriptions>
              </span>
            }
            {this.state.defaultActiveKey === '2' &&
              <span>
                <Descriptions
                  bordered={true}
                  size="small"
                  column={2}
                >
                  <Descriptions.Item span={2} label="要求1、学历、资历及经历" >
                    <Badge status="processing" text="（2）资历。具备相应的任职年限：高级教师。具备博士学位，并在一级教师岗位任教满2年及以上；或者具备大学专科及以上毕业学历或学位，并在一级教师岗位任教5年及以上。" />
                  </Descriptions.Item>
                  <Descriptions.Item label="参加工作时间">
                    <FormItem>
                      {getFieldDecorator('work_time', {
                        initialValue: editData && editData.work_time ? moment(editData.work_time, 'YYYY-MM') : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <MonthPicker
                          // onChange={onChange}
                          locale={locale}
                          disabled={!!editAble ? false : true}
                          placeholder="Select month"
                          format="YYYY-MM"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="教龄">
                    <FormItem wrapperCol={{ span: 16 }}>
                      {getFieldDecorator('teach_years', {
                        initialValue: editData ? editData.teach_years : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业院校' }
                        ],
                      })(
                        <Input
                          disabled={!!editAble ? false : true}
                          placeholder="请输入教龄"
                          addonAfter="年"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="是否在一级教师岗位任教满5年及以上">
                    <FormItem>
                      {getFieldDecorator('teach5years', {
                        initialValue: editData && editData.teach5years ? editData.teach5years : 0,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <Select
                          style={{ width: 300 }}
                          disabled={!!editAble ? false : true}
                        >
                          {YesOrNoOptions().map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="是否申请破格(须在一级教师岗位任教至少3年)">
                    <FormItem>
                      {getFieldDecorator('apply_up', {
                        initialValue: editData && editData.apply_up ? editData.apply_up : 0,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <Select
                          style={{ width: 300 }}
                          disabled={!!editAble ? false : true}
                        >
                          {YesOrNoOptions().map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="申报学科/从事专业">
                    <FormItem>
                      {getFieldDecorator('apply_course', {
                        initialValue: editData && editData.apply_course ? editData.apply_course.toString() : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <Select
                          style={{ width: 300 }}
                          disabled={!!editAble ? false : true}
                        >
                          {getOptions('course').map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="是否校级管理人员">
                    <FormItem>
                      {getFieldDecorator('school_manager', {
                        initialValue: editData && editData.school_manager ? editData.school_manager : 0,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <Select
                          style={{ width: 300 }}
                          disabled={!!editAble ? false : true}
                        >
                          {YesOrNoOptions().map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="现任专业技术职务">
                    <FormItem>
                      {getFieldDecorator('title', {
                        initialValue: editData ? editData.title : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业院校' }
                        ],
                      })(
                        <Input
                          disabled={!!editAble ? false : true}
                          placeholder="请输入现任专业技术职务"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="资格取得时间">
                    <FormItem>
                      {getFieldDecorator('qualification_time', {
                        initialValue: editData && editData.qualification_time ? moment(editData.qualification_time, 'YYYY-MM') : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <MonthPicker
                          // onChange={onChange}
                          locale={locale}
                          disabled={!!editAble ? false : true}
                          placeholder="Select month"
                          format="YYYY-MM"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="现任专业技术职务首聘时间">
                    <FormItem>
                      {getFieldDecorator('work_first_time', {
                        initialValue: editData && editData.work_first_time ? moment(editData.work_first_time, 'YYYY-MM') : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <MonthPicker
                          // onChange={onChange}
                          locale={locale}
                          disabled={!!editAble ? false : true}
                          placeholder="Select month"
                          format="YYYY-MM"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="是否为中学特级教师">
                    <FormItem>
                      {getFieldDecorator('middle_school_teacher', {
                        initialValue: editData && editData.middle_school_teacher ? editData.middle_school_teacher : 0,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <Select
                          style={{ width: 300 }}
                          disabled={!!editAble ? false : true}
                        >
                          {YesOrNoOptions().map((item: any) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="中学特级教师取得时间">
                    <FormItem>
                      {getFieldDecorator('middle_school_time', {
                        initialValue: editData && editData.middle_school_time ? moment(editData.middle_school_time, 'YYYY-MM') : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业时间' }
                        ],
                      })(
                        <MonthPicker
                          // onChange={onChange}
                          locale={locale}
                          disabled={!!editAble ? false : true}
                          placeholder="Select month"
                          format="YYYY-MM"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                  <Descriptions.Item label="参加何社会、学术团体、任何职务">
                    <FormItem>
                      {getFieldDecorator('remark', {
                        initialValue: editData ? editData.title : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业院校' }
                        ],
                      })(
                        <Input
                          disabled={!!editAble ? false : true}
                          placeholder=""
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions
                  size="small"
                  layout="vertical"
                  bordered={true}
                >
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
                        bize_type: 'qualification/work',
                        bize_id: this.state.editData && this.state.editData.id ? this.state.editData.id : '',
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
                      attachList
                      && attachList.length > 0
                      &&
                      <List
                        bordered={true}
                        dataSource={attachList}
                        style={{ marginTop: 10 }}
                        renderItem={(item: any) => (
                          <List.Item>
                            <Typography.Text>
                              <Icon type="paper-clip" />
                            </Typography.Text>
                            <Button type="link" onClick={download.bind(this, item.id, item.file_type, item.original_name)}>{item.original_name}</Button>
                            <span style={{ marginLeft: 30 }}>上传日期：{moment(item.created_at).format('YYYY/MM/DD')}</span>
                            <span style={{ marginLeft: 30 }}>
                              <Popconfirm title="确认删除吗?" onConfirm={() => del(item)} disabled={!!editAble ? false : true}>
                                <Button type="danger" disabled={!!editAble ? false : true}>删除</Button>
                              </Popconfirm>
                            </span>
                          </List.Item>
                        )}
                      />
                    }
                  </Descriptions.Item>
                </Descriptions>
              </span>
            }
            {this.state.defaultActiveKey === '3' &&
              <span>
                <Descriptions
                  bordered={true}
                  size="small"
                  column={2}
                >
                  <Descriptions.Item span={2} label="要求1、学历、资历及经历" >
                    <Badge status="processing" text="（3）经历。具备以下工作经历：乡村学校任教经历。在乡村学校或薄弱学校任教满1年以上。" />
                  </Descriptions.Item>
                  <Descriptions.Item label="累计年限">
                    <FormItem wrapperCol={{ span: 16 }}>
                      {getFieldDecorator('rural_teach_years', {
                        initialValue: editData ? editData.rural_teach_years : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业院校' }
                        ],
                      })(
                        <Input
                          disabled={!!editAble ? false : true}
                          placeholder="请输入累计年限"
                          addonAfter="年"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions
                  size="small"
                  layout="vertical"
                  bordered={true}
                >
                  <Descriptions.Item label="工作经历（含支教、乡村学校、薄弱学校任教经历）" span={2}>
                    <EditableTable
                      form={this.props.form}
                      editAble={this.state.editAble}
                      editData={this.state.editData}
                      tablechange={this.changeTableData}
                      getOptions={getOptions}
                      activeKey={this.state.defaultActiveKey}
                    />
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions
                  size="small"
                  layout="vertical"
                  bordered={true}
                >
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
                        bize_type: 'qualification/work/experience',
                        bize_id: this.state.editData && this.state.editData.id ? this.state.editData.id : '',
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
                      attachList
                      && attachList.length > 0
                      &&
                      <List
                        bordered={true}
                        dataSource={attachList}
                        style={{ marginTop: 10 }}
                        renderItem={(item: any) => (
                          <List.Item>
                            <Typography.Text>
                              <Icon type="paper-clip" />
                            </Typography.Text>
                            <Button type="link" onClick={download.bind(this, item.id, item.file_type, item.original_name)}>{item.original_name}</Button>
                            <span style={{ marginLeft: 30 }}>上传日期：{moment(item.created_at).format('YYYY/MM/DD')}</span>
                            <span style={{ marginLeft: 30 }}>
                              <Popconfirm title="确认删除吗?" onConfirm={() => del(item)} disabled={!!editAble ? false : true}>
                                <Button type="danger" disabled={!!editAble ? false : true}>删除</Button>
                              </Popconfirm>
                            </span>
                          </List.Item>
                        )}
                      />
                    }
                  </Descriptions.Item>
                </Descriptions>
              </span>
            }
            {this.state.defaultActiveKey === '4' &&
              <span>
                <Descriptions
                  bordered={true}
                  size="small"
                  column={2}
                >
                  <Descriptions.Item span={2} label="要求1、学历、资历及经历" >
                    <Badge status="processing" text="（3）经历。具备以下工作经历： 学生教育管理工作经历。具有相应班主任工作、团队工作、或其他有关学生教育管理工作" />
                  </Descriptions.Item>
                  <Descriptions.Item label="累计年限">
                    <FormItem wrapperCol={{ span: 16 }}>
                      {getFieldDecorator('manage_years', {
                        initialValue: editData ? editData.manage_years : null,
                        rules: [
                          // { required: true, message: '请输入最后毕业院校' }
                        ],
                      })(
                        <Input
                          disabled={!!editAble ? false : true}
                          placeholder="请输入累计年限"
                          addonAfter="年"
                        />
                      )}
                    </FormItem>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions
                  size="small"
                  layout="vertical"
                  bordered={true}
                >
                  <Descriptions.Item label="担任何种学生教育管理工作" span={2}>
                    <EditableTable
                      form={this.props.form}
                      editAble={this.state.editAble}
                      editData={this.state.editData}
                      tablechange={this.changeTableData}
                      getOptions={getOptions}
                      activeKey={this.state.defaultActiveKey}
                    />
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions
                  size="small"
                  layout="vertical"
                  bordered={true}
                >
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
                        bize_type: 'qualification/manage/experience',
                        bize_id: this.state.editData && this.state.editData.id ? this.state.editData.id : '',
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
                      attachList
                      && attachList.length > 0
                      &&
                      <List
                        bordered={true}
                        dataSource={attachList}
                        style={{ marginTop: 10 }}
                        renderItem={(item: any) => (
                          <List.Item>
                            <Typography.Text>
                              <Icon type="paper-clip" />
                            </Typography.Text>
                            <Button type="link" onClick={download.bind(this, item.id, item.file_type, item.original_name)}>{item.original_name}</Button>
                            <span style={{ marginLeft: 30 }}>上传日期：{moment(item.created_at).format('YYYY/MM/DD')}</span>
                            <span style={{ marginLeft: 30 }}>
                              <Popconfirm title="确认删除吗?" onConfirm={() => del(item)} disabled={!!editAble ? false : true}>
                                <Button type="danger" disabled={!!editAble ? false : true}>删除</Button>
                              </Popconfirm>
                            </span>
                          </List.Item>
                        )}
                      />
                    }
                  </Descriptions.Item>
                </Descriptions>
              </span>
            }
          </div>
        </div>
      </div >
    );
  }
}

export default Form.create({})(Moral);
