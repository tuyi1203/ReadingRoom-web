import * as React from 'react';
import { IPManage } from 'src/api';
import CurrentPage from 'src/display/components/CurrentPage';
import CommonButton from 'src/display/components/CommonButton';
import OwnerdomainsSelectModal from './OwnerdomainsSelectModal';
import NetElementListModal from 'src/display/components/NetElementSelect';
import { Form, Input, Select, message, Switch, Tabs, Icon, Divider, PageHeader, Button, Row, Modal, Tag } from 'antd';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  shareState: any;

}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  detail: any;
  listThree: any;
  showDomainListTable: any;
  showDomainListTableChild: any;
  currentChild: any;
  showGateWaySelectTable: any;
  currentGateWayObj: any;
}

/**
 * Add
 */
class EditZY extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      detail: null,
      listThree: null,
      showDomainListTable: false,
      showDomainListTableChild: false,
      currentChild: {},
      showGateWaySelectTable: false,
      currentGateWayObj: null,
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
      this.setState({ detail: data }, () => {
        this.getChiildListThree(this.state.detail.id);
      });
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
  /**
   * 获取IPV4三级子IP
   */
  getChiildListThree = async (id: string) => {
    let res = await IPManage.getChildSegmentipsList(id, {});
    if (!res.code) {
      return;
    }
    if (res) {
      // console.log(res.results.data);
      const { DomainListUnLoginList } = this.props.shareState;
      let data: any = res.results.data;
      if (data && data.length > 0) {
        data.forEach(async (v: any) => {
          v.businesslocation = null;
          v.DatadictNetelementAllowOptions = await this.getAllowOptions(v);
          let hasSelectedObj: any = null;
          if (v.business_type === 1) {
            for (let index = 0; index < v.DatadictNetelementAllowOptions.length; index++) {
              const element = v.DatadictNetelementAllowOptions[index];
              if (element.id === v.gateway_info[0]) {
                hasSelectedObj = element;
              }
            }
          } else if (v.business_type === 2 && v.gateway_info && v.gateway_info.length > 0) {
            for (let index = 0; index < v.gateway_info.length; index++) {
              const e = v.gateway_info[index];
              for (let index = 0; index < v.DatadictNetelementAllowOptions.length; index++) {
                const y = v.DatadictNetelementAllowOptions[index];
                if (e === y.id) {
                  hasSelectedObj.push(y);
                }
              }
            }
          }
          v.gateway_infoOBJ = hasSelectedObj;
          let ownerDomainsOBJ: any = [];
          if (v.owner_domains && v.owner_domains.length > 0) {
            for (let index = 0; index < v.owner_domains.length; index++) {
              const e = v.owner_domains[index];
              if (DomainListUnLoginList && DomainListUnLoginList.length > 0) {
                for (let index = 0; index < DomainListUnLoginList.length; index++) {
                  const y = DomainListUnLoginList[index];
                  if (e === y.id) {
                    ownerDomainsOBJ.push(y);
                  }
                }
              }
            }
          }
          v.owner_domainsOBJ = ownerDomainsOBJ;
        });
      }
      console.log('IPv4三级列表lists::', data);
      this.setState({ listThree: data });
    }
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
  // 广播地点变化
  broadcastlocationChange = (value: any) => {
    let detail = this.state.detail;
    detail.broadcast_location = value;
    detail.broadcastlocation = value;
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
  // 查找对应的子IP对象
  getChildObj = (ip: any) => {
    let listThree = this.state.listThree;
    if (listThree && listThree.length > 0) {
      listThree.forEach((v: any) => {
        if (v.ip === ip) {
          return v;
        }
      });
    }
    return null;
  }
  // 子 业务地点变化
  businesslocationChangeChild = async (value: any, ip: any) => {
    let listThree = this.state.listThree;
    if (listThree && listThree.length > 0) {
      for (let index = 0; index < listThree.length; index++) {
        const v = listThree[index];
        if (v.ipfenge === ip) {
          v.business_location = value;
          v.businesslocation = value;
          let Netelements = await this.getNetelement(value);
          let list = Netelements;
          v.DatadictNetelementAllowOptions = list;
          v.consistency = this.consistency(ip);
        }
      }
    }
    this.setState({ listThree }, () => {
      this.forceUpdate();
    });
  }
  // 判断一致性
  consistency = (ip: any) => {
    let flag = false;
    let listThree = this.state.listThree;
    let detail = this.state.detail;
    if (listThree && listThree.length > 0) {
      for (let index = 0; index < listThree.length; index++) {
        const v = listThree[index];
        if (v.ipfenge === ip) {
          if (detail.broadcast_type === 1) {
            if (detail.broadcastlocation === v.businesslocation) {
              flag = true;
            }
          }
        }
      }
    }
    console.log('一致性', flag);
    return flag;
  }
  // 获取城市对应网关设备
  getNetelement = async (id: any) => {
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
  // 子  网关设备变化
  gatewayinfoChangeChild = (value: any, ip: any) => {
    let listThree = this.state.listThree;

    if (listThree && listThree.length > 0) {
      listThree.forEach((v: any) => {
        if (v.ipfenge === ip) {
          let idss: any = [];
          idss.push(value);
          v.gateway_info = { ids: idss };
        }
      });
    }
    this.setState({ listThree }, () => {
      console.log(this.state.listThree);
    });
  }
  noteChildChange = (e: any, ip: any) => {
    let listThree = this.state.listThree;
    console.log(e.target.value);
    console.log(ip);
    if (listThree && listThree.length > 0) {
      listThree.forEach((v: any) => {
        if (v.ipfenge === ip) {
          v.note = e.target.value;
          console.log(v);
        }
      });
    }
    this.setState({ listThree }, () => {
      console.log(this.state.listThree);
    });
  }
  // 资源归属变化 子
  ownerdomainsChildChange = (value: any, ip: any) => {
    let listThree = this.state.listThree;
    if (listThree && listThree.length > 0) {
      listThree.forEach((v: any) => {
        if (v.ipfenge === ip) {
          v.owner_domains = value;
        }
      });
    }
    this.setState({ listThree }, () => {
      console.log(this.state.listThree);
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
      detail.owner_domains = value.owner_domains;
      if (detail.broadcastlocation) {
        detail.broadcast_location = this.getLocations(detail.broadcastlocation);
      }
      let childs = this.getChilList();
      detail.segment_ips = childs;
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
  // 组装子IPlist
  getChilList = () => {
    let listThree = this.state.listThree;
    let detail = this.state.detail;
    listThree.forEach((v: any) => {
      if (v.businesslocation) {
        v.business_location = this.getLocations(v.businesslocation);
      }
      detail.consistency = this.consistency(v.ipfenge);
    });
    return listThree;
  }

  // IP分隔变化
  ipfengeChange = (e: any) => {
    let detail = this.state.detail;
    detail.ipfenge = e.target.value;
    this.setState({ detail }, () => {
      console.log(this.state.detail);
    });
  }
  // 生成2
  postIpsSplit2 = async () => {
    let detail = this.state.detail;
    let flag = false;
    this.state.listThree.forEach((v: any) => {
      let ip = v.ip + '/' + v.netmask;
      if (ip === detail.ipfenge) {
        flag = true;
        return;
      }
    });
    if (flag) {
      message.error('重复分割!');
      return;
    }
    let param = {
      parent: detail.ip + '/' + detail.netmask,
      child: detail.ipfenge
    };
    let res = await IPManage.postIpsSplit2(param);
    if (!res.code) {
      message.error(res.msg);
      return;
    }
    if (res.code) {
      message.success(res.msg);
      let listThree = this.state.listThree;
      let obj = {
        ip_type: 4,
        using: null,
        storage: null,
        broadcast_type: null,
        broadcast_location: null,
        business_type: 1,
        business_location: null,
        gateway_info: null,
        gateway_infoOBJ: null,
        note: null,
        consistency: false,
        resource_type: null,
        owner_domains: [],
        owner_domainsOBJ: [],
        ipfenge: detail.ipfenge,
        parent: detail.contract_ip.ip + '/' + detail.contract_ip.netmask,
        delete: 'no',
        ip: detail.ipfenge.split('/')[0],
        netmask: detail.ipfenge.split('/')[1],
      };
      listThree.push(obj);
      this.setState({ listThree }, () => {
        this.forceUpdate();
        console.log('分割生成结果:', this.state.listThree);
      });
    }
  }
  // 子IP删除
  deleteChildIP = async (record: any) => {
    if (record.delete && record.delete === 'no') {
      // message.error('当前分割的IP不能删除!');
      console.log(record);
      let listThree = this.state.listThree;
      let newlistThree: any = listThree.filter((v: any) => {
        if (v.ipfenge !== record.ipfenge) {
          return v;
        }
      });
      this.setState({ listThree: newlistThree });
      return;
    } else {
      // message.error('可以删除!');
      let res = await IPManage.deleteIpSement(record.id, {});
      if (res.code) {
        let newlistThree: any = [];
        let listThree = this.state.listThree;
        if (listThree && listThree.length > 0) {
          listThree.forEach((v: any) => {
            if (!v.id) {
              newlistThree.push(v);
            }
            if (v.id && v.id !== record.id) {
              newlistThree.push(v);
            }
          });
        }
        this.setState({ listThree: newlistThree });
        message.success('删除成功!');
        this.forceUpdate();
      } else {
        message.error(res.results);
      }
    }
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
  // 资源归属变化
  ownerdomainsChangeChild = (selectedRowKeys: any, selectedRows: any) => {
    console.log(selectedRowKeys);
    console.log(selectedRows);
    let listThree = this.state.listThree;
    if (listThree && listThree.length > 0) {
      for (let index = 0; index < listThree.length; index++) {
        const v = listThree[index];
        if (v.ipfenge === this.state.currentChild.ipfenge) {
          console.log(v);
          v.owner_domains = selectedRowKeys;
          v.owner_domainsOBJ = selectedRows;
        }
      }
    }
    this.setState({ listThree }, () => {
      console.log(this.state.listThree);
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
  // 删除tags
  removeTagsChild = (tagId: any, ip: any) => {
    let listThree = this.state.listThree;
    if (listThree && listThree.length > 0) {
      for (let index = 0; index < listThree.length; index++) {
        const v = listThree[index];
        if (v.ipfenge === ip) {
          console.log(v.ipfenge);
          v.owner_domains = v.owner_domains.filter((p: any) => p !== tagId);
          v.owner_domainsOBJ = v.owner_domainsOBJ.filter((p: any) => p.id !== tagId);
        }
      }
    }
    this.setState({ listThree }, () => {
      console.log('资源类型变化', this.state.listThree);
      this.forceUpdate();
    });
  }
  // 资源类型变化child
  resourceTypeChangechild = (value: any, ip: any) => {
    let listThree = this.state.listThree;
    if (listThree && listThree.length > 0) {
      for (let index = 0; index < listThree.length; index++) {
        const v = listThree[index];
        if (v.ipfenge === ip) {
          console.log(v.ipfenge);
          v.resource_type = value;
          v.owner_domains = [];
        }
      }
    }
    this.setState({ listThree }, () => {
      console.log('资源类型变化', this.state.listThree);
      this.forceUpdate();
    });
  }
  // 查找当前对象能选择的网关设备(初始化)
  getAllowOptions = async (detail: any) => {
    let list: any = [];
    if (detail) {
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
      console.log('找到的可选择网关设备!', list);
    }
    return list;
  }
  // 删除网元设备tags
  removeGateWayTags = (tagId: any, ip: any) => {
    let listThree = this.state.listThree;
    if (listThree && listThree.length > 0) {
      for (let index = 0; index < listThree.length; index++) {
        const v = listThree[index];
        if (v.ipfenge === ip) {
          if (v.business_type === 2) {
            v.gateway_info = v.gateway_info.filter((p: any) => p !== tagId);
            v.gateway_infoOBJ = v.gateway_infoOBJ.filter((p: any) => p.id !== tagId);
          }
          if (v.business_type === 1) {
            v.gateway_info = null;
            v.gateway_infoOBJ = null;
          }
        }
      }
    }
    this.setState({ listThree }, () => {
      console.log('资源类型变化', this.state.listThree);
      this.forceUpdate();
    });
  }
  showGateWaySelectedModal = (obj: any) => {
    this.setState({ currentGateWayObj: obj, showGateWaySelectTable: true });
  }

  hideGateWaySelectedModal = () => {
    this.setState({ showGateWaySelectTable: false });
  }
  onGateWaySelect = (selectedRowKeys: any, selectedRows: any) => {
    console.log(selectedRowKeys);
    console.log(selectedRows);
    let listThree = this.state.listThree;
    if (listThree && listThree.length > 0) {
      for (let index = 0; index < listThree.length; index++) {
        const v = listThree[index];
        if (v.ipfenge === this.state.currentChild.ipfenge) {
          if (this.state.currentGateWayObj.business_type === 1) { // 单选
            v.gateway_info = selectedRowKeys.id;
            v.gateway_infoOBJ = selectedRowKeys;
          }
          if (this.state.currentGateWayObj.business_type === 2) { // 多选
            v.gateway_info = selectedRowKeys;
            v.gateway_infoOBJ = selectedRows;
          }
        }
      }
    }
    this.setState({ listThree }, () => {
      console.log(this.state.listThree);
      this.forceUpdate();
    });
    if (this.state.currentGateWayObj.business_type !== 2) {
      this.hideGateWaySelectedModal();
    }
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
    let listThree = this.state.listThree;
    console.log('编辑分段组件接收到的详情数据:', detail);
    console.log('编辑分段组件接收到的子IP:', listThree);
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
    const getOwnerDomainstagChild = (ownerDomainsOBJ: any, ip: any) => {
      let taglist: any = [];
      if (ownerDomainsOBJ && ownerDomainsOBJ && ownerDomainsOBJ.length > 0) {
        for (let index = 0; index < ownerDomainsOBJ.length; index++) {
          const element = ownerDomainsOBJ[index];
          taglist.push(
            <Tag
              key={element.name}
              closable={true}
              onClose={(e: any) => {
                e.preventDefault();
                this.removeTagsChild(element.id, ip);
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
    // 显示网元列表模态窗
    const showDomainListModalChild = (ip: any) => {
      let listThree = this.state.listThree;
      if (listThree && listThree.length > 0) {
        for (let index = 0; index < listThree.length; index++) {
          const v = listThree[index];
          if (v.ipfenge === ip) {
            console.log(v);
            this.setState({ currentChild: v, showDomainListTableChild: true });
          }
        }
      }
    };
    // 关闭资源归属模态窗
    const onDomainTableCancelChild = () => {
      this.setState({
        showDomainListTableChild: false,
      });
    };
    const getGateWaytag = (ip: any) => {
      let taglist: any = [];
      let obj: any = null;
      let listThree = this.state.listThree;
      if (listThree && listThree.length > 0) {
        for (let index = 0; index < listThree.length; index++) {
          const v = listThree[index];
          if (v.ipfenge === ip) {
            obj = v;
            break;
          }
        }
      }
      if (obj.business_type === 2) {
        if (obj && obj.gateway_infoOBJ && obj.gateway_infoOBJ.length > 0) {
          for (let index = 0; index < obj.gateway_infoOBJ.length; index++) {
            const element = obj.gateway_infoOBJ[index];
            taglist.push(
              <Tag
                key={element.name}
                closable={true}
                onClose={(e: any) => {
                  e.preventDefault();
                  this.removeGateWayTags(element.id, ip);
                }}
              >
                {element.name}
              </Tag>
            );
          }
        }
      }
      if (obj.business_type === 1) {
        if (obj && obj.gateway_infoOBJ) {
          taglist.push(
            <Tag
              key={obj.gateway_infoOBJ.name}
              closable={true}
              onClose={(e: any) => {
                e.preventDefault();
                this.removeGateWayTags(obj.id, ip);
              }}
            >
              {obj.gateway_infoOBJ.name}
            </Tag>
          );
        }
      }
      return taglist;
    };
    let TabPaneLists: any = [];
    if (listThree && listThree.length > 0) {
      listThree.forEach((v: any, index: number) => {
        TabPaneLists.push(
          < TabPane tab={<span><Icon type="pull-request" />{v.ip + '/' + v.netmask}</span>} forceRender={true} key={index.toString()}>
            <FormItem {...formItemLayout} label="业务类型">
              {getFieldDecorator('business_typeChild' + index, {
                initialValue: v ? v.business_type : null,
                rules: [
                  // { required: true, message: '请填写属性标识!' },
                ],
              })(
                <Select style={{ width: 450 }} disabled={true}>
                  {IPBroadcastoptions}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="业务地点">
              {getFieldDecorator('business_locationChild' + index, {
                initialValue: v ? v.businesslocation : null,
                rules: [
                  // { required: true, message: '请填写属性标识!' },
                ],
              })(
                <Select style={{ width: 450 }} onChange={(value: any) => { this.businesslocationChangeChild(value, v.ipfenge); }} >
                  {dataCenterListoptions}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="网关设备">
              {getFieldDecorator('gateway_infoChild' + index, {
                // initialValue: v ? v.gateway_info ? v.gateway_info.ids[0] : null : null,
                rules: [
                  // { required: true, message: '请填写属性标识!' },
                ],
              })(
                <div>
                  {getGateWaytag(v.ipfenge)}
                  <Tag onClick={() => this.showGateWaySelectedModal(v)} style={{ background: '#fff', borderStyle: 'dashed' }}>
                    <Icon type="search" /> 选择网关设备
                   </Tag>
                </div>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('noteChild' + index, {
                initialValue: v ? v.note : null,
                rules: [
                  // { required: true, message: '请填写属性标识!' },
                ],
              })(
                <TextArea
                  placeholder="请输入备注"
                  autoSize={true}
                  style={{ width: 450 }}
                  onChange={(e: any) => { this.noteChildChange(e, v.ipfenge); }}
                // value={v.note}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="一致性">
              {getFieldDecorator('consistencyChild' + index, {
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
                  // checked={(detail && detail.broadcast_location) && (detail.broadcast_location.toString() === v.business_location ? v.business_location.toString() : '') ? true : false}
                  checked={this.consistency(v.ipfenge)}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="资源类型">
              {getFieldDecorator('resource_typeChild' + index, {
                initialValue: v ? v.resource_type : null,
                rules: [
                  // { required: true, message: '请填写属性标识!' },
                ],
              })(
                <Select style={{ width: 450 }} onChange={(value: any) => { this.resourceTypeChangechild(value, v.ipfenge); }}>
                  {ResourceTypeOptions}
                </Select>
              )}
            </FormItem>
            {v && v.resource_type !== 1 && v.resource_type !== null &&
              <FormItem {...formItemLayout} label="资源归属">
                {getFieldDecorator('owner_domainsChild' + index, {
                  initialValue: v ? v.owner_domains : [],
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <div>
                    {getOwnerDomainstagChild(v.owner_domainsOBJ, v.ipfenge)}
                    <Tag onClick={() => showDomainListModalChild(v.ipfenge)} style={{ background: '#fff', borderStyle: 'dashed' }}>
                      <Icon type="search" /> 选择资源归属
                  </Tag>
                  </div>
                )}
              </FormItem>
            }
            <FormItem>
              <Button onClick={() => { this.deleteChildIP(v); }} style={{ marginLeft: 800 }}>删除</Button>
            </FormItem>
          </ TabPane>
        );
      });
    }
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

              <FormItem {...formItemLayout} label="IP分割">
                {getFieldDecorator('ipfenge', {
                  // initialValue: v.owner_domains,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Input style={{ width: 450 }} onChange={(e: any) => { this.ipfengeChange(e); }} />
                )}
                <Button type="primary" style={{ marginLeft: 20 }} onClick={() => { this.postIpsSplit2(); }}>生成</Button>
              </FormItem>
              {this.state.listThree && this.state.listThree.length > 0 &&
                <div>
                  <Divider orientation="left">分段IP</Divider>
                  <Tabs >
                    {TabPaneLists}
                  </Tabs>
                </div>
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
              this.state.showDomainListTableChild &&
              <Modal
                title="资源归属列表"
                visible={this.state.showDomainListTableChild}
                onOk={onDomainTableCancelChild}
                maskClosable={false}
                onCancel={onDomainTableCancelChild}
                centered={true}
                destroyOnClose={true}
                width={1000}
              >
                <OwnerdomainsSelectModal
                  resourceType={this.state.currentChild.resource_type}
                  onSelectChange={this.ownerdomainsChangeChild}
                  hasSelected={this.state.currentChild.owner_domains}
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
                    multiple={this.state.currentGateWayObj.business_type === 2 ? true : false}
                    city={this.state.currentGateWayObj.businesslocation}
                    selectedRowKeys={this.state.currentGateWayObj.gateway_info}
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

export default EditZY;