import React from 'react';
import { Modal as Modalantd, TimePicker, Form, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps extends FormComponentProps {
    visible: boolean;
    handlesubmit: (e: any) => void;
    handleCancel: () => void;
}
/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
    confirmLoading: boolean;
}
const Selectoption = [{ type: '打饭', value: 'distribute_food' }, { type: '延时服务', value: 'after_class_service' }];
// import { GetTaskResults, NoticeType } from 'src/dataModel/Notifications';
class Modalcom extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            confirmLoading: false,
        };
    }

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        this.props.form.validateFields((err, values) => {
            if (!err) {
                setTimeout(() => {
                    this.setState({
                        confirmLoading: false,
                    });
                    this.props.handlesubmit(values);
                    this.props.form.resetFields();
                }, 1000);

            } else {
                this.setState({
                    confirmLoading: false,
                });
            }
        });

    }
    handlecancel = () => {
        this.props.form.resetFields();
        this.props.handleCancel();
    }
    handleChange = () => {
        console.log('111');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        const time = {
            rules: [{ type: 'object', required: true, message: '请选择时间!' }],
        };
        const type = {
            rules: [{ type: 'string', required: true, message: '请选择提醒事件' }],
        };
        return (
            <div>
                <Modalantd
                    title="创建消息通知"
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handlecancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="事件名称" style={{ marginBottom: '10px' }}>
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
                        <Form.Item label="时间">
                            {getFieldDecorator('time', time)(<TimePicker />)}
                        </Form.Item>
                    </Form>
                </Modalantd>
            </div >
        );
    }
}
export default Form.create<IProps>({})(Modalcom);