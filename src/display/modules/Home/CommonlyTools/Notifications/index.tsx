import * as React from 'react';
// import moment from 'moment';
import _ from 'lodash';
import {
    Form,
    Typography,
    Card,
    Switch,
    Row,
    Col,
    Button,
    message,
    Checkbox,
    Modal,
    Select,
    Icon,
    Upload,
} from 'antd';
import Calendar from './Calendar';
import Modalcom from './Modal';
const { confirm } = Modal;
const { Title } = Typography;
import './index.css';
/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
    form: any;
}
/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState<T, U> {
    TaskList: T[];
    visible: boolean;
    visibleupload: boolean;
    after_class_service: boolean;
    distribute_food: boolean;
    selectitem: U;
    time: string;
    showdelete: boolean;
    confirmLoading: boolean;
    fileLists: UploadFile<any>[];
    fileList: UploadFile<any>[];
}
// 接口
import { notifications } from 'src/api';
import { GetTaskparams, GetTaskResults, EditItems, NoticeTypeEn } from 'src/dataModel/Notifications';
import moment from 'moment';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { UploadFile } from 'antd/lib/upload/interface';

/**
 * SpecialityInfoSearch
 */
class Notifications extends React.PureComponent<IProps, IState<GetTaskResults, EditItems>> {
    fileIdsForAddOrEdit: any[];
    formmodal: React.RefObject<any>;
    constructor(props: any) {
        super(props);
        this.state = {
            TaskList: [],
            visible: false,
            after_class_service: true,
            distribute_food: true,
            selectitem: {},
            time: '',
            showdelete: false,
            visibleupload: false,
            confirmLoading: false,
            fileLists: [],
            fileList: [],
        };
        this.formmodal = React.createRef();
    }
    UNSAFE_componentWillMount() {
        this.getTasksInfoList();
    }
    // 处理日历返回时间标准化
    handleTime = (date: Date) => {
        const year = new Date(date).getFullYear();
        const month = new Date(date).getMonth() + 1 < 10 ? `0${new Date(date).getMonth() + 1}` : new Date(date).getMonth() + 1;
        const day = new Date(date).getDate() < 10 ? `0${new Date(date).getDate()}` : new Date(date).getDate();
        const hours = new Date(date).getHours() < 10 ? `0${new Date(date).getHours()}` : new Date(date).getHours();
        const minutes = new Date(date).getMinutes() < 10 ? `0${new Date(date).getMinutes()}` : new Date(date).getMinutes();
        const seconds = new Date(date).getSeconds() < 10 ? `0${new Date(date).getSeconds()}` : new Date(date).getSeconds();
        const hms = `${hours}:${minutes}:${seconds}`;
        const ymd = `${year}-${month}-${day}`;
        return {
            year,
            month,
            day,
            hours,
            minutes,
            seconds,
            hms,
            ymd,
        };
    }
    // 获取任务列表
    getTasksInfoList = async (e?: any) => {
        let paramas: GetTaskparams = {};
        if (e) {
            const { year, month } = this.handleTime(e);
            paramas = {
                month: `${year}-${month}`
            };
        } else {
            const { year, month } = this.handleTime(new Date());
            paramas = {
                month: `${year}-${month}`
            };
        }
        const res = await notifications.getTaskList(paramas);
        if (res.results) {
            const { data } = res.results;
            this.setState({
                TaskList: data,
            });
        }
        this.getswitchinfo();
    }
    // 面板变化
    onPanelChange = (e: any) => {
        const { ymd } = this.handleTime(e);
        this.setState({
            time: ymd
        });
        this.getTasksInfoList(e);
    }
    // 日期选择变化
    onSelect = (e: any, item: any): any => {
        const { ymd } = this.handleTime(e);
        this.setState({
            time: ymd
        });
        // console.log(year, month, day, item);
        if (item) {
            this.formmodal.current.setFieldsValue({ 'type': item.notification_type === 'after_class_service' ? 'after_class_service' : 'distribute_food', 'time': moment(item.plan_time, 'HH:mm:ss') });
            this.setState({
                visible: true,
                selectitem: item,
            });
        } else {
            this.setState({
                selectitem: {},
                visible: true,
            });
        }

    }
    // 新建或编辑消息提醒
    handlesubmit = async (e: any) => {
        this.setState({
            visible: false
        });
        let params;
        const { hms } = this.handleTime(e.time);
        if (JSON.stringify(this.state.selectitem) !== '{}') {
            console.log('编辑');
            params = {
                type: e.type,
                plan_date: this.state.selectitem.plan_date,
                plan_time: hms,
                state: 1,
                id: this.state.selectitem.id
            };
            const res = await notifications.updateNotice(params as any);
            if (res.code === 0) {
                message.success('修改成功');
                setTimeout(() => {
                    this.getTasksInfoList(this.state.selectitem.plan_date);
                }, 500);
            } else {
                message.error(res.msg);
            }
        } else {
            console.log('新建');
            params = {
                type: e.type,
                plan_date: this.state.time,
                plan_time: hms,
                state: 1
            };
            const res = await notifications.createNotice(params as any);
            if (res.code === 0) {
                message.success('新建成功');
                setTimeout(() => {
                    this.getTasksInfoList(this.state.time);
                }, 500);

            } else {
                message.error(res.msg);
            }
        }

    }
    // 取消
    handleCancel = () => {
        this.setState({
            visible: false,
            selectitem: {},
        });
    }
    // 获取开关信息
    getswitchinfo = async () => {
        const res = await notifications.switchinfo();
        if (res.results?.data) {
            res.results.data.forEach((item: any) => {
                console.log(NoticeTypeEn[0]);
                if (item.notification_type === NoticeTypeEn[0]) {
                    console.log('111', item.state);
                    this.setState({
                        after_class_service: item.state ? true : false
                    }, () => {
                        console.log('hou', this.state.after_class_service);
                    });
                }
                if (item.notification_type === NoticeTypeEn[1]) {
                    console.log('222', item.state);
                    this.setState({
                        distribute_food: item.state ? true : false
                    });
                }
            });
        }
    }
    // 设置通知开关
    onChange = async (checked: boolean, type: string) => {
        let params = {
            type,
            state: checked ? 1 : 0
        };
        const res = await notifications.setNoticeSwitch(params);
        if (res.code === 0) {
            message.success('消息通知设置成功');
        } else {
            message.error(res.msg);
        }
        if (type === 'after_class_service') {
            this.setState({
                after_class_service: checked
            });
        }
        if (type === 'distribute_food') {
            this.setState({
                distribute_food: checked
            });
        }
    }
    // 删除按钮展示
    showdeleteItem = (e: CheckboxChangeEvent) => {
        e.stopPropagation();
        this.setState({
            showdelete: e.target.checked
        });
    }
    getTasksAfterDelete = () => {
        this.getTasksInfoList(this.state.time !== '' && this.state.time);
    }
    // 确认删除
    deleteItemfin = (e: React.MouseEvent, item: any) => {
        this.showDeleteConfirm(item, this.getTasksAfterDelete);

    }
    // 删除确认
    showDeleteConfirm = (item: any, fun: any) => {
        confirm({
            title: '确认删除该条提醒?',
            content: '',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                console.log(item);
                let param = {
                    type: item.notification_type
                };
                let id = item.id;
                notifications.deleteNotice(param, id).then((res) => {
                    if (res.code === 0) {
                        message.success('删除成功');
                        setTimeout(() => {
                            fun();
                        }, 500);
                    } else {
                        message.error(res.msg);
                    }
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    // 下载excel模板
    downloadtemplate = async () => {
        const res = await notifications.downloadtemplate();
        if (res.data) {
            const blob = new Blob([res.data as any], {
                type: 'application/octet-stream'
            });
            const contentDisposition =
                res.headers['content-disposition'];
            let fileName = ''; // this.globalFileName 从后台获取的文件名字
            if (contentDisposition) {
                fileName += window.decodeURI(
                    res.headers['content-disposition']
                        .split(';')
                        .find((s: string) => s.includes('filename*'))
                        .split('=')[1] ? res.headers['content-disposition']
                            .split(';')
                            .find((s: string) => s.includes('filename*'))
                            .split('=')[1].split('\'\'')[1] : res.headers['content-disposition']
                                .split(';')
                                .find((s: string) => s.includes('filename'))
                                .split('=')[1]
                );
            }
            // 非IE下载
            if ('download' in document.createElement('a')) {
                let oa = document.createElement('a');
                oa.href = window.URL.createObjectURL(blob);
                oa.download = fileName;
                document.body.appendChild(oa);
                oa.click();
                setTimeout(function () {
                    window.URL.revokeObjectURL(oa.href);
                    document.body.removeChild(oa);
                }, 3000);
            } else {
                // IE10+下载
                (window.navigator as any).msSaveBlob(blob, fileName);
            }
        }
    }
    // 导入
    handleimport = () => {
        this.setState({
            visibleupload: true
        });
    }
    // 导入modal框 选择信息
    uploadfile = () => {
        this.setState({
            confirmLoading: true,
        });
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.handleupdate(values);
                setTimeout(() => {
                    this.setState({
                        confirmLoading: false,
                    });
                }, 500);
            } else {
                setTimeout(() => {
                    this.setState({
                        confirmLoading: false,
                    });
                }, 500);
            }
        });
    }
    hideModal = () => {
        this.setState({
            visibleupload: false
        });
        this.setState({
            fileList: [],
            fileLists: [],
        });
    }
    // 上传
    handleupdate = async (value: any) => {
        const { fileLists } = this.state;
        if (fileLists.length !== 0) {
            const file = fileLists[0].originFileObj;
            let params = {
                bize_type: 'teacher/notification/plan',
                file,
                type: value.type
            };
            const res = await notifications.uploadtemplate(params);
            if (res.code === 0) {
                message.success('上传成功');
                this.hideModal();
            } else {
                message.error(res.msg);
            }
        } else {
            message.warning('请上传文件');
        }

    }
    // 确认框
    render() {
        // const uploadAttachUrl = window.$$_web_env.apiDomain + Urls.uploadtemplate;
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 20 },
        };
        const { confirmLoading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const Selectoption = [{ type: '打饭', value: 'distribute_food' }, { type: '延时服务', value: 'after_class_service' }];
        const formItemLayouts = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        const type = {
            rules: [{ type: 'string', required: true, message: '请选择提醒事件' }],
        };
        // 上传参数
        const props = {
            name: 'file',
            accept: '.xlsx,.xls',
            customRequest: (file: any) => this.setState({
                fileList: file
            }),
            // onRemove: (file: UploadFile<any>) => {
            //     this.setState(state => {
            //         const index = state.fileList.indexOf(file);
            //         const newFileList = state.fileList.slice();
            //         newFileList.splice(index, 1);
            //         return {
            //             fileList: newFileList,
            //         };
            //     });
            // },
            // beforeUpload: (file:any) => {
            //     this.setState(state => ({
            //       fileList: [...state.fileList, file],
            //     }));
            //     return false;
            //   },
            onChange: (file: any) => {
                file.file.status = 'done';
                this.setState({
                    fileLists: file.fileList
                });
            },
            fileList: this.state.fileLists,
        };
        return (
            <div >
                <Card>
                    <Typography>
                        <Title level={2} className="title">待办提醒</Title>
                        <Row>
                            <Form layout="inline" {...formItemLayout} >
                                <Col span={16}>
                                    <Form.Item label="微信提醒" />
                                    <Form.Item label="打饭">
                                        <Switch onChange={(checked) => this.onChange(checked, 'distribute_food')} checked={this.state.distribute_food} />
                                    </Form.Item>
                                    <Form.Item label="延时服务">
                                        <Switch onChange={(checked) => this.onChange(checked, 'after_class_service')} checked={this.state.after_class_service} />
                                    </Form.Item>
                                    <Form.Item >
                                        <span>设置提醒后，待办事项会提前5min通过微信提醒</span>
                                    </Form.Item>
                                </Col>
                                <Col span={8} >
                                    <Row type="flex" justify="end" align="middle">
                                        <Col span={8}>
                                            <Checkbox onChange={this.showdeleteItem}>删除</Checkbox>
                                        </Col>
                                        <Col span={7}>
                                            <Form.Item >
                                                <a href="#" onClick={this.downloadtemplate}>Excel模板</a>
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <Form.Item >
                                                <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleimport}>
                                                    导入提醒表
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Form>
                        </Row>
                        <Row>
                            <Calendar TaskList={this.state.TaskList} PanelChange={this.onPanelChange} Selectchange={this.onSelect} showdelete={this.state.showdelete} handledelete={this.deleteItemfin} />
                        </Row>
                    </Typography>
                </Card >
                <Modalcom visible={this.state.visible} handlesubmit={this.handlesubmit} handleCancel={this.handleCancel} ref={this.formmodal} />
                <Modal
                    title="导入提醒表"
                    visible={this.state.visibleupload}
                    confirmLoading={confirmLoading}
                    onOk={this.uploadfile}
                    onCancel={this.hideModal}
                    okText="导入"
                    cancelText="取消"
                >
                    <Form {...formItemLayouts}>
                        <Form.Item label="上传文件提醒类型" style={{ marginBottom: '10px' }}>
                            {getFieldDecorator('type', type)(<Select>
                                {
                                    Selectoption.map((item) =>
                                        <Select.Option key={item.value} value={item.value}>
                                            {item.type}
                                        </Select.Option>
                                    )
                                }
                            </Select>)}
                        </Form.Item>
                        <Form.Item label="上传文件" style={{ marginBottom: '10px' }}>
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload" /> Upload
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>
            </div >
        );
    }
}

export default Form.create({})(Notifications);