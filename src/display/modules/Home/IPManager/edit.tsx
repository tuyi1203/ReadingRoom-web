import * as React from 'react';
import { IPManage } from 'src/api';
import CurrentPage from 'src/display/components/CurrentPage';
import CommonButton from 'src/display/components/CommonButton';
import OwnerdomainsSelectModal from './OwnerdomainsSelectModal';
import { Form, Input, Select, message, PageHeader, Divider, Button, Row, Tag, Icon, Modal } from 'antd';
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
}

/**
 * Add
 */
class Edit extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      detail: null,
      showDomainListTable: false,
    };
  }

  UNSAFE_componentWillMount() {
    // 查询数据详情
    this.getDetail();
  }
  // 获取详情
  getDetail = async () => {
    const { detailId } = this.props.shareState;
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
      this.setState({ detail: data });
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
    if (value === 2) {
      detail.broadcast_location = [];
      detail.broadcastlocation = [];
    } else {
      detail.broadcast_location = null;
      detail.broadcastlocation = null;
    }
    this.setState({ detail });
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
  // 编辑提交
  posteditIp = async () => {
    this.props.form.validateFields(['broadcast_location', 'note', 'owner_domains', 'ip', 'netmask', 'resource_type'], async (err: any, value: any) => {
      if (err) {
        message.error('校验有误!');
        return;
      }
      let detail = this.state.detail;
      detail.note = value.note;
      detail.ip = value.ip;
      detail.netmask = value.netmask;
      detail.resource_type = value.resource_type;
      if (detail.broadcast_location) {
        detail.broadcast_location = this.getLocations(value.broadcast_location);
      }
      detail.owner_domains = value.owner_domains;
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
    const { moduleAction, IPType, IPBroadcast, nations, DomainListUnLoginList, ResourceType } = this.props.shareState;
    let detail = this.state.detail;
    console.log('编辑合同组件接收到的详情数据:', detail);
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
    let DomainListUnLoginListoptions: any = [];
    if (DomainListUnLoginList && DomainListUnLoginList.length > 0) {
      DomainListUnLoginList.forEach((e: any) => {
        DomainListUnLoginListoptions.push(<Option value={e.id} key={e.id}>{e.name}</Option>);
      });
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
    /**
     * 显示网元列表模态窗
     */
    const showDomainListModal = () => {
      this.setState({
        showDomainListTable: true,
      });
    };
    /**
     * 关闭资源归属模态窗
     */
    const onDomainTableCancel = () => {
      this.setState({
        showDomainListTable: false,
      });
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
              <FormItem {...formItemLayout} label="IP" >
                {getFieldDecorator('ip', {
                  initialValue: detail ? detail.ip : '',
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Input style={{ width: 450 }} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="掩码" >
                {getFieldDecorator('netmask', {
                  initialValue: detail ? detail.netmask : '',
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Input style={{ width: 450 }} />
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
                  <Select style={{ width: 450 }} mode={(detail && detail.broadcast_type === 2) ? 'multiple' : 'default'} >
                    {dataCenterListoptions}
                  </Select>
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
                  />
                )}
              </FormItem>
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
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;