import * as React from 'react';
import AttachDrawer from './attachDrawer';
import Urls from 'src/config/Urls';
import { IPManage } from 'src/api';
import { Table, Divider, Popconfirm, Modal, message, Drawer, Row, Col, Form, DatePicker, Input, Button } from 'antd';
import AddResoruce from './addResoruce';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
moment.locale('zh-cn');
const FormItem = Form.Item;
/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  shareState: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  list: any;
  showAttachDrawer: boolean;
  FJdata: any;
  edit: boolean;
  xy: boolean;
  HTcode: boolean;
  editData: any;
}

const uploadAttachUrl = window.$$_web_env.apiDomain + Urls.fileUpload;
const dir = 'ipmanager';
/**
 * Add
 */
class Resource extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      list: null,
      showAttachDrawer: false,
      FJdata: null,
      edit: false,
      xy: false,
      HTcode: false,
      editData: null,
    };
  }

  // UNSAFE_componentWillMount() {
  // }

  // 打开附件
  openFJ = (record: any) => {
    this.setState({ showAttachDrawer: true, FJdata: record });
  }
  // 关闭附件
  closeFJ = (record: any) => {
    this.setState({ showAttachDrawer: false, FJdata: null });
  }
  // 编辑
  openEdit = (record: any) => {
    this.setState({ editData: record, edit: true });
  }
  // 编辑
  closeEdit = () => {
    this.setState({ editData: null, edit: false });
  }
  // 编辑合同
  editHT = () => {
    this.props.form.validateFields(['contract_code', 'business_instance', 'resource_type',
      'authorization_instance', 'current_start_date', 'current_end_date', 'remind', 'note',
      'monetary_unit', 'monthly_payment'], async (err: boolean, values: any) => {
        console.log(values);
        if (err) {
          message.warning('校验有误!');
          return;
        }
        let param = {
          id: this.state.editData.id,
          contract_code: values.contract_code,
          business_instance: values.business_instance,
          resource_type: values.resource_type,
          authorization_instance: values.authorization_instance,
          current_start_date: moment(values.current_start_date).format('YYYY-MM-DD'),
          current_end_date: moment(values.current_end_date).format('YYYY-MM-DD'),
          remind: values.remind,
          note: values.note,
          monetary_unit: values.monetary_unit,
          monthly_payment: values.monthly_payment,
        };
        let res = await IPManage.putIpmanageContracts(this.state.editData.id, param);
        if (!res.code) {
          message.error(res.msg);
          return;
        }
        if (res.code) {
          const { moduleAction } = this.props.shareState;
          moduleAction.getHTlist();
          message.success('编辑成功!');
          this.closeEdit();
        }
      });
  }
  // 新建后组装附件boj数据
  changeFjdata = (newFJ: any) => {
    let FJdata = this.state.FJdata;
    FJdata.attaches.push(newFJ);
    this.setState({ FJdata }, () => {
      console.log(this.state.FJdata);
    });
  }
  // 新建后组装附件boj数据
  deleteFjdata = (uuuid: any) => {
    let FJdata = this.state.FJdata;
    let attaches = FJdata.attaches;
    let newattaches = attaches.filter((v: any) => {
      if (v.uuid !== uuuid) {
        return v;
      }
    });
    FJdata.attaches = newattaches;
    this.setState({ FJdata }, () => {
      console.log(this.state.FJdata);
    });
  }
  // 打开合同编号
  openHTcode = (record: any) => {
    console.log('编辑对象', record);
    this.setState({ editData: record, HTcode: true });
  }
  // 关闭合同编号
  closeHTcode = () => {
    this.setState({ editData: null, HTcode: false });
  }
  // 删除
  deleteContracts = async (id: any) => {
    let res = await IPManage.deleteContracts(id, {});
    if (res.code) {
      message.success('删除成功!');
      const { moduleAction } = this.props.shareState;
      moduleAction.getHTlist();
    }
    if (!res.code) {
      message.error(res.msg);
      return;
    }
  }
  // 续约
  openxy = (record: any) => {
    this.setState({ editData: record, xy: true });
  }
  // 关闭续约
  closexy = () => {
    this.setState({ editData: null, xy: false });
  }
  xycommit = () => {
    this.props.form.validateFields(['new_start_date', 'new_end_date'], async (err: boolean, values: any) => {
      if (err) {
        message.warning('校验有误!');
        return;
      }
      let editData = this.state.editData;
      editData.new_start_date = moment(values.new_start_date).format('YYYY-MM-DD');
      editData.new_end_date = moment(values.new_end_date).format('YYYY-MM-DD');
      let res = await IPManage.putIpmanageContracts(this.state.editData.id, editData);
      if (!res.code) {
        message.error(res.msg);
        return;
      }
      if (res.code) {
        const { moduleAction } = this.props.shareState;
        moduleAction.getHTlist();
        message.success('合同续约成功!');
        this.closexy();
      }
    });
  }
  // 查询
  serchResource = () => {
    this.props.form.validateFields(['contract_code_serch', 'business_instance_serch', 'authorization_instance_serch'], async (err: boolean, values: any) => {
      console.log(values);
      let param: {
        contract_code__icontains?: any;
        business_instance__icontains?: any;
        authorization_instance__icontains?: any;
      } = {};
      if (values.contract_code_serch) {
        param.contract_code__icontains = values.contract_code_serch;
      }
      if (values.business_instance_serch) {
        param.business_instance__icontains = values.business_instance_serch;
      }
      if (values.authorization_instance_serch) {
        param.authorization_instance__icontains = values.authorization_instance_serch;
      }
      const { moduleAction } = this.props.shareState;
      moduleAction.getHTlist(param);
    });
  }
  render() {
    const { HTlist, ContractTypes, ContractUnits } = this.props.shareState;
    const { editData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const column = [
      {
        title: '合同编号',
        key: 'contract_code',
        dataIndex: 'contract_code',
        width: 150,
        render: (text: any, record: any) => {
          return (<span><a onClick={() => { this.openHTcode(record); }}>{text}</a></span >);
        }
      },
      {
        title: '商务实体',
        key: 'business_instance',
        dataIndex: 'business_instance',
        width: 150,
      },
      {
        title: '授权主体',
        key: 'authorization_instance',
        dataIndex: 'authorization_instance',
        width: 150,
      },
      {
        title: '服务起始',
        key: 'current_start_date',
        dataIndex: 'current_start_date',
        width: 100,
      },
      {
        title: '服务结束',
        key: 'current_end_date',
        dataIndex: 'current_end_date',
        width: 100,
      },
      {
        title: '合同附件',
        key: 'attaches',
        dataIndex: 'attaches',
        width: 100,
        render: (text: any, record: any) => {
          return (
            <span>
              <a onClick={() => { this.openFJ(record); }}>
                打开附件
              </a>
            </span>
          );
        }
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <div>
              <a type="primary" onClick={() => { this.openEdit(record); }}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确认删除吗?" onConfirm={() => this.deleteContracts(record.id)}>
                <a type="danger" >删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a type="primary" onClick={() => { this.openxy(record); }}>合同续约</a>
            </div>
          );
        }
      },
    ];
    const pStyle = {
      fontSize: 16,
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: 16,
    };
    // 获取货币单位名称
    const getunit = (id: any) => {
      let names: any = '';
      if (ContractUnits && ContractUnits.length > 0) {
        ContractUnits.forEach((v: any) => {
          if (v.id === id) {
            names = v.name;
          }
        });
      }
      return names;
    };
    // 获取type名称
    const getype = (id: any) => {
      let names: any = '';
      if (ContractTypes && ContractTypes.length > 0) {
        ContractTypes.forEach((v: any) => {
          if (v.id === id) {
            names = v.name;
          }
        });
      }
      return names;
    };
    // 获取关联的IP
    const getcontractIp = () => {
      let ips: any = [];
      let editData = this.state.editData;
      if (editData && editData.contract_ip && editData.contract_ip.length > 0) {
        for (let index = 0; index < editData.contract_ip.length; index++) {
          const element = editData.contract_ip[index];
          ips.push(<Col key={index} style={{ marginTop: '2%' }} span={10}>{element.ip + '/' + element.netmask}</Col>);
        }
      }
      return ips;
    };
    const columnHTCODE = [
      {
        title: '变更时间',
        key: 'modify_date',
        dataIndex: 'modify_date',
        width: 200,
      },
      {
        title: '行为',
        key: 'modify_type',
        dataIndex: 'modify_type',
        width: 200,
      },
      {
        title: '变更前',
        key: 'modify_before',
        dataIndex: 'modify_before',
        width: 200,
      },
      {
        title: '变更后',
        key: 'modify_after',
        dataIndex: 'modify_after',
        width: 200,
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };
    return (
      <div>
        <Row>
          <Form layout="inline">
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label="合同编号"
              >
                {getFieldDecorator('contract_code_serch', {
                  rules: [],
                })(
                  <Input placeholder="请输入合同编号查询" allowClear={true} style={{ width: 200 }} />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              {/* IPBroadcast */}
              <FormItem
                {...formItemLayout}
                label="商务实体"
              >
                {getFieldDecorator('business_instance_serch', {
                  rules: [],
                })(
                  <Input placeholder="请输入商务实体查询" allowClear={true} style={{ width: 200 }} />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label="授权主体"
              >
                {getFieldDecorator('authorization_instance_serch', {
                  rules: [],
                })(
                  <Input placeholder="请输入授权主体查询" allowClear={true} style={{ width: 200 }} />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                <Button icon="search" onClick={this.serchResource} >查询</Button>
              </FormItem>
            </Col>
          </Form>
        </Row>
        <br />
        <Table
          columns={column}
          // rowKey={record => record.id}
          rowKey="id"
          dataSource={HTlist}
          bordered={true}
          // scroll={{ y: 2400 }}
          pagination={false}
        />
        {
          this.state.showAttachDrawer &&
          <AttachDrawer
            drawerData={this.state.FJdata}
            onClose={this.closeFJ}
            visible={this.state.showAttachDrawer}
            action={uploadAttachUrl}
            dir={dir}
            changeFjdata={this.changeFjdata}
            deleteFjdata={this.deleteFjdata}
          />
        }
        {
          this.state.edit &&
          <Modal
            title="编辑"
            visible={this.state.edit}
            onOk={this.editHT}
            maskClosable={false}
            onCancel={this.closeEdit}
            centered={true}
            destroyOnClose={true}
            width={800}
          >
            <AddResoruce
              form={this.props.form}
              editData={this.state.editData}
              purchaseChannelChoices={ContractTypes}
              monetaryUnitChoices={ContractUnits}
            />
          </Modal>
        }
        {
          this.state.HTcode &&
          <Drawer
            width={640}
            placement="right"
            closable={true}
            onClose={this.closeHTcode}
            visible={this.state.HTcode}
          >
            <p style={{ ...pStyle, marginBottom: 24 }}>合同编号：{this.state.editData && this.state.editData.contract_code}</p>
            <Divider orientation="left">基础信息</Divider>
            <Row><Col span={6}>商务实体：</Col><Col span={18}>{this.state.editData && this.state.editData.business_instance}</Col></Row><br />
            <Row><Col span={6}>资源类型：</Col><Col span={18}>{(this.state.editData && this.state.editData.resource_type) ? getype(this.state.editData.resource_type) : ''}</Col></Row><br />
            <Row><Col span={6}>授权主体：</Col><Col span={18}>{this.state.editData && this.state.editData.authorization_instance}</Col></Row><br />
            <Row><Col span={6}>服务起始：</Col><Col span={18}>{this.state.editData && this.state.editData.current_start_date}</Col></Row><br />
            <Row><Col span={6}>服务结束：</Col><Col span={18}>{this.state.editData && this.state.editData.current_end_date}</Col></Row><br />
            <Row><Col span={6}>续约提醒：</Col><Col span={18}>{this.state.editData && this.state.editData.remind}</Col></Row><br />
            <Row><Col span={6}>备注：</Col><Col span={18}>{this.state.editData && this.state.editData.note}</Col></Row><br />
            <Divider orientation="left">费用信息</Divider>
            <Row><Col span={6}>合同月付：</Col><Col span={18}>{this.state.editData && this.state.editData.monthly_payment}</Col></Row><br />
            <Row><Col span={6}>货币单位：</Col><Col span={18}>{(this.state.editData && this.state.editData.monetary_unit) ? getunit(this.state.editData.monetary_unit) : ''}</Col></Row><br />
            <Divider orientation="left">关联IP</Divider>
            <Row style={{ marginBottom: 12 }}>
              {(this.state.editData && this.state.editData.contract_ip) ? getcontractIp() : ''}
            </Row>
            <Divider orientation="left">资源历史</Divider>
            <Row style={{ marginBottom: 12 }}>
              <Col span={24}>
                <Table
                  columns={columnHTCODE}
                  rowKey="id"
                  dataSource={(this.state.editData && this.state.editData.modify) || []}
                  bordered={true}
                />
              </Col>
            </Row>
          </Drawer>
        }
        {
          this.state.xy &&
          <Modal
            title="合同续约"
            visible={this.state.xy}
            onOk={this.xycommit}
            maskClosable={false}
            onCancel={this.closexy}
            centered={true}
            destroyOnClose={true}
            width={800}
          >
            <Form className="modal-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              <Divider orientation="left">合同编号：{editData && editData.contract_code}</Divider>
              <Row>
                <Col span={12}>
                  <FormItem label="当前服务起始">
                    {getFieldDecorator('start_date', {
                      initialValue: editData ? editData.current_start_date : null,
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
                      initialValue: editData ? editData.current_end_date : null,
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
                    {getFieldDecorator('new_start_date', {
                      initialValue: (editData && editData.current_start_date)
                        ? moment(editData.current_start_date, 'YYYY-MM-DD')
                        : null,
                      rules: [
                        { required: true, message: '请选择服务起始' }
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
                    {getFieldDecorator('new_end_date', {
                      initialValue: (editData && editData.current_end_date)
                        ? moment(editData.current_end_date, 'YYYY-MM-DD')
                        : null,
                      rules: [
                        { required: true, message: '请选择服务结束' }
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
          </Modal>
        }
      </div>
    );
  }
}

export default Resource;