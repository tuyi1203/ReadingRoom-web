import * as React from 'react';
import {
  Form,
  Input,
  // Switch,
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
  AutoComplete,
} from 'antd';
// import CommonUtils from 'src/utils/commonUtils';
import { files } from 'src/api';
import IToken from 'src/dataModel/IToken';
import moment from 'moment';
import Urls from 'src/config/Urls';
import storageUtils from 'src/utils/storageUtils';
import Constant from 'src/dataModel/Constant';
import Datadict from 'src/dataModel/DataDic';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;
// const { TextArea } = Input;

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
  attachList: any[]; // 业绩列表
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
      attachList: [], // 业绩列表
    };

    this.fileIds = [];

    if (this.props.editData && this.props.editData.achievement_files) {
      this.props.editData.achievement_files.map((item: any) => this.fileIds.push(item.id));
    }
    this.props.updateFileIds(this.fileIds);

  }

  UNSAFE_componentWillMount() {
    if (this.props.editData) {
      this.getAttachList();
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

  render() {
    const {
      editData,
      defaultActiveKey,
      getOption,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      // awardOrNot,
      attachList,
    } = this.state;
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
          this.props.updateFileIds(uploadedAttachFiles);
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

      const { uploadedAttachFiles } = this.state;
      const fileIds = uploadedAttachFiles.filter((item: any) => item !== record.id);

      this.setState({
        uploadedAttachFiles: fileIds
      }, () => {
        this.getAttachList();
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

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
        <Divider>成果信息</Divider>
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
        {defaultActiveKey === '2' &&
          <span>
            <FormItem label="获奖时间" style={{ margin: 0 }}>
              {
                getFieldDecorator('award_date', {
                  initialValue: editData && editData.award_date ? moment(editData.award_date, 'YYYY-MM') : null,
                  // initialValue: record[dataIndex],
                })
                  (<MonthPicker />)
              }
            </FormItem >
            <FormItem label="表彰奖励内容">
              {getFieldDecorator('award_title', {
                initialValue: editData ? editData.award_title : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
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
                initialValue: editData && editData.award_position ? editData.award_position.toString() : null,
                rules: [
                  // { required: true, message: '请选择学科领域' }
                ],
              })(
                <Select
                  style={{ width: 400 }}
                >
                  {getOption('award_position').map((item: any) => (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="授奖单位">
              {getFieldDecorator('award_authoriry_organization', {
                initialValue: editData ? editData.award_authoriry_organization : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <AutoComplete
                  dataSource={Datadict.award_authoriry_organization_options}
                  filterOption={(inputValue, option) => {
                    const val = option.props.children?.toString();
                    if (val) {
                      return val.indexOf(inputValue.toUpperCase()) !== -1;
                    }
                    return false;
                  }}
                />
              )}
            </FormItem>
            <FormItem label="授奖国家(地区）">
              {getFieldDecorator('award_authoriry_country', {
                initialValue: editData ? editData.award_authoriry_country : null,
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
                  bize_type: 'educate/achievement',
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
            <FormItem label="讲座、示范课时间" style={{ margin: 0 }}>
              {
                getFieldDecorator('lecture_date', {
                  initialValue: editData && editData.lecture_date ? moment(editData.lecture_date, 'YYYY-MM') : null,
                  // initialValue: record[dataIndex],
                })
                  (<MonthPicker />)
              }
            </FormItem >
            <FormItem label="讲座内容">
              {getFieldDecorator('lecture_content', {
                initialValue: editData ? editData.lecture_content : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="主讲人">
              {getFieldDecorator('lecture_person', {
                initialValue: editData ? editData.lecture_person : null,
                rules: [
                  // { required: true, message: '请输入姓名' }
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="主办单位">
              {getFieldDecorator('lecture_organization', {
                initialValue: editData ? editData.lecture_organization : null,
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
                  bize_type: 'educate/achievement',
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
      </Form>
    );
  }
}

export default AddEditModal;
