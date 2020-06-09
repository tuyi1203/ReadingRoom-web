import * as React from 'react';
import {
  Form,
  Input,
  Switch,
  Select,
  DatePicker,
  Divider,
  Upload,
  Button,
  List,
  message,
  Icon,
  Typography,
  Popconfirm,
} from 'antd';
// import CommonUtils from 'src/utils/commonUtils';
import { files } from 'src/api';
import IToken from 'src/dataModel/IToken';
import moment from 'moment';
import Urls from 'src/config/Urls';
import storageUtils from 'src/utils/storageUtils';
import Constant from 'src/dataModel/Constant';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const { TextArea } = Input;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  defaultActiveKey: string;
  getOption: any;
  updateFileIds: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  awardOrNot: boolean;
  uploadedAttachFiles: any[]; // 上传的业绩文件ID
  uploadedAwardFiles: any[]; // 上传的奖励列表ID
  attachList: any[]; // 业绩列表
  awardList: any[]; // 奖励列表
}

/**
 * AddModal
 */
class AddEditModal extends React.PureComponent<IProps, IState> {
  fileIds: any[];

  constructor(props: any) {
    super(props);
    this.state = {
      awardOrNot: this.props.editData && this.props.editData.award ? true : false,
      uploadedAttachFiles: this.props.editData && this.props.editData.achievement_files
        ? this.props.editData.achievement_files.map((item: any) => item.id)
        : [], // 已上传业绩文件ID列表
      uploadedAwardFiles: this.props.editData && this.props.editData.award_files
        ? this.props.editData.award_files.map((item: any) => item.id)
        : [], // 已上传的奖励文件ID列表
      attachList: [], // 业绩列表
      awardList: [], // 奖励列表
    };

    this.fileIds = [];

    if (this.props.editData && this.props.editData.achievement_files) {
      this.props.editData.achievement_files.map((item: any) => this.fileIds.push(item.id));
    }
    if (this.props.editData && this.props.editData.award_files) {
      this.props.editData.award_files.map((item: any) => this.fileIds.push(item.id));
    }
    this.props.updateFileIds(this.fileIds);

  }

  UNSAFE_componentWillMount() {
    if (this.props.editData) {
      this.getAttachList();
      if (this.props.editData.award) {
        this.getAwardList();
      }
    }
  }

  /**
   * 取得业绩印证材料列表
   */
  getAttachList = async () => {
    let params: any = {
      ids: this.state.uploadedAttachFiles
    };

    const res = await files.getFileListByIds(params);
    if (res.code) {
      message.error(res.msg);
      return;
    }
    this.setState({
      attachList: res.results.data
    });
  }

  /**
   * 取得获奖印证材料列表
   */
  getAwardList = async () => {
    let params: any = {
      ids: this.state.uploadedAwardFiles
    };

    const res = await files.getFileListByIds(params);
    if (res.code) {
      message.error(res.msg);
      return;
    }
    this.setState({
      awardList: res.results.data
    });
  }

