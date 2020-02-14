import * as React from 'react';
import { Form, Input, Select, Divider, Row, Col, InputNumber, Icon, Modal, message, Tag } from 'antd';
import { netelementmanager, netelementusermanager, linemanager, IPManage } from 'src/api';
// import NetElementListModal from './NetElementListModal';
import NetElementListModal from 'src/display/components/NetElementSelect';
import DomainListModal from 'src/display/components/DomainSelect';
// import CommonUtils from 'src/utils/commonUtils';
import _ from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  connTypeChoices: any[];
  lineNumTypeChoices: any[];
  blackholesTypeChoices: any[];
  routesNumTypeChoices: any[];
  domainList: any;
  contractList: any[];
  devTypeChoices: any[];
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  userList: any;
  netElementList: any;
  showNetElementListTable: boolean;
  showDomainListTable: boolean;
  currentFieldName: string;
  phyical_ap_id: number | null;
  logic_ap_id: number | null;
  ip: any;
  port: any;
  device_type: any;
  netelementuser_id: any;
  blackholesNumUsable: boolean;
  selectedDomains: any[];
  loading: boolean;
  resourceTypes: any;
  ownerUsable: boolean;
}

/**
 * AddEditModal
 */
class AddEditModal extends React.PureComponent<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
      userList: [],
      netElementList: [],
      showNetElementListTable: false,
      showDomainListTable: false,
      currentFieldName: '',
      phyical_ap_id: null,
      logic_ap_id: null,
      ip: null,
      port: null,
      device_type: null,
      netelementuser_id: null,
      blackholesNumUsable: true,
      selectedDomains: (this.props.editData && this.toArr(this.props.editData.owner, this.props.domainList)) || [],
      loading: false,
      resourceTypes: null,
      ownerUsable: (this.props.editData && this.props.editData.resource_type === 1) ? false : true,
    };
  }

  devTypeChoices = [
    { value: 1, label: 'cisco_ios' },
    { value: 2, label: 'juniper' },
    { value: 3, label: 'huawei' },
  ];

  UNSAFE_componentWillMount() {
    this.getUserList();
    this.getResourceTypes();
    this.getNetElementList();
  }

  /*
   * 去掉垃圾数据并转换成正确的数组形式
   */
  toArr = (owner: any, domainList: any) => {
    console.log(domainList);
    console.log(owner);
    const list: any[] = [];
    if (_.size(owner) > 0) {
      _.forEach(owner, (value, key) => {
        if (_.find(domainList, ['id', parseInt(key, 10)])) {
          list.push(parseInt(key, 10));
        }
      });
    }
    return list;
  }

  /**
   * 获取资源类型
   */
  getResourceTypes = async () => {
    let res = await IPManage.getResourceType({});
    console.log('资源类型列表ResourceType::', res.results);
    if (!res.code) {
      return;
    }
    if (res) {
      this.setState({ resourceTypes: res.results });
    }
  }

  /**
   * 获取网元用户列表
   */
  getUserList = async () => {
    const res = await netelementusermanager.getList({
      page: 1,
      page_size: 1000
    });
    if (res.code) {
      this.setState({
        userList: res.results.data,
      });
    }
  }

  /**
   * 获取网元信息列表
   */
  getNetElementList = async () => {
    const res = await netelementmanager.getList({
      page: 1,
      page_size: 1000
    });
    if (res.code) {
      this.setState({
        netElementList: res.results.data,
      }, () => {
        const { editData, devTypeChoices } = this.props;
        const { netElementList } = this.state;
        if (editData) {
          const netElement = _.find(netElementList, ['id', editData.logic_ap_id]);
          // console.log(netElementList);
          if (netElement) {
            const netElementUserId = netElement.user.id;
            const deviceType = _.find(devTypeChoices, ['value', netElement.device_type_id])?.label;
            this.props.form.setFieldsValue({
              'ip': netElement.ip,
              'port': netElement.port,
              'device_type': deviceType,
              'netelementuser_id': netElementUserId,
            });
          }
        }
      });
    }
  }

  /**
   * 去掉标签
   */
  handleClose = (domainIndex: any) => {
    const selectedDomains = this.state.selectedDomains.filter(val => val !== domainIndex);
    console.log(selectedDomains);
    this.setState({ selectedDomains });
  }

  /**
   * 显示标签
   */
  forMap = (item: any, index: any) => {
    const tagElem = (
      <Tag
        closable={true}
        onClose={(e: any) => {
          e.preventDefault();
          this.handleClose(item);
        }}
      >
        {_.find(this.props.domainList, ['id', item])?.name}
      </Tag>
    );
    console.log(this.props.domainList);
    return (
      <span key={item} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  }

  render() {
    const {
      editData,
      connTypeChoices,
      lineNumTypeChoices,
      contractList,
      blackholesTypeChoices,
      routesNumTypeChoices,
      // devTypeChoices,
    } = this.props;

    // console.log(editData);
    const { getFieldDecorator } = this.props.form;
    const {
      netElementList,
      selectedDomains,
      resourceTypes,
    } = this.state;
    console.log(selectedDomains);
    const tagChild = selectedDomains.map(this.forMap);

    /**
     * 获取合同选项
     */
    const getContractOptions = () => {
      const list: any[] = [];
      if (contractList && contractList.length > 0) {
        contractList.forEach((p: any) => {
          list.push({
            label: p.contract_num,
            value: p.id
          });
        });
      }
      return list;
    };

    /**
     * 获取资源归属选项
     */
    // const getDomainOptions = () => {
    //   const list: any[] = [];
    //   if (domainList && domainList.length > 0) {
    //     domainList.forEach((p: any) => {
    //       list.push({
    //         label: p.name,
    //         value: p.id
    //       });
    //     });
    //   }
    //   return list;
    // };

    /**
     * 获取资源归属选中值
     */
    // const getOwners = (OwnerObj: any) => {
    //   if (_.size(OwnerObj)) {
    //     const list: any[] = [];
    //     _.forEach(OwnerObj, (value, key) => {
    //       list.push(parseInt(key, 10));
    //     });
    //     // console.log(list);
    //     return list;
    //   }
    //   return null;
    // };

    /**
     * 显示网元列表模态窗
     */
    const showNetElementList = (fieldName: string) => {
      this.setState({
        currentFieldName: fieldName,
        showNetElementListTable: true,
      });
    };

    /**
     * 显示网元列表模态窗
     */
    const showDomainListModal = () => {
      this.setState({
        showDomainListTable: true,
      });
    };

    /*
     * 普通路由条目选择变化事件
     */
    const onRouterChange = (value: number) => {
      if (value === 1) {
        this.setState({
          blackholesNumUsable: false,
        });
      } else {
        this.setState({
          blackholesNumUsable: true,
        });
      }
    };

    /*
     * 资源类型选中变化时
     */
    const onResourceTypeChange = (value: number) => {
      this.setState({
        ownerUsable: value === 1 ? false : true,
      });
    };

    /*
     * 自动获取地址按钮触发事件
     */
    const getAddr = async () => {
      if (!this.state.loading) {
        this.props.form.validateFields(['logic_ap_name', 'logic_ap_phyical_port'], async (err: boolean, values: any) => {
          if (!err) {
            this.setState({
              loading: true,
            }, async () => {
              // 取得IP和端口号等
              const { ip, port, device_type, netelementuser_id, logic_ap_phyical_port }
                = this.props.form.getFieldsValue([
                  'ip',
                  'port',
                  'device_type',
                  'netelementuser_id',
                  'logic_ap_phyical_port'
                ]);
              const params = {
                ip,
                port,
                device_type,
                netelementuser_id,
                ap_phyical_port: logic_ap_phyical_port,
              };
              const res = await linemanager.getAddr(params);
              this.setState({
                loading: false,
              }, () => {
                if (!res.code) {
                  message.error(res.msg);
                  return;
                }
                if (res.results) {
                  this.props.form.setFieldsValue({
                    'local_addr': res.results.local_addr,
                    'remote_addr': res.results.remote_addr,
                  });
                  return message.success('获取地址成功!');
                }
                return message.error('获取地址失败!');
              });

            });

          }
        });
      }

    };

    /**
     * 关闭模态窗
     */
    const onCancel = () => {
      this.setState({
        currentFieldName: '',
        showNetElementListTable: false
      });
    };

    /**
     * 资源归属弹窗选中值发生变化时处理
     */
    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      this.setState({
        selectedDomains: selectedRowKeys,
      });
      this.props.form.setFieldsValue({
        owner: selectedRowKeys,
      });
    };

    /**
     * 关闭资源归属模态窗
     */
    const onDomainTableCancel = () => {
      this.setState({
        showDomainListTable: false
      });
    };

    /**
     * 选中网元数据处理
     */
    const onSelect = (record: any) => {
      const fieldName = this.state.currentFieldName;
      if (fieldName === 'phyical_ap_id') {
        this.props.form.setFieldsValue({
          'phyical_ap_name': record.name,
          'phyical_ap_id': record.id
        });
        this.setState({
          phyical_ap_id: record.id,
        });
      } else if (fieldName === 'logic_ap_id') {
        this.props.form.setFieldsValue({
          'logic_ap_name': record.name,
          'logic_ap_id': record.id,
          'ip': record.ip,
          'port': record.port,
          'netelementuser_id': record.user.id,
          'device_type': _.find(this.devTypeChoices, ['value', record.device_type_id])?.label,
        });
      }
      onCancel();
    };

    return (
      <div>
        <Form className="modal-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
          <Row>
            <Col span={12}>
              <FormItem label="互联类型">
                {getFieldDecorator('conn_type_id', {
                  initialValue: editData ? editData.conn_type_id : null,
                  rules: [
                    { required: true, message: '选择互联类型' }
                  ],
                })(
                  <Select
                  // style={{ width: 150 }}
                  >
                    {connTypeChoices.map((type: any) => (
                      <Option value={type.value} key={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="对端名称">
                {getFieldDecorator('opposite_name', {
                  initialValue: editData ? editData.opposite_name : null,
                  rules: [
                    { required: true, message: '请输入对端名称' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <FormItem label="内部链路代号" labelCol={{ span: 13 }} wrapperCol={{ span: 11 }}>
                {getFieldDecorator('line_num_1', {
                  initialValue: editData
                    ? editData.line_num.substring(0, editData.line_num.lastIndexOf('-') + 1)
                    : null,
                  rules: [
                    { required: true, message: '请输入内部链路代号' }
                  ],
                })(
                  <Select
                  // style={{ width: 150 }}
                  >
                    {lineNumTypeChoices.map((type: any) => (
                      <Option value={type.value} key={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem label="" labelCol={{ span: 1 }}>
                {getFieldDecorator('line_num_2', {
                  initialValue: editData
                    ? editData.line_num.substring(editData.line_num.lastIndexOf('-') + 1)
                    : null,
                  rules: [
                    { required: true, message: '请输入内部链路代号' }
                  ],
                })(
                  <Input
                    style={{ width: 100 }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="ASN">
                {getFieldDecorator('asn', {
                  initialValue: editData ? editData.asn : null,
                  rules: [
                    { required: true, message: '请输入ASN' }
                  ],
                })(
                  <InputNumber />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="供应商链路代号" >
                {getFieldDecorator('isp_line_num', {
                  initialValue: editData ? editData.isp_line_num : null,
                  rules: [
                    { required: true, message: '请输入供应商链路代号' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="路由成分">
                {getFieldDecorator('route_ingredient', {
                  initialValue: editData ? editData.route_ingredient : null,
                  rules: [
                    { required: true, message: '请输入路由成分' }
                  ],
                })(
                  <Input
                  // style={{ width: 150 }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="产品类型">
                {getFieldDecorator('product_type', {
                  initialValue: editData ? editData.product_type : null,
                  rules: [
                    { required: true, message: '请输入产品类型' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="合同编号">
                {getFieldDecorator('contract_id', {
                  initialValue: editData ? editData.contract.id : null,
                  rules: [
                    { required: true, message: '请输入合同编号' }
                  ],
                })(
                  <Select
                  // style={{ width: 167 }}
                  >
                    {getContractOptions().map((type: any) => (
                      <Option value={type.value} key={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Divider orientation="left">入网点信息</Divider>
          <Row>
            <Col span={12}>
              <FormItem label="逻辑入网点">
                {getFieldDecorator('logic_ap_name', {
                  initialValue: editData
                    ? _.find(netElementList, ['id', editData.logic_ap_id])?.name
                    : null,
                  rules: [
                    { required: true, message: '请选择逻辑入网点' }
                  ],
                })(
                  <Input
                    disabled={true}
                    placeholder="点击查询选择"
                    addonAfter={<Icon onClick={() => showNetElementList('logic_ap_id')} type="search" />}
                  />
                )}
              </FormItem>
              <FormItem label="逻辑入网点ID" style={{ display: 'none' }}>
                {getFieldDecorator('logic_ap_id', {
                  initialValue: editData
                    ? editData.logic_ap_id
                    : null,
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem label="IP" style={{ display: 'none' }}>
                {getFieldDecorator('ip', {
                  initialValue: null,
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem label="Port" style={{ display: 'none' }}>
                {getFieldDecorator('port', {
                  initialValue: null,
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem label="netelementuser_id" style={{ display: 'none' }}>
                {getFieldDecorator('netelementuser_id', {
                  initialValue: null,
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem label="device_type" style={{ display: 'none' }}>
                {getFieldDecorator('device_type', {
                  initialValue: null,
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="物理入网点">
                {getFieldDecorator('phyical_ap_name', {
                  initialValue: editData
                    ? _.find(netElementList, ['id', editData.phyical_ap_id])?.name
                    : null,
                  rules: [
                    { required: true, message: '请选择物理入网点' }
                  ],
                })(
                  <Input
                    disabled={true}
                    placeholder="点击查询选择"
                    addonAfter={<Icon onClick={() => showNetElementList('phyical_ap_id')} type="search" />}
                  />
                )}
              </FormItem>
              <FormItem label="物理入网点ID" style={{ display: 'none' }}>
                {getFieldDecorator('phyical_ap_id', {
                  initialValue: editData
                    ? editData.phyical_ap_id
                    : null,
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="逻辑入网点接口">
                {getFieldDecorator('logic_ap_phyical_port', {
                  initialValue: editData ? editData.logic_ap_phyical_port : null,
                  rules: [
                    { required: true, message: '请输入逻辑入网点接口' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="物理入网点接口">
                {getFieldDecorator('phyical_ap_phyical_port', {
                  initialValue: editData ? editData.phyical_ap_phyical_port : null,
                  rules: [
                    { required: true, message: '请输入物理入网点接口' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="逻辑入网点端口速率">
                {getFieldDecorator('logic_ap_port_rate', {
                  initialValue: editData ? editData.logic_ap_port_rate : null,
                  rules: [
                    { required: true, message: '请输入逻辑入网点端口速率' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="物理入网点端口速率">
                {getFieldDecorator('phyical_ap_port_rate', {
                  initialValue: editData ? editData.phyical_ap_port_rate : null,
                  rules: [
                    { required: true, message: '请输入物理入网点端口速率' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="本端地址">
                {getFieldDecorator('local_addr', {
                  initialValue: editData ? editData.local_addr : null,
                  rules: [
                    { required: true, message: '请输入本端地址' }
                  ],
                })(
                  <Input
                    disabled={true}
                    placeholder="点击自动获取"
                    addonAfter={<Icon onClick={() => getAddr()} type="fork" />}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="对端地址">
                {getFieldDecorator('remote_addr', {
                  initialValue: editData ? editData.remote_addr : null,
                  rules: [
                    { required: true, message: '请输入对端地址' }
                  ],
                })(
                  <Input
                    disabled={true}
                    placeholder="自动获取"
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Divider orientation="left">带宽及路由</Divider>
          <Row>
            <Col span={12}>
              <FormItem label="黑洞方式">
                {getFieldDecorator('blackholes_type_id', {
                  initialValue: editData ? editData.blackholes_type_id : null,
                  rules: [
                    { required: true, message: '请选择黑洞方式' }
                  ],
                })(
                  <Select
                  // style={{ width: 150 }}
                  >
                    {blackholesTypeChoices.map((type: any) => (
                      <Option value={type.value} key={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="黑洞Community">
                {getFieldDecorator('blackholes_community', {
                  initialValue: editData ? editData.blackholes_community : null,
                  rules: [
                    { required: true, message: '请输入黑洞Community' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="承诺带宽(M)">
                {getFieldDecorator('committed_bw', {
                  initialValue: editData ? editData.committed_bw : null,
                  rules: [
                    { required: true, message: '请输入承诺带宽' }
                  ],
                })(
                  <InputNumber />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="突发带宽(M)">
                {getFieldDecorator('burst_bw', {
                  initialValue: editData ? editData.burst_bw : null,
                  rules: [
                    { required: true, message: '请输入突发带宽' }
                  ],
                })(
                  <InputNumber />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="路由条目">
                {getFieldDecorator('routes_num_type_id', {
                  initialValue: editData ? editData.routes_num_type_id : null,
                  rules: [
                    { required: true, message: '请选择路由条目' }
                  ],
                })(
                  <Select
                    onChange={onRouterChange}
                  >
                    {routesNumTypeChoices.map((type: any) => (
                      <Option value={type.value} key={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="普通路由条目">
                {getFieldDecorator('prefixes_num', {
                  initialValue: editData ? editData.prefixes_num : null,
                  rules: [
                    { required: true, message: '请输入普通路由条目' }
                  ],
                })(
                  <InputNumber />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="黑洞路由条目">
                {getFieldDecorator('blackholes_num', {
                  initialValue: editData ? editData.blackholes_num : null,
                  rules: [
                    // { required: true && this.state.blackholesNumUsable, message: '请输入黑洞路由条目' }
                  ],
                })(
                  <InputNumber disabled={!this.state.blackholesNumUsable} />
                )}
              </FormItem>
            </Col>
          </Row>
          {/* <Row>
            <Col span={12}>
              <FormItem label="资源归属">
                {getFieldDecorator('owner', {
                  initialValue: editData ? getOwners(editData.owner) : null,
                  rules: [
                    { required: true, message: '请选择资源归属' }
                  ],
                })(
                  <Checkbox.Group options={getDomainOptions()} />
                )}
              </FormItem>
            </Col>
          </Row> */}
          <Row>
            <Col span={12}>
              <FormItem label="资源类型">
                {getFieldDecorator('resource_type', {
                  initialValue: editData ? editData.resource_type : null,
                  rules: [
                    { required: true, message: '请选择资源类型' }
                  ],
                })(
                  <Select
                    onChange={onResourceTypeChange}
                  >
                    {resourceTypes
                      && resourceTypes.data.map((type: any) => (
                        <Option value={type.id} key={type.id}>{type.name}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          {this.state.ownerUsable
            &&
            <Row>
              <Col span={24}>
                <FormItem label="资源归属" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('owner', {
                    initialValue: editData ? selectedDomains : null,
                    rules: [
                      { required: true, message: '请选择资源归属' }
                    ],
                  })(
                    <div>
                      {tagChild}
                      <Tag onClick={showDomainListModal} style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <Icon type="search" /> 选择资源归属
                    </Tag>
                    </div>
                  )}
                </FormItem>
              </Col>
            </Row>
          }
        </Form>
        {
          this.state.showNetElementListTable &&
          <Modal
            title="网元信息列表"
            visible={this.state.showNetElementListTable}
            onOk={onCancel}
            maskClosable={false}
            onCancel={onCancel}
            centered={true}
            destroyOnClose={true}
            width={1200}
          >
            {
              <NetElementListModal
                onSelect={onSelect}
              />
            }
          </Modal>
        }
        {
          this.state.showDomainListTable &&
          <Modal
            title="资源归属列表"
            visible={this.state.showDomainListTable}
            onOk={onDomainTableCancel}
            maskClosable={false}
            onCancel={onDomainTableCancel}
            centered={true}
            destroyOnClose={true}
            width={1000}
          >
            {
              <DomainListModal
                selectedDomains={selectedDomains}
                onSelectChange={onSelectChange}
              />
            }
          </Modal>
        }
      </div >
    );
  }
}

export default AddEditModal;
