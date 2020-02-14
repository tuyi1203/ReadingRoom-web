import * as React from 'react';
import { Form, Input, Row, Col, Select, Divider, DatePicker } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';

// import CommonUtils from 'src/utils/commonUtils';
moment.locale('zh-cn');
const FormItem = Form.Item;
const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  purchaseChannelChoices: any;
  monetaryUnitChoices: any;
  burstBillingChoices: any;
  changeTypeChoices: any;
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
      burstBillingChoices,
    } = this.props;

    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form className="modal-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
          <Divider orientation="left">基础信息</Divider>
          <Row>
            <Col span={12}>
              <FormItem label="合同编号">
                {getFieldDecorator('contract_num', {
                  initialValue: editData ? editData.contract_num : null,
                  rules: [
                    { required: true, message: '请输入合同编号' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="商务实体">
                {getFieldDecorator('business_entity', {
                  initialValue: editData ? editData.business_entity : null,
                  rules: [
                    { required: true, message: '请输入商务实体' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="采购渠道">
                {getFieldDecorator('purchase_channel_id', {
                  initialValue: editData ? editData.purchase_channel_id : null,
                  rules: [
                    { required: true, message: '请输入对端名称' }
                  ],
                })(
                  <Select
                  // style={{ width: 150 }}
                  >
                    {purchaseChannelChoices.map((type: any) => (
                      <Option value={type.value} key={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="服务起始">
                {getFieldDecorator('start_date', {
                  initialValue: editData ? moment(editData.start_date, 'YYYY-MM-DD') : null,
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
                {getFieldDecorator('end_date', {
                  initialValue: editData ? moment(editData.end_date, 'YYYY-MM-DD') : null,
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
              <FormItem label="授权主体" >
                {getFieldDecorator('authorized_subject', {
                  initialValue: editData ? editData.authorized_subject : null,
                  rules: [
                    { required: true, message: '请输入授权主体' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="续约提醒">
                {getFieldDecorator('contract_remind', {
                  initialValue: editData ? editData.contract_remind : null,
                  rules: [
                    // { required: true, message: '请输入续约提醒' }
                  ],
                })(
                  <Input suffix="/天" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="备注" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                {getFieldDecorator('desc', {
                  initialValue: editData ? editData.desc : null,
                  rules: [
                    // { required: true, message: '请输入备注' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Divider orientation="left">费用信息</Divider>
          <Row>
            <Col span={12}>
              <FormItem label="货币单位">
                {getFieldDecorator('monetary_unit_id', {
                  initialValue: editData ? editData.monetary_unit_id : null,
                  rules: [
                    { required: true, message: '请选择货币单位' }
                  ],
                })(
                  <Select
                  // style={{ width: 150 }}
                  >
                    {monetaryUnitChoices.map((type: any) => (
                      <Option value={type.value} key={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="突发计费">
                {getFieldDecorator('burst_billing_id', {
                  initialValue: editData ? editData.burst_billing_id : null,
                  rules: [
                    { required: true, message: '请选择突发计费' }
                  ],
                })(
                  <Select
                  // style={{ width: 150 }}
                  >
                    {burstBillingChoices.map((type: any) => (
                      <Option value={type.value} key={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="承诺月付">
                {getFieldDecorator('committed_fee', {
                  initialValue: editData ? editData.committed_fee : null,
                  rules: [
                    { required: true, message: '请输入承诺月付' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="突发浮动">
                {getFieldDecorator('burst_float', {
                  initialValue: editData ? editData.burst_float : null,
                  rules: [
                    { required: true, message: '请输入突发浮动' }
                  ],
                })(
                  <Input />
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