  render() {
    const {
      editData,
      defaultActiveKey,
      getOption,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      awardOrNot,
      attachList,
      awardList,
    } = this.state;
    const uploadAttachUrl = window.$$_web_env.apiDomain + Urls.addFile;

    /*
     * 改变获奖状态
     */
    const changeAward = (checked: boolean) => {
      this.setState({
        awardOrNot: checked,
      });
      if (checked) {
        this.getAwardList();
      }
    };

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
     * 业绩文件上传
     */
    const onUplodChange = async (info: any) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (!info.file.response.code) {
          // 如果上传成功
          const { uploadedAttachFiles } = this.state;
          uploadedAttachFiles.push(info.file.response.results.data.fileId);
          this.fileIds = uploadedAttachFiles.concat(this.state.uploadedAwardFiles);
          this.props.updateFileIds(this.fileIds);
          this.setState({
            uploadedAttachFiles
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
     * 奖励文件上传
     */
    const onUplodAwardChange = async (info: any) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (!info.file.response.code) {
          // 如果上传成功
          const { uploadedAwardFiles } = this.state;
          uploadedAwardFiles.push(info.file.response.results.data.fileId);
          this.fileIds = uploadedAwardFiles.concat(this.state.uploadedAttachFiles);
          this.props.updateFileIds(this.fileIds);
          this.setState({
            uploadedAwardFiles
          }, () => {
            this.getAwardList();
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

      const { uploadedAwardFiles } = this.state;
      const fileIds = uploadedAwardFiles.filter((item: any) => item !== record.id);

      this.setState({
        uploadedAwardFiles: fileIds
      }, () => {
        this.getAttachList();
        this.fileIds = fileIds.concat(this.state.uploadedAttachFiles);
        this.props.updateFileIds(this.fileIds);
      });

    };

    /**
     * 删除奖励附件
     */
    const delAwardList = async (record: any) => {
      const res = await files.delFile(record.id, {});
      if (res && res.code) {
        message.error(res.msg);
        return;
      }

      const { uploadedAttachFiles } = this.state;
      const fileIds = uploadedAttachFiles.filter((item: any) => item !== record.id);

      message.success('删除成功');
      this.setState({
        uploadedAttachFiles: fileIds
      }, () => {
        this.getAwardList();
        this.fileIds = fileIds.concat(this.state.uploadedAwardFiles);
        this.props.updateFileIds(this.fileIds);
      });

    };

    /**
     * 校验确认密码
     */
    // const validatePasswordConfirm = (rule: any, value: any, callback: any) => {
    //   if (!value || this.props.form.getFieldValue('password') !== value) {
    //     callback(new Error('确认密码不能为空，且两次输入的密码必须一致！'));
    //   }
    //   callback();
    // };

    /**
     * 校验手机号码
     */
    // const validateMobile = (rule: any, value: any, callback: any) => {
    //   if (!CommonUtils.regex('mobile', value)) {
    //     callback('请输入正确的手机号码！');
    //   }
    //   callback();
    // };

    /**
     * 校验密码
     */
    // const validatePasswordConfirm = (rule: any, value: any, callback: any) => {
    //   const passwordValue = this.props.form.getFieldValue('password');
    //   if (passwordValue !== value) {
    //     callback('两次密码应该一致');
    //   }
    //   callback();
    // };

    /**
     * 获取域选项
     */
    /*
    const getDomainOptions = () => {
      const list: any[] = [];
      if (domainList && domainList.length > 0) {
        domainList.forEach((p: any) => {
          list.push({
            label: p.name,
            value: p.id
          });
        });
      }
      return list;
    };
    */

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Divider>成果信息</Divider>
        <FormItem label="学科领域">
          {getFieldDecorator('course', {
            initialValue: editData ? editData.course.toString() : null,
            rules: [
              { required: true, message: '请选择学科领域' }
            ],
          })(
            <Select
              style={{ width: 400 }}
            >
              {getOption('course').map((item: any) => (
                <Option value={item.value} key={item.value}>{item.label}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="成果类型">
          {getFieldDecorator('achievement_type', {
            initialValue: editData ? editData.achievement_type.toString() : null,
            rules: [
              { required: true, message: '请选择成果类型' }
            ],
          })(
            <Select
              style={{ width: 400 }}
            >
              {getOption('achievement_type').map((item: any) => (
                <Option value={item.value} key={item.value}>{item.label}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="是否获奖">
          {getFieldDecorator('award', {
            valuePropName: 'checked',
            initialValue: editData && editData.award === 1 ? true : false,
          })(
            <Switch checkedChildren="是" unCheckedChildren="否" onChange={changeAward} />
          )}
        </FormItem>
        {defaultActiveKey === '1' &&
          <span>
            <FormItem label="论文名称">
              {getFieldDecorator('paper_title', {
                initialValue: editData ? editData.paper_title : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="发表刊物名称">
              {getFieldDecorator('paper_book_title', {
                initialValue: editData ? editData.paper_book_title : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="刊号">
              {getFieldDecorator('paper_book_kanhao', {
                initialValue: editData ? editData.paper_book_kanhao : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="卷号">
              {getFieldDecorator('paper_book_juanhao', {
                initialValue: editData ? editData.paper_book_juanhao : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="发表年月" style={{ margin: 0 }}>
              {
                getFieldDecorator('paper_date', {
                  initialValue: editData && editData.paper_date ? moment(editData.paper_date, 'YYYY-MM') : null,
                  // initialValue: record[dataIndex],
                })
                  (<MonthPicker />)
              }
            </FormItem >
            <FormItem label="是否核心刊物">
              {getFieldDecorator('paper_core_book', {
                valuePropName: 'checked',
                initialValue: editData && editData.paper_core_book === 1 ? true : false,
              })(
                <Switch checkedChildren="是" unCheckedChildren="否" />
              )}
            </FormItem>
            <FormItem label="起始页码">
              {getFieldDecorator('paper_start_page', {
                initialValue: editData ? editData.paper_start_page : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="结束页码">
              {getFieldDecorator('paper_end_page', {
                initialValue: editData ? editData.paper_end_page : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="本人作用">
              {getFieldDecorator('paper_role', {
                initialValue: editData && editData.paper_role ? editData.paper_role.toString() : null,
                rules: [
                  // { required: true, message: '请选择学科领域' }
                ],
              })(
                <Select
                  style={{ width: 400 }}
                >
                  {getOption('paper_role').map((item: any) => (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="作者人数">
              {getFieldDecorator('paper_author_num', {
                initialValue: editData ? editData.paper_author_num : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="本人排名">
              {getFieldDecorator('paper_author_rank', {
                initialValue: editData ? editData.paper_author_rank : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="本人撰写字数">
              {getFieldDecorator('paper_author_count', {
                initialValue: editData ? editData.paper_author_count : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="本人撰写章节">
              {getFieldDecorator('paper_author_section', {
                initialValue: editData ? editData.paper_author_section : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="论文收录情况">
              {getFieldDecorator('paper_quote', {
                initialValue: editData ? editData.paper_quote : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <TextArea autoSize={{ minRows: 5, maxRows: 10 }} />
              )}
            </FormItem>
            <FormItem label="印证材料">
              <Upload
                name="file"
                action={uploadAttachUrl}
                headers={{
                  'authorization': getToken(),
                  // 'Content-Type': ContentType.MULTIPART
                }}
                data={{
                  bize_type: 'research/achievement',
                  bize_id: editData && editData.id ? editData.id : '',
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
                        <Popconfirm title="确认删除吗?" onConfirm={() => del(item)}>
                          <Button type="danger">删除</Button>
                        </Popconfirm>
                      </span>
                    </List.Item>
                  )}
                />
              }
            </FormItem>
          </span>
        }
        {defaultActiveKey === '2' &&
          <span>
            <FormItem label="课题名称">
              {getFieldDecorator('subject_title', {
                initialValue: editData ? editData.subject_title : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="发表刊物名称">
              {getFieldDecorator('subject_no', {
                initialValue: editData ? editData.subject_no : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="课题类别">
              {getFieldDecorator('subject_type', {
                initialValue: editData && editData.subject_type ? editData.subject_type.toString() : null,
                rules: [
                  // { required: true, message: '请选择学科领域' }
                ],
              })(
                <Select
                  style={{ width: 400 }}
                >
                  {getOption('subject_type').map((item: any) => (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="课题类别">
              {getFieldDecorator('subject_level', {
                initialValue: editData && editData.subject_level ? editData.subject_level.toString() : null,
                rules: [
                  // { required: true, message: '请选择学科领域' }
                ],
              })(
                <Select
                  style={{ width: 400 }}
                >
                  {getOption('subject_level').map((item: any) => (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="课题负责人">
              {getFieldDecorator('subject_responseable_man', {
                initialValue: editData ? editData.subject_responseable_man : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="课题中本人角色">
              {getFieldDecorator('subject_role', {
                initialValue: editData ? editData.subject_role : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="课题中本人排名">
              {getFieldDecorator('subject_self_rank', {
                initialValue: editData ? editData.subject_self_rank : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="课题经费">
              {getFieldDecorator('subject_cost', {
                initialValue: editData ? editData.subject_cost : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="课题状态">
              {getFieldDecorator('subject_status', {
                initialValue: editData && editData.subject_status ? editData.subject_status.toString() : null,
                rules: [
                  // { required: true, message: '请选择学科领域' }
                ],
              })(
                <Select
                  style={{ width: 400 }}
                >
                  {getOption('subject_status').map((item: any) => (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="课题委托单位">
              {getFieldDecorator('subject_delegate', {
                initialValue: editData ? editData.subject_delegate : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="课题承担单位">
              {getFieldDecorator('subject_exec', {
                initialValue: editData ? editData.subject_exec : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="课题开始月份" style={{ margin: 0 }}>
              {
                getFieldDecorator('subject_start_date', {
                  initialValue: editData && editData.subject_start_date ? moment(editData.subject_start_date, 'YYYY-MM') : null,
                  // initialValue: record[dataIndex],
                })
                  (<MonthPicker />)
              }
            </FormItem>
            <FormItem label="课题结束月份" style={{ margin: 0 }}>
              {
                getFieldDecorator('subject_end_date', {
                  initialValue: editData && editData.subject_end_date ? moment(editData.subject_end_date, 'YYYY-MM') : null,
                  // initialValue: record[dataIndex],
                })
                  (<MonthPicker />)
              }
            </FormItem>
            <FormItem label="印证材料">
              <Upload
                name="file"
                action={uploadAttachUrl}
                headers={{
                  'authorization': getToken(),
                  // 'Content-Type': ContentType.MULTIPART
                }}
                data={{
                  bize_type: 'research/achievement',
                  bize_id: editData && editData.id ? editData.id : '',
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
                        <Popconfirm title="确认删除吗?" onConfirm={() => del(item)}>
                          <Button type="danger">删除</Button>
                        </Popconfirm>
                      </span>
                    </List.Item>
                  )}
                />
              }
            </FormItem>
          </span>
        }
        {defaultActiveKey === '3' &&
          <span>
            <FormItem label="著作名称">
              {getFieldDecorator('book_title', {
                initialValue: editData ? editData.book_title : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="著作类别">
              {getFieldDecorator('book_type', {
                initialValue: editData ? editData.book_type : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="出版社名称">
              {getFieldDecorator('book_publish_company_name', {
                initialValue: editData ? editData.book_publish_company_name : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="出版号">
              {getFieldDecorator('book_publish_no', {
                initialValue: editData ? editData.book_publish_no : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="出版日期" style={{ margin: 0 }}>
              {
                getFieldDecorator('book_publish_date', {
                  initialValue: editData && editData.book_publish_date ? moment(editData.book_publish_date, 'YYYY-MM') : null,
                  // initialValue: record[dataIndex],
                })
                  (<MonthPicker />)
              }
            </FormItem>
            <FormItem label="著作中本人角色">
              {getFieldDecorator('book_role', {
                initialValue: editData ? editData.book_role : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="总字数">
              {getFieldDecorator('book_write_count', {
                initialValue: editData ? editData.book_write_count : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="作者人数">
              {getFieldDecorator('book_author_num', {
                initialValue: editData ? editData.book_author_num : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="本人撰写字数">
              {getFieldDecorator('book_author_write_count', {
                initialValue: editData ? editData.book_author_write_count : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="本人排名">
              {getFieldDecorator('book_author_rank', {
                initialValue: editData ? editData.book_author_rank : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="印证材料">
              <Upload
                name="file"
                action={uploadAttachUrl}
                headers={{
                  'authorization': getToken(),
                  // 'Content-Type': ContentType.MULTIPART
                }}
                data={{
                  bize_type: 'research/achievement',
                  bize_id: editData && editData.id ? editData.id : '',
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
                        <Popconfirm title="确认删除吗?" onConfirm={() => del(item)}>
                          <Button type="danger">删除</Button>
                        </Popconfirm>
                      </span>
                    </List.Item>
                  )}
                />
              }
            </FormItem>
          </span>
        }
        {defaultActiveKey === '4' &&
          <span>
            <FormItem label="专利或软件著作权类型">
              {getFieldDecorator('copyright_type', {
                initialValue: editData ? editData.copyright_type : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="专利或软件著作权名称">
              {getFieldDecorator('copyright_title', {
                initialValue: editData ? editData.copyright_title : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="审批时间" style={{ margin: 0 }}>
              {
                getFieldDecorator('copyright_ratification', {
                  initialValue: editData && editData.copyright_ratification ? moment(editData.copyright_ratification, 'YYYY-MM') : null,
                  // initialValue: record[dataIndex],
                })
                  (<MonthPicker />)
              }
            </FormItem>
            <FormItem label="本人角色">
              {getFieldDecorator('copyright_role', {
                initialValue: editData ? editData.copyright_role : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="专利号（登记号）">
              {getFieldDecorator('copyright_no', {
                initialValue: editData ? editData.copyright_no : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="印证材料">
              <Upload
                name="file"
                action={uploadAttachUrl}
                headers={{
                  'authorization': getToken(),
                  // 'Content-Type': ContentType.MULTIPART
                }}
                data={{
                  bize_type: 'research/achievement',
                  bize_id: editData && editData.id ? editData.id : '',
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
                        <Popconfirm title="确认删除吗?" onConfirm={() => del(item)}>
                          <Button type="danger">删除</Button>
                        </Popconfirm>
                      </span>
                    </List.Item>
                  )}
                />
              }
            </FormItem>
          </span>
        }
        {awardOrNot &&
          <span>
            <Divider>获奖情况</Divider>
            <FormItem label="获奖时间" style={{ margin: 0 }}>
              {
                getFieldDecorator('award_date', {
                  initialValue: editData && editData.award_date ? moment(editData.award_date, 'YYYY-MM') : null,
                  // initialValue: record[dataIndex],
                })
                  (<MonthPicker />)
              }
            </FormItem >
            <FormItem label="获奖名称">
              {getFieldDecorator('award_title', {
                initialValue: editData ? editData.award_title : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="授奖国家（地区）">
              {getFieldDecorator('award_authoriry_country', {
                initialValue: editData ? editData.award_authoriry_country : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="授奖单位">
              {getFieldDecorator('award_authoriry_organization', {
                initialValue: editData ? editData.award_authoriry_organization : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="获奖类别">
              {getFieldDecorator('award_type', {
                initialValue: editData && editData.award_type ? editData.award_type.toString() : null,
                rules: [
                  // { required: true, message: '请选择学科领域' }
                ],
              })(
                <Select
                  style={{ width: 400 }}
                >
                  {getOption('award_type').map((item: any) => (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="获奖级别">
              {getFieldDecorator('award_level', {
                initialValue: editData && editData.award_level ? editData.award_level.toString() : null,
                rules: [
                  // { required: true, message: '请选择学科领域' }
                ],
              })(
                <Select
                  style={{ width: 400 }}
                >
                  {getOption('award_level').map((item: any) => (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="获奖等次">
              {getFieldDecorator('award_position', {
                initialValue: editData ? editData.award_position : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="本人排名">
              {getFieldDecorator('award_author_rank', {
                initialValue: editData ? editData.award_author_rank : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="印证材料">
              <Upload
                name="file"
                action={uploadAttachUrl}
                headers={{
                  'authorization': getToken(),
                  // 'Content-Type': ContentType.MULTIPART
                }}
                data={{
                  bize_type: 'research/award',
                  bize_id: editData && editData.id ? editData.id : '',
                }}
                showUploadList={false}
                onChange={onUplodAwardChange}
                multiple={true}
                style={{ marginBottom: 5 }}
              >
                <Button>
                  <Icon type="upload" />点击上传印证材料
                </Button>
              </Upload>
              {
                awardList
                && awardList.length > 0
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
                        <Popconfirm title="确认删除吗?" onConfirm={() => delAwardList(item)}>
                          <Button type="danger">删除</Button>
                        </Popconfirm>
                      </span>
                    </List.Item>
                  )}
                />
              }
            </FormItem>
          </span>
        }
        {/* <FormItem label="用户角色">
          {getFieldDecorator('roles', {
            initialValue: editData ? editData.roles.map((role: any) => role.name) : [],
            rules: [
              { required: true, message: '请选择用户角色' }
            ],
          })(
            <Select
              style={{ width: 200 }}
              mode="multiple"
            >
              {getRoleOptions().map((role: any) => (
                <Option value={role.value} key={role.value}>{role.label}</Option>
              ))}
            </Select>
          )}
        </FormItem> */}
        {/* <FormItem label="组织">
          {getFieldDecorator('domain_id', {
            initialValue: editData ? editData.domain_id : null,
            rules: [
              { required: true, message: '请选择组织' }
            ],
          })(
            // <Radio.Group options={getDomainOptions()} />
            <Select
              style={{ width: 200 }}
              onChange={onChangeDomain}
              disabled={!!editData}
            >
              {getDomainOptions().map((domain: any) => (
                <Option value={domain.value} key={domain.value}>{domain.label}</Option>
              ))}
            </Select>
          )}
        </FormItem> */}
        {/* {editData &&
          <FormItem label="空间">
            {getFieldDecorator('group_ids', {
              initialValue: editData ? editData.group_ids : null,
              rules: [
                { required: true, message: '请选择空间' }
              ],
            })(
              // <Checkbox.Group options={getGroupOptions()} />
              <Select
                style={{ width: 200 }}
                mode="multiple"
              >
                {this.state.groupOptions.map((group: any) => (
                  <Option value={group.value} key={group.value}>{group.label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        } */}

      </Form>
    );
  }
}

export default AddEditModal;
