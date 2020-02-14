import * as React from 'react';
import { IPManage } from 'src/api';
import CurrentPage from 'src/display/components/CurrentPage';
import CommonButton from 'src/display/components/CommonButton';
import OwnerdomainsSelectModal from './OwnerdomainsSelectModal';
import NetElementListModal from 'src/display/components/NetElementSelect';
import { Form, Input, Select, message, Switch, PageHeader, Divider, Row, Button, Icon, Modal, Tag } from 'antd';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { TextArea } = Input;
/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  shareState: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  detail: any;
  showDomainListTable: any;
  showGateWaySelectTable: any;
}

/**
 * Add
 */
class EditFD extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      detail: null,
      showDomainListTable: false,
      showGateWaySelectTable: false,
    };
  }

  UNSAFE_componentWillMount() {
    // 查询数据详情
    this.getDetail();
  }
  // 获取详情
  getDetail = async () => {
    const { detailId, thirddData } = this.props.shareState;
    console.log('thirddData', thirddData);
    let res = await IPManage.getDetail(detailId, {});
    if (!res.code) {
      return;
    }
    if (res) {
      console.log(res.results);
      let data: any = res.results;
      if (data.broadcast_type === 2) { // 多选
        if (data.broadcast_location && data.broadcast_location.length > 0) {
          let list: any = [];
          data.broadcast_location.forEach((v: any) => {
            list.push(this.getCityId(v.city));
          });
          data.broadcastlocation = list;
        }
      } else if (data.broadcast_type === 1 && data.broadcast_location.length > 0) {
        if (data.broadcast_location[0] !== null) {
          data.broadcastlocation = this.getCityId(data.broadcast_location[0].city);
        }
      }
      const { DomainListUnLoginList } = this.props.shareState;
      let ownerDomainsOBJ: any = [];
      if (data.owner_domains && data.owner_domains.length > 0) {
        for (let index = 0; index < data.owner_domains.length; index++) {
          const e = data.owner_domains[index];
          if (DomainListUnLoginList && DomainListUnLoginList.length > 0) {
            for (let index = 0; index < DomainListUnLoginList.length; index++) {
              const v = DomainListUnLoginList[index];
              if (e === v.id) {
                ownerDomainsOBJ.push(v);
              }
            }
          }
        }
      }
      data.owner_domainsOBJ = ownerDomainsOBJ;
      if (data.business_type === 2) { // 多选
        if (data.business_location && data.business_location.length > 0) {
          let list: any = [];
          data.business_location.forEach((v: any) => {
            list.push(this.getCityId(v.city));
          });
          data.businesslocation = list;
          this.setState({ detail: data }, () => {
            this.getAllowOptions();
          });
        }
      } else if (data.business_type === 1 && data.business_location.length > 0) {
        if (data.business_location[0] !== null) {
          data.businesslocation = this.getCityId(data.business_location[0].city);
          this.setState({ detail: data }, () => {
            this.getAllowOptions();
          });
        }
      }
    }
  }
  // 获取city名称对应的ID
  getCityId = (cityName: any) => {
    let id = null;
    const { allCitys } = this.props.shareState;
    if (allCitys && allCitys.length > 0) {
      allCitys.forEach((element: any) => {
        if (element.city === cityName) {
          id = element.id;
        }
      });
    }
    console.log('city对应的ID是', id);
    return id;
  }
  // 广播类型变化
  broadcasttypeChange = (value: any) => {
    let detail = this.state.detail;
    detail.broadcast_type = value;
    this.setState({ detail });
  }
  // 广播地点变化
  broadcastlocationChange = (value: any) => {
    let detail = this.state.detail;
    detail.broadcast_location = value;
    this.setState({ detail }, () => {
      console.log(this.state.detail);
    });
  }
  // 启用状态的变化
  usingChange = (value: any) => {
    let detail = this.state.detail;
    if (value === 'true') {
      detail.using = true;
    }
    if (value === 'false') {
      detail.using = false;
    }
    this.setState({ detail });
  }
  // 入库状态的变化
  storageChange = (value: any) => {
    let detail = this.state.detail;
    if (value === 'true') {
      detail.storage = true;
    }
    if (value === 'false') {
      detail.storage = false;
    }
    this.setState({ detail });
  }
  // 业务类型变化
  businesstypeChange = (value: any) => {
    let detail = this.state.detail;
    detail.business_type = value;
    if (value === 2) {
      detail.gateway_info = [];
      detail.business_location = [];
    } else {
      detail.gateway_info = null;
      detail.business_location = null;
      console.log(detail);
      this.forceUpdate();
    }
    this.setState({ detail }, () => {
      console.log(this.state.detail);
    });
  }
  // 业务地点变化
  businesslocationChange = async (value: any) => {
    console.log(value);
    let detail = this.state.detail;
    detail.business_location = value;
    detail.businesslocation = value;
    detail.gateway_info = null;
    detail.gateway_infoOBJ = null;
    this.setState({ detail }, () => {
      console.log(this.state.detail);
      this.getAllowOptions();
    });
  }
  // 查找当前对象能选择的网关设备(初始化)
  getAllowOptions = async () => {
    let list: any = [];
    if (this.state.detail) {
      let detail = this.state.detail;
      if (detail.business_type === 1) {
        if (detail.businesslocation != null) {
          let Netelements = await this.getNetelement(detail.businesslocation);
          list = Netelements;
        }
      } else if (detail.business_type === 2) {
        if (detail.businesslocation && detail.businesslocation.length > 0) {
          for (let index = 0; index < detail.businesslocation.length; index++) {
            const element = detail.businesslocation[index];
            if (element !== null) {
              let Netelements = await this.getNetelement(element);
              list = list.concat(Netelements);
            }
          }
        }
      }
      detail.DatadictNetelementAllowOptions = list;
      let hasSelectedObj: any = null;
      if (detail.business_type === 1) {
        for (let index = 0; index < detail.DatadictNetelementAllowOptions.length; index++) {
          const element = detail.DatadictNetelementAllowOptions[index];
          if (element.id === detail.gateway_info[0]) {
            hasSelectedObj = element;
          }
        }
      } else if (detail.business_type === 2 && detail.gateway_info && detail.gateway_info.length > 0) {
        for (let index = 0; index < detail.gateway_info.length; index++) {
          const e = detail.gateway_info[index];
          for (let index = 0; index < detail.DatadictNetelementAllowOptions.length; index++) {
            const y = detail.DatadictNetelementAllowOptions[index];
            if (e === y.id) {
              hasSelectedObj.push(y);
            }
          }
        }
      }
      detail.gateway_infoOBJ = hasSelectedObj;
      console.log('找到的可选择网关设备!', list);
      this.setState({ detail }, () => {
        this.forceUpdate();
      });
    }
  }
  // 获取城市对应网关设备
  getNetelement = async (id: any) => {
    console.log(id);
    let res = await IPManage.getNetelement({ city: id });
    console.log('城市对应的网关设备list:', res);
    if (!res.code) {
      return null;
    }
    if (res) {
      return res.results;
    } else {
      return null;
    }
  }
  // 网关设备变化
  gatewayinfoChange = (value: any) => {
    let detail = this.state.detail;
    let idss: any = [];
    if (detail.business_type === 2) {
      idss = value;
    } else {
      idss.push(value);
    }
    detail.gateway_info = { ids: idss };
    this.setState({ detail }, () => {
      console.log(this.state.detail);
    });
  }
  // 编辑提交
  posteditIp = async () => {
    this.props.form.validateFields(['broadcast_location', 'note', 'business_location', 'consistency', 'owner_domains', 'resource_type'], async (err: any, value: any) => {
      if (err) {
        message.error('校验有误!');
        return;
      }
      let detail = this.state.detail;
      detail.note = value.note;
      detail.resource_type = value.resource_type;
      if (detail.broadcast_location) {
        detail.broadcast_location = this.getLocations(detail.broadcastlocation);
      }
      if (detail.business_location) {
        detail.business_location = this.getLocations(detail.businesslocation);
      }
      detail.owner_domains = value.owner_domains;
      detail.consistency = this.consistency();
      let ids: any = [];
      if (typeof (detail.gateway_info) === 'number') {
        ids.push(detail.gateway_info);
      }
      if (typeof (detail.gateway_info) === 'object') {
        ids = detail.gateway_info;
      }
      detail.gateway_info = { ids: ids };
      console.log('参数:', detail);
      let res = await IPManage.editIpSement(detail.id, detail);
      console.log('编辑结果:', res);
      if (!res.code) {
        message.error(res.msg);
        return;
      }
      if (res.code) {
        message.success(res.msg);
        const { moduleAction } = this.props.shareState;
        moduleAction.closeEditHT();
        moduleAction.getList();
        moduleAction.changeexpandedRowKeys([]);
      }
    });
  }
  // 获取广播地点/业务地点提交对象
  getLocations = (id: any) => {
    let locationobj: any;
    let location: any = [];
    if (id) {
      if (typeof (id) === 'number') {
        location.push(this.getNationAndCity(id));
      }
      if (typeof (id) === 'object') {
        if (id.length > 0) {
          id.forEach((y: any) => {
            location.push(this.getNationAndCity(y));
          });
        }
      }
    }
    locationobj = location;
    return locationobj;
  }
  // 获取国家跟城市
  getNationAndCity = (id: any) => {
    let location: any;
    const { nations } = this.props.shareState;
    if (nations && nations.length > 0) {
      nations.forEach((v: any) => {
        if (v.citys && v.citys.length > 0) {
          v.citys.forEach((element: any) => {
            if (element.id === id) {
              let obj = {
                nation: v.nation,
                city: element.city
              };
              location = obj;
            }
          });
        }
      });
    }
    return location;
  }
  // 资源类型变化
  resourceTypeChange = (value: any) => {
    console.log(value);
    let detail = this.state.detail;
    detail.resource_type = value;
    detail.owner_domains = [];
    detail.owner_domainsOBJ = [];
    this.setState({ detail }, () => {
      console.log(this.state.detail);
    });
  }
  // 资源归属变化
  ownerdomainsChange = (selectedRowKeys: any, selectedRows: any) => {
    console.log(selectedRowKeys);
    console.log(selectedRows);
    let v = this.state.detail;
    v.owner_domains = selectedRowKeys;
    v.owner_domainsOBJ = selectedRows;
    this.setState({ detail: v }, () => {
      console.log(this.state.detail);
    });
  }
  // 删除tags
  removeTags = (tagId: any) => {
    let v = this.state.detail;
    v.owner_domains = v.owner_domains.filter((p: any) => p !== tagId);
    v.owner_domainsOBJ = v.owner_domainsOBJ.filter((p: any) => p.id !== tagId);
    this.setState({ detail: v }, () => {
      console.log(this.state.detail);
      this.forceUpdate();
    });
  }
  // 判断一致性
  consistency = () => {
    const { thirddData } = this.props.shareState;
    let flag = false;
    let detail = this.state.detail;
    if (thirddData.broadcast_type === 2) { // 多选
      if (thirddData.broadcast_location && thirddData.broadcast_location.length > 0) {
        let list: any = [];
        thirddData.broadcast_location.forEach((v: any) => {
          list.push(this.getCityId(v.city));
        });
        thirddData.broadcastlocation = list;
      }
    } else if (thirddData.broadcast_type === 1) {
      thirddData.broadcastlocation = this.getCityId(thirddData.broadcast_location[0].city);
    }
    if (detail) {
      if (thirddData.broadcast_type === 1 && thirddData.broadcastlocation) {
        if (detail.businesslocation === thirddData.broadcastlocation) {
          flag = true;
        }
      }
    }
    console.log('一致性', flag);
    return flag;
  }
  showGateWaySelectedModal = () => {
    this.setState({ showGateWaySelectTable: true });
  }

  hideGateWaySelectedModal = () => {
    this.setState({ showGateWaySelectTable: false });
  }
  onGateWaySelect = (selectedRowKeys: any, selectedRows: any) => {
    console.log(selectedRowKeys);
    console.log(selectedRows);
    let detail = this.state.detail;
    if (detail.business_type === 1) { // 单选
      detail.gateway_info = selectedRowKeys.id;
      detail.gateway_infoOBJ = selectedRowKeys;
    }
    if (detail.business_type === 2) { // 多选
      detail.gateway_info = selectedRowKeys;
      detail.gateway_infoOBJ = selectedRows;
    }
    this.setState({ detail }, () => {
      console.log(this.state.detail);
      this.forceUpdate();
    });
    if (detail.business_type !== 2) {
      this.hideGateWaySelectedModal();
    }
  }
  // 删除网元设备tags
  removeGateWayTags = (tagId: any) => {
    let v = this.state.detail;
    if (v.business_type === 2) {
      v.gateway_info = v.gateway_info.filter((p: any) => p !== tagId);
      v.gateway_infoOBJ = v.gateway_infoOBJ.filter((p: any) => p.id !== tagId);
    }
    if (v.business_type === 1) {
      v.gateway_info = null;
      v.gateway_infoOBJ = null;
    }
    this.setState({ detail: v }, () => {
      console.log(this.state.detail);
      this.forceUpdate();
    });
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const { moduleAction, IPType, IPBroadcast, nations, ResourceType } = this.props.shareState;
    let detail = this.state.detail;
    console.log('编辑分段组件接收到的详情数据:', detail);
    let IPtypeoptions: any = [];
    if (IPType && IPType.length > 0) {
      IPType.forEach((e: any) => {
        IPtypeoptions.push(<Option value={e.id} key={e.id} disabled={e.id === 1}>{e.name}</Option>);
      });
    }
    let IPBroadcastoptions: any = [];
    if (IPBroadcast && IPBroadcast.length > 0) {
      IPBroadcast.forEach((e: any) => {
        IPBroadcastoptions.push(<Option value={e.id} key={e.id}>{e.name}</Option>);
      });
    }
    const getOption = (citys: any) => {
      let list: any = [];
      if (citys && citys.length > 0) {
        citys.forEach((z: any) => {
          list.push(
            <Option key={z.city} value={z.id}>{z.city}</Option>
          );
        });
      }
      return list;
    };
    let dataCenterListoptions: any = [];
    if (nations && nations.length > 0) {
      for (let index = 0; index < nations.length; index++) {
        const e = nations[index];
        dataCenterListoptions.push(<OptGroup label={e.nation} key={e.nation}>{getOption(e.citys)}</OptGroup>);
      }
    }
    let ResourceTypeOptions: any = [];
    if (ResourceType && ResourceType.data && ResourceType.data.length > 0) {
      ResourceType.data.forEach((e: any) => {
        ResourceTypeOptions.push(<Option value={e.id} key={e.id}>{e.name}</Option>);
      });
    }
    const getOwnerDomainstag = () => {
      let taglist: any = [];
      let obj = this.state.detail;
      if (obj && obj.owner_domainsOBJ && obj.owner_domainsOBJ.length > 0) {
        for (let index = 0; index < obj.owner_domainsOBJ.length; index++) {
          const element = obj.owner_domainsOBJ[index];
          taglist.push(
            <Tag
              key={element.name}
              closable={true}
              onClose={(e: any) => {
                e.preventDefault();
                this.removeTags(element.id);
              }}
            >
              {element.name}
            </Tag>
          );
        }
      }
      return taglist;
    };
    // 显示网元列表模态窗
    const showDomainListModal = () => {
      this.setState({
        showDomainListTable: true,
      });
    };
    // 关闭资源归属模态窗
    const onDomainTableCancel = () => {
      this.setState({
        showDomainListTable: false,
      });
    };
    const getGateWaytag = () => {
      let taglist: any = [];
      let obj = this.state.detail;
      if (obj && obj.business_type === 2) {
        if (obj && obj.gateway_infoOBJ && obj.gateway_infoOBJ.length > 0) {
          for (let index = 0; index < obj.gateway_infoOBJ.length; index++) {
            const element = obj.gateway_infoOBJ[index];
            taglist.push(
              <Tag
                key={element.name}
                closable={true}
                onClose={(e: any) => {
                  e.preventDefault();
                  this.removeGateWayTags(element.id);
                }}
              >
                {element.name}
              </Tag>
            );
          }
        }
      }
      if (obj && obj.business_type === 1) {
        if (obj && obj.gateway_infoOBJ) {
          taglist.push(
            <Tag
              key={obj.gateway_infoOBJ.name}
              closable={true}
              onClose={(e: any) => {
                e.preventDefault();
                this.removeGateWayTags(obj.gateway_infoOBJ.id);
              }}
            >
              {obj.gateway_infoOBJ.name}
            </Tag>
          );
        }
      }

      return taglist;
    };
    return (
      <div style={{ width: '100%' }}>
        <div className="layout-breadcrumb">
          <div className="page-name">
            <CurrentPage />
          </div>
          <div className="page-button">
            <CommonButton />
            {/* 下面写本页面需要的按钮 */}
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            <PageHeader
              ghost={false}
              onBack={() => moduleAction.closeEditHT()}
              title={detail !== null ? '编辑' + detail.ip + '/' + detail.netmask : ''}
            // subTitle="This is a subtitle"
            >
              <Divider />
              {detail && detail.ip_type !== 4 &&
                <div>
                  <FormItem {...formItemLayout} label="IP类型">
                    {getFieldDecorator('iptype', {
                      initialValue: detail ? detail.ip_type : null,
                      rules: [
                        // { required: true, message: '请填写IP段!' },
                      ],
                    })(
                      <Select
                        style={{ width: 450 }}
                        // onChange={(value: any) => { this.IPTypehandleChange(value, v.name); }}
                        disabled={true}
                      // value={v.iptype}
                      >
                        {IPtypeoptions}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="启用状态" >
                    {getFieldDecorator('using', {
                      initialValue: detail ? detail.using ? 'true' : 'false' : null,
                      rules: [
                        // { required: true, message: '请填写属性标识!' },
                      ],
                    })(
                      <Select style={{ width: 450 }} onChange={(value: any) => { this.usingChange(value); }}>
                        <Option value={'true'}>启用</Option>
                        <Option value={'false'}>未启用</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="入库状态">
                    {getFieldDecorator('storage', {
                      initialValue: detail ? detail.storage ? 'true' : 'false' : null,
                      rules: [
                        // { required: true, message: '请填写属性标识!' },
                      ],
                    })(
                      <Select style={{ width: 450 }} onChange={(value: any) => { this.storageChange(value); }}>
                        <Option value={'true'}>已入库</Option>
                        <Option value={'false'}>未入库</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="广播类型">
                    {getFieldDecorator('broadcast_type', {
                      initialValue: detail ? detail.broadcast_type : null,
                      rules: [
                        // { required: true, message: '请填写属性标识!' },
                      ],
                    })(
                      <Select style={{ width: 450 }} onChange={(value: any) => { this.broadcasttypeChange(value); }} >
                        {IPBroadcastoptions}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="广播地点">
                    {getFieldDecorator('broadcast_location', {
                      initialValue: (detail && detail.broadcastlocation !== null) ? detail.broadcastlocation : null,
                      rules: [
                        // { required: true, message: '请填写属性标识!' },
                      ],
                    })(
                      <Select style={{ width: 450 }} onChange={(value: any) => { this.broadcastlocationChange(value); }} mode={(detail && detail.broadcast_type === 2) ? 'multiple' : 'default'} >
                        {dataCenterListoptions}
                      </Select>
                    )}
                  </FormItem>
                </div>
              }
              <FormItem {...formItemLayout} label="业务类型">
                {getFieldDecorator('business_type', {
                  initialValue: detail ? detail.business_type : null,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Select style={{ width: 450 }} onChange={(value: any) => { this.businesstypeChange(value); }} disabled={true}>
                    {IPBroadcastoptions}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="业务地点">
                {getFieldDecorator('business_location', {
                  initialValue: detail ? detail.businesslocation : null,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Select style={{ width: 450 }} onChange={(value: any) => { this.businesslocationChange(value); }} mode={(detail && detail.business_type === 2) ? 'multiple' : 'default'}>
                    {dataCenterListoptions}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="网关设备">
                {getFieldDecorator('gateway_info', {
                  initialValue: (detail && detail.gateway_info) ? detail.gateway_info.ids : null,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <div>
                    {getGateWaytag()}
                    <Tag onClick={() => this.showGateWaySelectedModal()} style={{ background: '#fff', borderStyle: 'dashed' }}>
                      <Icon type="search" /> 选择网关设备
                  </Tag>
                  </div>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="备注">
                {getFieldDecorator('note', {
                  initialValue: detail ? detail.note : null,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <TextArea
                    placeholder="请输入备注"
                    autoSize={true}
                    style={{ width: 450 }}
                  // onChange={(e: any) => { this.noteChange(e, v.name); }}
                  // value={v.note}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="一致性">
                {getFieldDecorator('consistency', {
                  // initialValue: detail.consistency,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Switch
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    defaultChecked={false}
                    disabled={true}
                    // checked={(detail && (detail.business_location && detail.broadcast_location)) && detail.business_location.toString() === thirddData.broadcast_location.toString() ? true : false}
                    checked={this.consistency()}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="资源类型">
                {getFieldDecorator(`resource_type`, {
                  initialValue: detail ? detail.resource_type : null,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Select style={{ width: 450 }} onChange={(value: any) => { this.resourceTypeChange(value); }}>
                    {ResourceTypeOptions}
                  </Select>
                )}
              </FormItem>
              {detail && detail.resource_type !== 1 && detail.resource_type !== null &&
                <FormItem {...formItemLayout} label="资源归属">
                  {getFieldDecorator('owner_domains', {
                    initialValue: detail ? detail.owner_domains : [],
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <div>
                      {getOwnerDomainstag()}
                      <Tag onClick={() => showDomainListModal()} style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <Icon type="search" /> 选择资源归属
                     </Tag>
                    </div>
                  )}
                </FormItem>
              }
              <Divider />
              <Row style={{ textAlign: 'center' }}>
                <Button onClick={() => moduleAction.closeEditHT()} >取消</Button>&nbsp;&nbsp;
                <Button type="primary" onClick={() => { this.posteditIp(); }} >提交</Button>
              </Row>
            </PageHeader>
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
                <OwnerdomainsSelectModal
                  resourceType={this.state.detail.resource_type}
                  onSelectChange={this.ownerdomainsChange}
                  hasSelected={this.state.detail.owner_domains}
                />
              </Modal>
            }
            {
              this.state.showGateWaySelectTable &&
              <Modal
                title="网关设备信息列表"
                visible={this.state.showGateWaySelectTable}
                onOk={this.hideGateWaySelectedModal}
                maskClosable={false}
                onCancel={this.hideGateWaySelectedModal}
                centered={true}
                destroyOnClose={true}
                width={1200}
              >
                {
                  <NetElementListModal
                    onSelect={this.onGateWaySelect}
                    multiple={this.state.detail.business_type === 2 ? true : false}
                    city={this.state.detail.broadcastlocation}
                    selectedRowKeys={this.state.detail.gateway_info}
                  />
                }
              </Modal>
            }
          </div>
        </div>
      </div >
    );
  }
}

export default EditFD;