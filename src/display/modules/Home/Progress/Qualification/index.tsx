import * as React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { progress, files } from 'src/api';
import Constant from 'src/dataModel/Constant';
import IToken from 'src/dataModel/IToken';
import {
  Form,
  Row,
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
const { TextArea } = Input;
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
    if (this.state.defaultActiveKey === '1') {
      res = await progress.getQualificationEducationDetail(params);
    } else if (this.state.defaultActiveKey === '2') {
      params = {
        category: 'kaohe'
      };
    } else if (this.state.defaultActiveKey === '3') {
      params = {
        category: 'warning'
      };
    } else if (this.state.defaultActiveKey === '4') {
      params = {
        category: 'punish'
      };
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
      params.bize_type = 'moral/kaohe';
    }

    if (this.state.defaultActiveKey === '3') {
      params.bize_type = 'moral/warning';
    }

    if (this.state.defaultActiveKey === '4') {
      params.bize_type = 'moral/punish';
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
            console.log(this.tableData);

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

            console.log(params);
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
            let params = {
              category: 'kaohe',
              kaohe: values.kaohe,
            };
            console.log(this.tableData);
            for (let i = 1; i < 6; i++) {
              params['niandu' + i] = this.tableData[i - 1] ? this.tableData[i - 1]['niandu_start'] + '-' + this.tableData[i - 1]['niandu_end'] : '';
              params['niandu' + i + '_kaohe'] = this.tableData[i - 1] ? this.tableData[i - 1]['kaohe_level'] : '';
            }

            if (!err) {
              const res = await progress.addOrEditMoral(params);
              if (res.code) {
                message.error(res.msg);
                return;
              }
              message.success('师德师风信息保存成功');
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
            let params = {
              category: 'warning',
              warning: values.warning,
            };
            if (!err) {
              const res = await progress.addOrEditMoral(params);
              if (res.code) {
                message.error(res.msg);
                return;
              }
              message.success('师德师风信息保存成功');
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
            let params = {
              category: 'punish',
              punish: values.punish,
            };
            if (!err) {
              const res = await progress.addOrEditMoral(params);
              if (res.code) {
                message.error(res.msg);
                return;
              }
              message.success('师德师风信息保存成功');
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
              <TabPane tab="师德师风（二）" key="2" />
              <TabPane tab="师德师风（三）" key="3" />
              <TabPane tab="师德师风（四）" key="4" />
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
                        initialValue: editData ? editData.education.toString() : null,
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
                <Row>
                  <Descriptions
                    title=""
                    layout="vertical"
                    bordered={true}
                  >
                    <Descriptions.Item label="要求2" span={3}>
                      <Badge status="processing" text="是否有下列情况：（3）事业单位工作人员（企业人员参照执行）收到行政“记过”处分1年、“降低岗位登记或者撤职”处分2年内不得申报；受到“开除”处分5年内不得申报。" />
                    </Descriptions.Item>
                    <Descriptions.Item label="本人情况（请填写）：" span={3}>
                      <Form className="modal-form" layout="inline" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <FormItem label="">
                          {getFieldDecorator('kaohe', {
                            initialValue: editData ? editData.kaohe : null,
                            rules: [
                              // { required: true, message: '请输入师德师风综述' }
                            ],
                          })(
                            <TextArea
                              disabled={!!editAble ? false : true}
                              placeholder="请输入本人情况"
                              autoSize={{ minRows: 6, maxRows: 10 }}
                            />
                          )}
                        </FormItem>
                      </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="近五年度考核" span={3}>
                      <EditableTable
                        form={this.props.form}
                        editAble={this.state.editAble}
                        editData={this.state.editData}
                        tablechange={this.changeTableData}
                        getOptions={getOptions}
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
                          bize_type: 'moral/kaohe',
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
            {this.state.defaultActiveKey === '3' &&
              <span>
                <Row>
                  <Descriptions
                    title=""
                    layout="vertical"
                    bordered={true}
                  >
                    <Descriptions.Item label="要求2" span={3}>
                      <Badge status="processing" text="是否有下列情况：（2）党员受到党内“警告”处分一年内、“严重警告”处分1.5年内，“撤销党内职务”处分2年内，“留党查看”处分期内及处分期满2年内，“开除党籍”处分5年内不得申报" />
                    </Descriptions.Item>
                    <Descriptions.Item label="本人情况（请填写）：" span={3}>
                      <Form className="modal-form" layout="inline" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <FormItem label="">
                          {getFieldDecorator('warning', {
                            initialValue: editData ? editData.warning : null,
                            rules: [
                              // { required: true, message: '请输入师德师风综述' }
                            ],
                          })(
                            <TextArea
                              disabled={!!editAble ? false : true}
                              placeholder="请输入本人情况"
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
                          bize_type: 'moral/warning',
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
            {this.state.defaultActiveKey === '4' &&
              <span>
                <Row>
                  <Descriptions
                    title=""
                    layout="vertical"
                    bordered={true}
                  >
                    <Descriptions.Item label="要求2" span={3}>
                      <Badge status="processing" text="是否有下列情况：（3）事业单位工作人员（企业人员参照执行）收到行政“记过”处分1年、“降低岗位登记或者撤职”处分2年内不得申报；受到“开除”处分5年内不得申报。" />
                    </Descriptions.Item>
                    <Descriptions.Item label="本人情况（请填写）：" span={3}>
                      <Form className="modal-form" layout="inline" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <FormItem label="">
                          {getFieldDecorator('punish', {
                            initialValue: editData ? editData.punish : null,
                            rules: [
                              // { required: true, message: '请输入师德师风综述' }
                            ],
                          })(
                            <TextArea
                              disabled={!!editAble ? false : true}
                              placeholder="请输入本人情况"
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
                          bize_type: 'moral/punish',
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
          </div>
        </div>
      </div >
    );
  }
}

export default Form.create({})(Moral);
