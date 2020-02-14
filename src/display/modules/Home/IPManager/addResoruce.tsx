import * as React from 'react';
import { Form, Input, Row, Col, Select, Divider, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';

// import CommonUtils from 'src/utils/commonUtils';
moment.locale('zh-cn');
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  purchaseChannelChoices: any;
  monetaryUnitChoices: any;
  // burstBillingChoices: any;
  // changeTypeChoices: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

/**
 * 
 */
class AddEditContractModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      // protocolSupportList: [],
    };
  }

  render() {
    const {
      editData,
      purchaseChannelChoices,
      monetaryUnitChoices,
      // burstBillingChoices,
    } = this.props;

    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form className="modal-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
          <Divider orientation="left">基础信息</Divider>
          <Row>
            <Col span={12}>
              <FormItem label="合同编号">
                {getFieldDecorator('contract_code', {
                  initialValue: editData ? editData.contract_code : null,
                  rules: [
                    { required: true, message: '请输入合同编号', whitespace: true }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="商务实体">
                {getFieldDecorator('business_instance', {
                  initialValue: editData ? editData.business_instance : null,
                  rules: [
                    { required: true, message: '请输入商务实体', whitespace: true }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="资源类型">
                {getFieldDecorator('resource_type', {
                  initialValue: editData ? editData.resource_type : null,
                  rules: [
                    { required: true, message: '请输入对端名称' }
                  ],
                })(
                  <Select
                  // style={{ width: 150 }}
                  >
                    {purchaseChannelChoices.map((type: any) => (
                      <Option value={type.id} key={type.id}>{type.name}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="授权主体" >
                {getFieldDecorator('authorization_instance', {
                  initialValue: editData ? editData.authorization_instance : null,
                  rules: [
                    { required: true, message: '请输入授权主体', whitespace: true }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="服务起始">
                {getFieldDecorator('current_start_date', {
                  initialValue: editData ? moment(editData.current_start_date, 'YYYY-MM-DD') : null,
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
            <Col span={12}>
              <FormItem label="服务结束">
                {getFieldDecorator('current_end_date', {
                  initialValue: editData ? moment(editData.current_end_date, 'YYYY-MM-DD') : null,
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
          <Row>

            <Col span={12}>
              <FormItem label="续约提醒">
                {getFieldDecorator('remind', {
                  initialValue: editData ? editData.remind : null,
                  rules: [
                    { required: true, message: '请输入续约提醒' }
                  ],
                })(
                  <InputNumber min={1} step={1} precision={0} />
                )}
                &nbsp; &nbsp;天
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="备注" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                {getFieldDecorator('note', {
                  initialValue: editData ? editData.note : null,
                  rules: [
                    { required: true, message: '请输入备注' }
                  ],
                })(
                  <TextArea rows={4} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Divider orientation="left">费用信息</Divider>
          <Row>
            <Col span={12}>
              <FormItem label="货币单位">
                {getFieldDecorator('monetary_unit', {
                  initialValue: editData ? editData.monetary_unit : null,
                  rules: [
                    { required: true, message: '请选择货币单位' }
                  ],
                })(
                  <Select
                  // style={{ width: 150 }}
                  >
                    {monetaryUnitChoices.map((type: any) => (
                      <Option value={type.id} key={type.id}>{type.name}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="合同月付">
                {getFieldDecorator('monthly_payment', {
                  initialValue: editData ? editData.monthly_payment : null,
                  rules: [
                    { required: true, message: '请输入合同月付' }
                  ],
                })(
                  <InputNumber min={1} step={1} precision={0} />
                )}
              </FormItem>
            </Col>
          </Row>

        </Form>
      </div>
    );
  }
}

export default AddEditContractModal;
