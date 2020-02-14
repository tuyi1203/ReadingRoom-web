import * as React from 'react';
import { Form, Row, Col, Input, Divider, DatePicker } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';

// import CommonUtils from 'src/utils/commonUtils';
moment.locale('zh-cn');
const FormItem = Form.Item;
/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

/**
 * AddEditRenewModal
 */
class AddEditRenewModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      // protocolSupportList: [],
    };
  }

  render() {
    const {
      editData,
    } = this.props;

    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form className="modal-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
          <Divider orientation="left">合同编号：{editData && editData.contract_num}</Divider>
          <Row>
            <Col span={12}>
              <FormItem label="续约提醒" style={{ display: 'none' }}>
                {getFieldDecorator('contract_remind', {
                  initialValue: editData ? editData.contract_remind : null,
                })(
                  <Input disabled={true} />
                )}
              </FormItem>
              <FormItem label="当前服务起始">
                {getFieldDecorator('start_date', {
                  initialValue: editData ? editData.start_date : null,
                  rules: [
                    { required: true, message: '当前服务起始' }
                  ],
                })(
                  <Input disabled={true} />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="当前服务结束">
                {getFieldDecorator('end_date', {
                  initialValue: editData ? editData.end_date : null,
                  rules: [
                    { required: true, message: '请输入服务结束' }
                  ],
                })(
                  <Input disabled={true} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Divider orientation="left">资源续约</Divider>
          <Row>
            <Col span={12}>
              <FormItem label="服务起始">
                {getFieldDecorator('renewal_start_date', {
                  initialValue: (editData && editData.renewal_start_date)
                    ? moment(editData.renewal_start_date, 'YYYY-MM-DD')
                    : null,
                  rules: [
                    { required: true, message: '请输入服务起始' }
                  ],
                })(
                  <DatePicker
                    locale={locale}
                    format="YYYY-MM-DD"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="服务结束">
                {getFieldDecorator('renewal_end_date', {
                  initialValue: (editData && editData.renewal_end_date)
                    ? moment(editData.renewal_end_date, 'YYYY-MM-DD')
                    : null,
                  rules: [
                    { required: true, message: '请输入服务结束' }
                  ],
                })(
                  <DatePicker
                    locale={locale}
                    format="YYYY-MM-DD"
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default AddEditRenewModal;
