import * as React from 'react';
import { IPManage } from 'src/api';
import CurrentPage from 'src/display/components/CurrentPage';
import CommonButton from 'src/display/components/CommonButton';
import OwnerdomainsSelectModal from './OwnerdomainsSelectModal';
import NetElementListModal from 'src/display/components/NetElementSelect';
import { Row, Col, Form, Input, Button, Select, message, Divider, Tabs, Switch, Icon, PageHeader, Drawer, Modal, Tag } from 'antd';
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
  IPlist: Array<any>;
  index: number;
  visible: boolean;
  broadcasttype: any;
  businesstype: any;
  DatadictNetelementAllowOptions: any;
  plresourceType: any;
  showDomainListTable: any;
  currentresourceType: any;
  currentName: any;
  hasSelected: any;
  showPLDomainListTable: any;
  plowner_domains: any;
  plowner_domainsBOJ: any;
  showGateWaySelectTablePL: any;
  plbusinessLocation: any;
  plgateway_info: any;
  plgateway_infoOBJ: any;
  showGateWaySelectTable: any;
  currentGateWayObj: any;
}

/**
 * Add
 */
class BQaddIpManeger extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      IPlist: [], // 生成1的IPlist
      index: 0,
      visible: false,
      broadcasttype: null,
      businesstype: null,
      DatadictNetelementAllowOptions: [],
      plresourceType: null,
      showDomainListTable: false,
      currentresourceType: null,
      currentName: null,
      hasSelected: null,
      showPLDomainListTable: false,
      plowner_domains: [],
      plowner_domainsBOJ: [],
      plgateway_info: [],
      plgateway_infoOBJ: [],
      showGateWaySelectTablePL: false,
      plbusinessLocation: null,
      currentGateWayObj: null,
      showGateWaySelectTable: false,
    };
  }
  UNSAFE_componentWillMount() {
    const { buquan } = this.props.shareState;
    if (buquan) {
      let objs: any = [];
      for (let index = 0; index < buquan.data.length; index++) {
        const element = buquan.data[index];
        let obj = {
          index: index,
          name: element,
          iptype: 2,
          using: null,
          storage: null,
          broadcast_type: null,
          broadcast_location: null,
          business_type: null,
          business_location: null,
          gateway_info: null,
          gateway_infoOBJ: null,
          note: null,
          consistency: false,
          owner_domains: [],
          owner_domainsOBJ: [],
          ipfenge: null,
          resource_type: null
        };
        objs.push(obj);
      }
      this.setState({ IPlist: objs, index: buquan.data.length + 1 }, () => {
        console.log('补全信息:', this.state.IPlist);
      });
    }

  }
  // 生成1
  postIpsSplit = async () => {
    this.setState({ IPlist: [], index: 0 }, () => {
      this.forceUpdate();
      this.props.form.validateFields(['ip', 'netmask'], async (err: any, value: any) => {
        console.log(value);
        if (err) {
          message.error('校验有误!');
          return;
        }
        let param = {
          ip: value.ip,
          netmask: value.netmask
        };
        let res = await IPManage.postIpsSplit(param);

        if (!res.code) {
          message.error(res.msg);
          return;
        }
        if (res) {
          message.success(res.msg);
          let objs: any = [];
          for (let index = 0; index < res.results.data.length; index++) {
            const element = res.results.data[index];
            let obj = {
              index: index,
              name: element,
              iptype: index === 0 ? 1 : 2,
              using: null,
              storage: null,
              broadcast_type: null,
              broadcast_location: null,
              business_type: null,
              business_location: null,
              gateway_info: null,
              gateway_infoOBJ: null,
              note: null,
              consistency: false,
              owner_domains: [],
              owner_domainsOBJ: [],
              ipfenge: null,
              resource_type: null
            };
            objs.push(obj);
          }
          this.setState({ IPlist: objs, index: res.results.data.length + 1 }, () => {
            this.forceUpdate();
            console.log('生成结果:', this.state.IPlist);
          });
        }
      });
    });
  }
  // 生成2
  postIpsSplit2 = async (name: any) => {
    let IPlist = this.state.IPlist;
    let child: any = null;
    let flag = false;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        child = v.ipfenge;
      }
      if (v.name === child && v.parent && v.parent === name) {
        flag = true;
        return;
      }
    });
    if (flag) {
      message.error('重复分割!');
      return;
    }
    let param = {
      parent: name,
      child: child
    };
    let res = await IPManage.postIpsSplit2(param);
    if (!res.code) {
      message.error(res.msg);
      return;
    }
    if (res.code) {
      message.success(res.msg);
      let objs = this.state.IPlist;
      let index = this.state.index;
      let obj = {
        index: index,
        name: child,
        iptype: 4,
        using: null,
        storage: null,
        broadcast_type: null,
        broadcast_location: null,
        business_type: null,
        business_location: null,
        gateway_info: null,
        gateway_infoOBJ: null,
        note: null,
        consistency: false,
        owner_domains: [],
        owner_domainsOBJ: [],
        ipfenge: null,
        parent: name,
        resource_type: null
      };
      objs.push(obj);
      index = index + 1;
      this.setState({ IPlist: objs, index }, () => {
        this.forceUpdate();
        console.log('分割生成结果:', this.state.IPlist);
      });
    }
  }
  // 获取item 
  getItems = (IPkey: string) => {
    console.log(IPkey);
    // let list: any = [];
  }
  // 启用状态改变
  usingChange = (value: any, name: any) => {
    let IPlist = this.state.IPlist;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.using = value;
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
    });
  }
  // IP类型变化
  IPTypehandleChange = (value: any, name: any) => {
    let IPlist = this.state.IPlist;
    let flag = false;
    let childips: any = [];
    IPlist.forEach((v: any) => {
      if (v.parent && v.parent === name) {
        flag = true;
        childips.push(v);
        // return;
      }
      console.log('找到的子ips:', childips);
      if (v.name === name) {
        v.iptype = value;
      }
    });
    if (flag) {
      message.warning('该操作将删除对应分割的IP!');
      let newIPlist = IPlist.filter((v: any) => {
        if (!v.parent) {
          return v;
        } else if (v.parent && v.parent !== name) {
          return v;
        }
      });
      console.log(newIPlist);
      this.setState({ IPlist: newIPlist }, () => {
        console.log('变化后 有子IP', this.state.IPlist);
      });
    } else {
      this.setState({ IPlist }, () => {
        console.log('变化后', this.state.IPlist);
      });
    }
  }
  // 入库状态变化
  storageChange = (value: any, name: any) => {
    let IPlist = this.state.IPlist;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.storage = value;
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
    });
  }
  // 广播类型变化
  broadcasttypeChange = (value: any, name: any) => {
    let IPlist = this.state.IPlist;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.broadcast_type = value;
        if (value === 2) {
          v.broadcast_location = [];
        } else {
          v.broadcast_location = null;
        }
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
    });
  }
  // 广播地点变化
  broadcastlocationChange = (value: any, name: any) => {
    let IPlist = this.state.IPlist;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.broadcast_location = value;
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
    });
  }
  // 业务类型变化
  businesstypeChange = (value: any, name: any) => {
    let IPlist = this.state.IPlist;
    // this.setState({ IPlist: [] }, () => {
    //   console.log(this.state.IPlist);
    // });
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.business_type = value;
        if (value === 2) {
          v.gateway_info = null;
          v.gateway_infoOBJ = null;
          v.business_location = [];
        } else {
          v.gateway_info = null;
          v.gateway_infoOBJ = null;
          v.business_location = null;
        }
        console.log(v);
        this.forceUpdate();
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
    });
  }
  // 业务地点变化
  businesslocationChange = async (value: any, name: any, option: any) => {
    console.log(value);
    console.log(option);
    let IPlist = this.state.IPlist;
    for (let index = 0; index < IPlist.length; index++) {
      const v = IPlist[index];
      if (v.name === name) {
        v.business_location = value;
        v.gateway_info = null;
        v.gateway_infoOBJ = null;
        if (v.iptype === 4) {
          IPlist.forEach((y: any) => {
            if (y.name === v.parent) {
              if (y.broadcast_type === 1 && v.business_type === 1) {
                if (y.broadcast_location === value) {
                  v.consistency = true;
                } else {
                  v.consistency = false;
                }
              } else if (y.broadcast_type === 2 && v.business_type === 2) {
                if (y.broadcast_location.sort().toString() === value.sort().toString()) {
                  v.consistency = true;
                } else {
                  v.consistency = false;
                }
              } else {
                v.consistency = false;
              }
            }
          });
        }
        // 查找当前对象能选择的网关设备
        let list: any = [];
        // const { moduleAction } = this.props.shareState;
        if (typeof (v.business_location) === 'number') {
          let Netelements = await this.getNetelement(value);
          list = (Netelements);
        } else if (typeof (v.business_location) === 'object') {
          if (v.business_location && v.business_location.length > 0) {
            for (let index = 0; index < v.business_location.length; index++) {
              const element = v.business_location[index];
              let Netelements = await this.getNetelement(element);
              list = list.concat(Netelements);
            }
          }
        }
        v.DatadictNetelementAllowOptions = list;
        console.log('找到的可选择网关设备!', v);
      }
    }
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
      this.forceUpdate();
    });
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
  gatewayinfoChange = (value: any, name: any) => {
    let IPlist = this.state.IPlist;
    console.log(value);
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.gateway_info = value;
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
    });
  }
  // 资源类型变化
  resourceTypeChange = (value: any, name: any) => {
    console.log(value);
    let IPlist = this.state.IPlist;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.resource_type = value;
        v.owner_domains = [];
        v.owner_domainsOBJ = [];
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
    });
  }
  // 批量资源类型变化
  plresourceTypeChange = (value: any) => {
    this.setState({ plresourceType: value, plowner_domains: [], plowner_domainsBOJ: [] }, () => {
      console.log(this.state.plresourceType);
    });
  }
  // 备注变化
  noteChange = (e: any, name: any) => {
    let IPlist = this.state.IPlist;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.note = e.target.value;
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
    });
  }
  // IP分隔变化
  ipfengeChange = (e: any, name: any) => {
    let IPlist = this.state.IPlist;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.ipfenge = e.target.value;
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
    });
  }
  // 补全提交
  postAddIp = async () => {
    this.props.form.validateFields(async (err: any, value: any) => {
      console.log('iplists:', this.state.IPlist);
      console.log('value:', value);
      if (this.paramsCheck()) {
        message.error('校验有误!(除备注外,其他属性都为必填项!)');
        return;
      }
      let param = this.getsegmentIps();
      console.log('参数:', param);
      const { buquanRecord } = this.props.shareState;
      let res = await IPManage.getIpmanagerAddCommit(buquanRecord.id, param);
      if (!res.code) {
        message.error(res.msg);
        return;
      }
      if (res.code) {
        message.success(res.msg);
        this.setState({ IPlist: [], index: 0 });
        const { moduleAction } = this.props.shareState;
        moduleAction.closeEditHT();
      }
    });
  }
  // 参数校验
  paramsCheck = () => {
    const IPlist = this.state.IPlist;
    let flag = false; // false代表通过,true 代表不通过
    let flag1 = false; // false代表通过,true 代表不通过
    let flag2 = false; // false代表通过,true 代表不通过
    let flag3 = false; // false代表通过,true 代表不通过
    let flag4 = false; // false代表通过,true 代表不通过
    if (IPlist && IPlist.length > 0) {
      IPlist.forEach((v: any) => {
        if (!v.iptype) {
          flag = true;
          flag1 = true;
          flag2 = true;
          flag3 = true;
          flag4 = true;
        } else {
          if (v.iptype === 1) {
            flag1 = this.HtCheck(v);
          }
          if (v.iptype === 2) {
            flag2 = this.YwCheck(v);
          }
          if (v.iptype === 3) {
            flag3 = this.ZyCheck(v);
          }
          if (v.iptype === 4) {
            flag4 = this.FdCheck(v);
          }
        }
      });
    }
    if (flag1 || flag2 || flag3 || flag4) {
      flag = true;
    }
    return flag;
  }
  // 合同IP校验
  HtCheck = (data: any) => {
    let flag: any = false;
    if (!data.using) {
      flag = true;
    }
    if (!data.broadcast_type) {
      flag = true;
    }
    if (!data.broadcast_location) {
      flag = true;
    }
    if (!data.owner_domains) {
      flag = true;
    }
    return flag;
  }
  // 业务IP校验
  YwCheck = (data: any) => {
    let flag: any = false;
    if (!data.using) {
      flag = true;
    }
    if (!data.storage) {
      flag = true;
    }
    if (!data.broadcast_type) {
      flag = true;
    }
    if (!data.broadcast_location) {
      flag = true;
    }
    if (!data.business_type) {
      flag = true;
    }
    if (!data.business_location) {
      flag = true;
    }
    if (!data.gateway_info) {
      flag = true;
    }
    if (!data.owner_domains) {
      flag = true;
    }
    return flag;
  }
  // 资源IP校验
  ZyCheck = (data: any) => {
    let flag: any = false;
    if (!data.using) {
      flag = true;
    }
    if (!data.storage) {
      flag = true;
    }
    if (!data.broadcast_type) {
      flag = true;
    }
    if (!data.broadcast_location) {
      flag = true;
    }
    if (!data.owner_domains) {
      flag = true;
    }
    return flag;
  }
  // 分段IP校验
  FdCheck = (data: any) => {
    let flag: any = false;
    if (!data.parent) {
      flag = true;
    }
    if (!data.business_type) {
      flag = true;
    }
    if (!data.business_location) {
      flag = true;
    }
    if (!data.gateway_info) {
      flag = true;
    }
    if (!data.owner_domains) {
      flag = true;
    }
    return flag;
  }
  // 组装segment_ips
  getsegmentIps = () => {
    const IPlist = this.state.IPlist;
    let list: any = [];
    if (IPlist && IPlist.length > 0) {
      IPlist.forEach((v: any) => {
        let obj: any = {};
        let ids: any = [];
        if (typeof (v.gateway_info) === 'number') {
          ids.push(v.gateway_info);
        }
        if (typeof (v.gateway_info) === 'object') {
          ids = v.gateway_info;
        }
        obj.gateway_info = { ids: ids };
        obj.ip_type = v.iptype;
        obj.resource_type = v.resource_type;

        obj.ip = v.name.split('/')[0];
        obj.netmask = parseInt(v.name.split('/')[1], 10);
        if (v.using) {
          obj.using = v.using === 'true' ? true : false;
        }
        if (v.storage) {
          obj.storage = v.storage === 'true' ? true : false;
        }
        obj.broadcast_type = v.broadcast_type;
        obj.business_type = v.business_type;
        obj.note = v.note;
        if (!v.parent) {
          if (v.business_location === v.broadcast_location) {
            obj.consistency = true;
          } else {
            obj.consistency = false;
          }
        } else {
          obj.consistency = v.consistency;
        }

        obj.owner_domains = v.owner_domains;
        if (v.parent) {
          obj.parent = v.parent;
        }
        if (v.broadcast_location) {
          obj.broadcast_location = this.getLocations(v.broadcast_location);
        }
        if (v.business_location) {
          obj.business_location = this.getLocations(v.business_location);
        }
        list.push(obj);
      });
    }
    return list;
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
  // 是否有子IP
  hasChildIPs = (name: any) => {
    let IPlist = this.state.IPlist;
    let flag = false;
    let childips: any = [];
    IPlist.forEach((v: any) => {
      if (v.parent && v.parent === name) {
        flag = true;
        childips.push(v);
        // return;
      }
      // console.log('找到的子ips:', childips);
    });
    return flag;
  }
  // 抽屉关闭
  onClose = () => {
    this.setState({ visible: false });
  }
  // 抽屉开启
  onOpen = () => {
    this.setState({ visible: true });
  }
  // 批量广播类型
  plbroadcasttypeChange = (value: any) => {
    console.log('批量广播类型', value);
    this.setState({ broadcasttype: value });
  }
  // 批量业务类型
  plbusinesstypeChange = (value: any) => {
    console.log('批量业务类型', value);
    this.setState({ businesstype: value, plbusinessLocation: null, plgateway_infoOBJ: null, plgateway_info: null });
  }
  // 批量业务地点
  plbusinesslocationChange = async (value: any) => {
    console.log('批量业务地点', value);
    this.setState({ plbusinessLocation: value, plgateway_info: null, plgateway_infoOBJ: null });
    // 查找当前对象能选择的网关设备
    let list: any = [];
    if (this.state.businesstype === 1) {
      let Netelements = await this.getNetelement(value);
      list = (Netelements);
      this.setState({ DatadictNetelementAllowOptions: list }, () => {
        console.log('找到的可选择网关设备', this.state.DatadictNetelementAllowOptions);
      });
    } else if (this.state.businesstype === 2) {
      if (value && value.length > 0) {
        for (let index = 0; index < value.length; index++) {
          const element = value[index];
          let Netelements = await this.getNetelement(element);
          list = list.concat(Netelements);
        }
      }
      this.setState({ DatadictNetelementAllowOptions: list }, () => {
        console.log('找到的可选择网关设备', this.state.DatadictNetelementAllowOptions);
      });
    }
  }
  // 批量操作提交
  plActionCommit = () => {
    this.props.form.validateFields(['plusing', 'plstorage', 'plbroadcast_type', 'plresource_type',
      'plbroadcast_location', 'plbusiness_type', 'plbusiness_location', 'plgateway_info', 'plnote',
      'plowner_domains',
    ], async (err: any, value: any) => {
      console.log('数据', value);
      let IPlist = this.state.IPlist;
      this.setState({ IPlist: [] }, () => {
        for (let index = 0; index < IPlist.length; index++) {
          const element = IPlist[index];
          if (!element.parent) {
            element.DatadictNetelementAllowOptions = this.state.DatadictNetelementAllowOptions;
            element.using = value.plusing;
            element.storage = value.plstorage;
            element.broadcast_type = value.plbroadcast_type;
            element.business_type = value.plbusiness_type;
            element.gateway_info = this.state.plgateway_info;
            element.gateway_infoOBJ = this.state.plgateway_infoOBJ;
            element.note = value.plnote;
            element.broadcast_location = value.plbroadcast_location;
            element.business_location = value.plbusiness_location;
            if (value.plresource_type === 1) {
              element.resource_type = null;
              element.owner_domains = null;
              element.owner_domainsOBJ = [];
            } else {
              element.resource_type = value.plresource_type;
              element.owner_domains = this.state.plowner_domains;
              element.owner_domainsOBJ = this.state.plowner_domainsBOJ;
            }
          }
        }
        this.setState({ IPlist }, () => {
          this.onClose();
          this.forceUpdate();
          console.log(this.state.IPlist);
        });
      });
    });
  }
  onEdit = (targetKey: any, action: any) => {
    // console.log(targetKey);
    // console.log(action);
    this[action](targetKey);
  }
  // 删除tabs
  remove = (targetKey: any) => {
    let IPlist = this.state.IPlist;
    let newIPlist = IPlist.filter((v: any) => {
      if (v.index.toString() !== targetKey.toString()) {
        return v;
      }
    });
    console.log(newIPlist);
    this.setState({ IPlist: newIPlist }, () => {
      console.log('删除后的IPlist:', this.state.IPlist);
    });
  }
  // 删除tags
  removeTags = (name: any, tagId: any) => {
    let IPlist = this.state.IPlist;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.owner_domains = v.owner_domains.filter((p: any) => p !== tagId);
        v.owner_domainsOBJ = v.owner_domainsOBJ.filter((p: any) => p.id !== tagId);
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
      this.forceUpdate();
    });
  }
  // 资源归属变化
  ownerdomainsChange2 = (selectedRowKeys: any, selectedRows: any) => {
    console.log(selectedRowKeys);
    console.log(selectedRows);
    let IPlist = this.state.IPlist;
    let name = this.state.currentName;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        v.owner_domains = selectedRowKeys;
        v.owner_domainsOBJ = selectedRows;
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
    });
  }
  // 批量资源归属变化
  ownerdomainsChange2pl = (selectedRowKeys: any, selectedRows: any) => {
    console.log(selectedRowKeys);
    console.log(selectedRows);
    this.setState({ plowner_domains: selectedRowKeys, plowner_domainsBOJ: selectedRows });
  }
  // 删除tagsPL
  removeTagsPL = (tagId: any) => {
    let a = this.state.plowner_domains;
    let b = this.state.plowner_domainsBOJ;
    a = a.filter((p: any) => p !== tagId);
    b = b.filter((p: any) => p.id !== tagId);
    this.setState({ plowner_domains: a, plowner_domainsBOJ: b }, () => {
      this.forceUpdate();
    });
  }
  showGateWaySelectedModalpl = () => {
    this.setState({ showGateWaySelectTablePL: true });
  }
  hideGateWaySelectedModalpl = () => {
    this.setState({ showGateWaySelectTablePL: false });
  }
  // 删除网元设备tagsPL
  removeGateWayTagsPL = (tagId: any) => {
    let a = this.state.plgateway_info;
    let b = this.state.plgateway_infoOBJ;
    let businessType = this.state.businesstype;
    if (businessType === 2) {
      a = a.filter((p: any) => p !== tagId);
      b = b.filter((p: any) => p.id !== tagId);
    }
    if (businessType === 1) {
      a = null;
      b = null;
    }
    this.setState({ plgateway_info: a, plgateway_infoOBJ: b }, () => {
      this.forceUpdate();
    });
  }
  onGateWayPLSelect = (selectedRowKeys: any, selectedRows: any) => {
    console.log(selectedRowKeys);
    console.log(selectedRows);
    let plgatewayinfo = this.state;
    let plgatewayinfoOBJ = this.state;
    if (this.state.businesstype === 1) { // 单选
      plgatewayinfo = selectedRowKeys.id;
      plgatewayinfoOBJ = selectedRowKeys;
    }
    if (this.state.businesstype === 2) { // 多选
      plgatewayinfo = selectedRowKeys;
      plgatewayinfoOBJ = selectedRows;
    }
    this.setState({ plgateway_info: plgatewayinfo, plgateway_infoOBJ: plgatewayinfoOBJ }, () => {
      this.forceUpdate();
    });
    if (this.state.businesstype !== 2) {
      this.hideGateWaySelectedModalpl();
    }
  }
  // 删除网元设备tags
  removeGateWayTags = (name: any, tagId: any) => {
    let IPlist = this.state.IPlist;
    IPlist.forEach((v: any) => {
      if (v.name === name) {
        if (v.business_type === 2) {
          v.gateway_info = v.gateway_info.filter((p: any) => p !== tagId);
          v.gateway_infoOBJ = v.gateway_infoOBJ.filter((p: any) => p.id !== tagId);
        }
        if (v.business_type === 1) {
          v.gateway_info = null;
          v.gateway_infoOBJ = null;
        }
      }
    });
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
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
    let IPlist = this.state.IPlist;
    for (let index = 0; index < IPlist.length; index++) {
      const v = IPlist[index];
      if (v.name === this.state.currentGateWayObj.name) {
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
    this.setState({ IPlist }, () => {
      console.log(this.state.IPlist);
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
    const { IpmanageContracts, IPType, IPBroadcast, ResourceType, nations, DomainListUnLoginList, moduleAction, buquanRecord } = this.props.shareState;
    let IpmanageContractsOptions: any = [];
    if (IpmanageContracts && IpmanageContracts.length > 0) {
      IpmanageContracts.forEach((e: any) => {
        IpmanageContractsOptions.push(<Option value={e.id} key={e.id}>{e.contract_code}</Option>);
      });
    }
    let IPtypeoptions: any = [];
    if (IPType && IPType.length > 0) {
      IPType.forEach((e: any) => {
        IPtypeoptions.push(<Option value={e.id} key={e.id} disabled={e.id === 1 || e.id === 4}>{e.name}</Option>);
      });
    }
    let IPBroadcastoptions: any = [];
    if (IPBroadcast && IPBroadcast.length > 0) {
      IPBroadcast.forEach((e: any) => {
        IPBroadcastoptions.push(<Option value={e.id} key={e.id}>{e.name}</Option>);
      });
    }
    let ResourceTypeOptions: any = [];
    if (ResourceType && ResourceType.data && ResourceType.data.length > 0) {
      ResourceType.data.forEach((e: any) => {
        ResourceTypeOptions.push(<Option value={e.id} key={e.id}>{e.name}</Option>);
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
      // nations.forEach((e: any) => {
      //   dataCenterListoptions.push(<OptGroup label={e.nation} key={e.nation}>{getOption(e.citys)}</OptGroup>);
      // });
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
    const getOwnerDomainstag = (obj: any) => {
      let taglist: any = [];
      if (obj && obj.owner_domainsOBJ && obj.owner_domainsOBJ.length > 0) {
        for (let index = 0; index < obj.owner_domainsOBJ.length; index++) {
          const element = obj.owner_domainsOBJ[index];
          taglist.push(
            <Tag
              key={element.name}
              closable={true}
              onClose={(e: any) => {
                e.preventDefault();
                this.removeTags(obj.name, element.id);
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
    const showDomainListModal = (v: any) => {
      this.setState({
        showDomainListTable: true,
        currentresourceType: v.resource_type,
        currentName: v.name,
        hasSelected: v.owner_domains,
      });
    };
    // 显示批量网元列表模态窗
    const showDomainListModalPL = (v: any) => {
      this.setState({
        showPLDomainListTable: true,
        hasSelected: this.state.plowner_domains,
      });
    };

    const getGateWaytag = (obj: any) => {
      let taglist: any = [];
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
                  this.removeGateWayTags(obj.name, element.id);
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
                this.removeGateWayTags(obj.name, obj.gateway_infoOBJ.id);
              }}
            >
              {obj.gateway_infoOBJ.name}
            </Tag>
          );
        }
      }

      return taglist;
    };
    // 渲染子IP的TABS
    const renderChildIPTabs = (name: any) => {
      let IPlist = this.state.IPlist;
      let childips: any = [];
      IPlist.forEach((y: any) => {
        if (y.parent && y.parent === name) {
          childips.push(y);
        }
      });
      // console.log('找到的子ips:', childips);
      let childTabs: any = [];
      if (childips && childips.length > 0) {
        childips.forEach((v: any) => {
          childTabs.push(
            < TabPane tab={v.parent ? <span><Icon type="pull-request" />{v.name}</span> : v.name} key={v.index} forceRender={true} >
              <FormItem {...formItemLayout} label="IP类型">
                {getFieldDecorator(`iptype${v.name}`, {
                  initialValue: v.iptype,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Select
                    style={{ width: 450 }}
                    onChange={(value: any) => { this.IPTypehandleChange(value, v.name); }}
                  // disabled={(v.index === 0 || v.parent) ? true : false}
                  // value={v.iptype}
                  >
                    {IPtypeoptions}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="业务类型">
                {getFieldDecorator(`business_type${v.index}`, {
                  initialValue: v.business_type,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Select style={{ width: 450 }} onChange={(value: any) => { this.businesstypeChange(value, v.name); }}>
                    {IPBroadcastoptions}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="业务地点">
                {getFieldDecorator(`business_location${v.index}`, {
                  initialValue: v.business_location,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Select
                    style={{ width: 450 }}
                    // labelInValue={true}
                    onChange={(value: any, option: any) => { this.businesslocationChange(value, v.name, option); }}
                    mode={v.business_type === 2 ? 'multiple' : 'default'}
                  >
                    {dataCenterListoptions}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="网关设备">
                {getFieldDecorator(`gateway_info${v.index}`, {
                  initialValue: v.gateway_info,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <div>
                    {getGateWaytag(v)}
                    <Tag onClick={() => this.showGateWaySelectedModal(v)} style={{ background: '#fff', borderStyle: 'dashed' }}>
                      <Icon type="search" /> 选择网关设备
                    </Tag>
                  </div>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="备注">
                {getFieldDecorator(`note${v.index}`, {
                  initialValue: v.note,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <TextArea
                    placeholder="请输入备注"
                    autoSize={true}
                    style={{ width: 450 }}
                    onChange={(e: any) => { this.noteChange(e, v.name); }}
                  // value={v.note}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="一致性">
                {getFieldDecorator(`consistency${v.index}`, {
                  initialValue: v.consistency,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Switch
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    defaultChecked={false}
                    disabled={true}
                    checked={v.consistency}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="资源类型">
                {getFieldDecorator(`resource_type${v.index}`, {
                  initialValue: v.resource_type ? v.resource_type : null,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Select style={{ width: 450 }} onChange={(value: any) => { this.resourceTypeChange(value, v.name); }}>
                    {ResourceTypeOptions}
                  </Select>
                )}
              </FormItem>
              {v.resource_type !== 1 && v.resource_type !== null &&
                <FormItem {...formItemLayout} label="资源归属">
                  {getFieldDecorator(`owner_domains${v.index}`, {
                    initialValue: v.owner_domains ? v.owner_domains : [],
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <div>
                      {getOwnerDomainstag(v)}
                      <Tag onClick={() => showDomainListModal(v)} style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <Icon type="search" /> 选择资源归属
                    </Tag>
                    </div>
                  )}
                </FormItem>
              }
            </ TabPane>
          );
        });
      }
      return childTabs;
    };
    let TabPaneLists: any = [];
    console.log(this.state.IPlist);
    let iplist = this.state.IPlist;
    if (iplist && iplist.length > 0) {
      iplist.forEach((v: any, index: number) => {
        if (!v.parent) {
          TabPaneLists.push(
            < TabPane tab={v.parent ? <span><Icon type="pull-request" />{v.name}</span> : v.name} key={v.index} forceRender={true} >
              <FormItem {...formItemLayout} label="IP类型">
                {getFieldDecorator(`iptype${v.name}`, {
                  initialValue: v.iptype,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Select
                    style={{ width: 450 }}
                    onChange={(value: any) => { this.IPTypehandleChange(value, v.name); }}
                  // disabled={(v.index === 0 || v.parent) ? true : false}
                  // value={v.iptype}
                  >
                    {IPtypeoptions}
                  </Select>
                )}
              </FormItem>
              {v.iptype !== 4 &&
                <FormItem {...formItemLayout} label="启用状态" >
                  {getFieldDecorator(`using${v.index}`, {
                    initialValue: v.using,
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <Select style={{ width: 450 }} onChange={(value: any) => { this.usingChange(value, v.name); }} >
                      <Option value={'true'}>启用</Option>
                      <Option value={'false'}>未启用</Option>
                    </Select>
                  )}
                </FormItem>
              }
              {(v.iptype === 2 || v.iptype === 3) &&
                <FormItem {...formItemLayout} label="入库状态">
                  {getFieldDecorator(`storage${v.index}`, {
                    initialValue: v.storage,
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <Select style={{ width: 450 }} onChange={(value: any) => { this.storageChange(value, v.name); }}>
                      <Option value={'true'}>已入库</Option>
                      <Option value={'false'}>未入库</Option>
                    </Select>
                  )}
                </FormItem>
              }
              {v.iptype !== 4 &&
                <FormItem {...formItemLayout} label="广播类型">
                  {getFieldDecorator(`broadcast_type${v.index}`, {
                    initialValue: v.broadcast_type,
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <Select style={{ width: 450 }} onChange={(value: any) => { this.broadcasttypeChange(value, v.name); }}>
                      {IPBroadcastoptions}
                    </Select>
                  )}
                </FormItem>
              }
              {v.iptype !== 4 &&
                <FormItem {...formItemLayout} label="广播地点">
                  {getFieldDecorator(`broadcast_location${v.index}`, {
                    initialValue: v.broadcast_location,
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <Select style={{ width: 450 }} onChange={(value: any) => { this.broadcastlocationChange(value, v.name); }} mode={v.broadcast_type === 2 ? 'multiple' : 'default'}>
                      {dataCenterListoptions}
                    </Select>
                  )}
                </FormItem>
              }
              {(v.iptype === 2 || v.iptype === 4) &&
                <FormItem {...formItemLayout} label="业务类型">
                  {getFieldDecorator(`business_type${v.index}`, {
                    initialValue: v.business_type,
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <Select style={{ width: 450 }} onChange={(value: any) => { this.businesstypeChange(value, v.name); }}>
                      {IPBroadcastoptions}
                    </Select>
                  )}
                </FormItem>
              }
              {(v.iptype === 2 || v.iptype === 4) &&
                <FormItem {...formItemLayout} label="业务地点">
                  {getFieldDecorator(`business_location${v.index}`, {
                    initialValue: v.business_location,
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <Select
                      style={{ width: 450 }}
                      // labelInValue={true}
                      onChange={(value: any, option: any) => { this.businesslocationChange(value, v.name, option); }}
                      mode={v.business_type === 2 ? 'multiple' : 'default'}
                    >
                      {dataCenterListoptions}
                    </Select>
                  )}
                </FormItem>
              }
              {(v.iptype === 2 || v.iptype === 4) &&
                <FormItem {...formItemLayout} label="网关设备">
                  {getFieldDecorator(`gateway_info${v.index}`, {
                    initialValue: v.gateway_info,
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <div>
                      {getGateWaytag(v)}
                      <Tag onClick={() => this.showGateWaySelectedModal(v)} style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <Icon type="search" /> 选择网关设备
                      </Tag>
                    </div>
                  )}
                </FormItem>
              }
              <FormItem {...formItemLayout} label="备注">
                {getFieldDecorator(`note${v.index}`, {
                  initialValue: v.note,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <TextArea
                    placeholder="请输入备注"
                    autoSize={true}
                    style={{ width: 450 }}
                    onChange={(e: any) => { this.noteChange(e, v.name); }}
                  // value={v.note}
                  />
                )}
              </FormItem>
              {v.iptype === 2 &&
                <FormItem {...formItemLayout} label="一致性">
                  {getFieldDecorator(`consistency${v.index}`, {
                    initialValue: v.consistency,
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="close" />}
                      defaultChecked={false}
                      disabled={true}
                      checked={(v.business_location && v.broadcast_location) && v.business_location === v.broadcast_location ? true : false}
                    />
                  )}
                </FormItem>
              }
              {v.iptype === 4 &&
                <FormItem {...formItemLayout} label="一致性">
                  {getFieldDecorator(`consistency${v.index}`, {
                    initialValue: v.consistency,
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="close" />}
                      defaultChecked={false}
                      disabled={true}
                      checked={v.consistency}
                    />
                  )}
                </FormItem>
              }
              <FormItem {...formItemLayout} label="资源类型">
                {getFieldDecorator(`resource_type${v.index}`, {
                  initialValue: v.resource_type ? v.resource_type : null,
                  rules: [
                    // { required: true, message: '请填写属性标识!' },
                  ],
                })(
                  <Select style={{ width: 450 }} onChange={(value: any) => { this.resourceTypeChange(value, v.name); }}>
                    {ResourceTypeOptions}
                  </Select>
                )}
              </FormItem>
              {v.resource_type !== 1 && v.resource_type !== null &&
                <FormItem {...formItemLayout} label="资源归属">
                  {getFieldDecorator(`owner_domains${v.index}`, {
                    initialValue: v.owner_domains ? v.owner_domains : [],
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <div>
                      {getOwnerDomainstag(v)}
                      <Tag onClick={() => showDomainListModal(v)} style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <Icon type="search" /> 选择资源归属
                      </Tag>
                    </div>
                  )}
                </FormItem>
              }
              {v.iptype === 3 &&
                <FormItem {...formItemLayout} label="IP分割">
                  {getFieldDecorator(`ipfenge${v.index}`, {
                    // initialValue: v.owner_domains,
                    rules: [
                      // { required: true, message: '请填写属性标识!' },
                    ],
                  })(
                    <Input style={{ width: 450 }} onChange={(e: any) => { this.ipfengeChange(e, v.name); }} />
                  )}
                  <Button type="primary" style={{ marginLeft: 170 }} onClick={() => { this.postIpsSplit2(v.name); }}>生成</Button>
                </FormItem>
              }
              {this.hasChildIPs(v.name) &&
                <Tabs >
                  {renderChildIPTabs(v.name)}
                </Tabs>
              }
            </TabPane >
          );
        }

      });
    }
    /**
     * 关闭资源归属模态窗
     */
    const onDomainTableCancel = () => {
      this.setState({
        showDomainListTable: false,
        showPLDomainListTable: false,
        hasSelected: null
      });
    };
    const getOwnerDomainstagPL = () => {
      let taglist: any = [];
      if (this.state.plowner_domainsBOJ && this.state.plowner_domainsBOJ && this.state.plowner_domainsBOJ.length > 0) {
        for (let index = 0; index < this.state.plowner_domainsBOJ.length; index++) {
          const element = this.state.plowner_domainsBOJ[index];
          taglist.push(
            <Tag
              key={element.name}
              closable={true}
              onClose={(e: any) => {
                e.preventDefault();
                this.removeTagsPL(element.id);
              }}
            >
              {element.name}
            </Tag>
          );
        }
      }
      return taglist;
    };
    const getGateWaytagpl = () => {
      let taglist: any = [];
      console.log(this.state.plgateway_infoOBJ);
      if (this.state.businesstype === 2) {
        if (this.state.plgateway_infoOBJ && this.state.plgateway_infoOBJ && this.state.plgateway_infoOBJ.length > 0) {
          for (let index = 0; index < this.state.plgateway_infoOBJ.length; index++) {
            const element = this.state.plgateway_infoOBJ[index];
            taglist.push(
              <Tag
                key={element.name}
                closable={true}
                onClose={(e: any) => {
                  e.preventDefault();
                  this.removeGateWayTagsPL(element.id);
                }}
              >
                {element.name}
              </Tag>
            );
          }
        }
      }
      if (this.state.businesstype === 1) {
        if (this.state.plgateway_infoOBJ && this.state.plgateway_infoOBJ) {
          taglist.push(
            <Tag
              key={this.state.plgateway_infoOBJ.name}
              closable={true}
              onClose={(e: any) => {
                e.preventDefault();
                this.removeGateWayTagsPL(this.state.plgateway_infoOBJ.id);
              }}
            >
              {this.state.plgateway_infoOBJ.name}
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
              title={buquanRecord !== null ? '补全' + buquanRecord.ip + '/' + buquanRecord.netmask : ''}
            // subTitle="This is a subtitle"
            >
              {this.state.IPlist && this.state.IPlist.length > 0 &&
                <Row>
                  <Col span={4} offset={20}>
                    <Button type="primary" icon="diff" onClick={() => { this.onOpen(); }} >批量操作</Button>
                  </Col>
                </Row>
              }
              {this.state.IPlist && this.state.IPlist.length > 0 &&
                <div>
                  <Divider orientation="left">业务IP</Divider>
                  <Tabs tabPosition={'left'} type="editable-card" hideAdd={true} onEdit={this.onEdit}>
                    {TabPaneLists}
                  </Tabs>
                </div>
              }
              <Divider />
              <Row style={{ textAlign: 'center' }}>
                <Button onClick={() => moduleAction.closeEditHT()} >取消</Button>&nbsp;&nbsp;
                <Button type="primary" onClick={() => { this.postAddIp(); }} >提交</Button>
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
                  resourceType={this.state.currentresourceType}
                  onSelectChange={this.ownerdomainsChange2}
                  hasSelected={this.state.hasSelected}
                />
              </Modal>
            }
            {
              this.state.showPLDomainListTable &&
              <Modal
                title="资源归属列表"
                visible={this.state.showPLDomainListTable}
                onOk={onDomainTableCancel}
                maskClosable={false}
                onCancel={onDomainTableCancel}
                centered={true}
                destroyOnClose={true}
                width={1000}
              >
                <OwnerdomainsSelectModal
                  resourceType={this.state.plresourceType}
                  onSelectChange={this.ownerdomainsChange2pl}
                  hasSelected={this.state.hasSelected}
                />
              </Modal>
            }
            {
              this.state.showGateWaySelectTable &&
              <Modal
                title="网管设备信息列表"
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
                    city={this.state.currentGateWayObj.business_location}
                    selectedRowKeys={this.state.currentGateWayObj.gateway_info}
                  />
                }
              </Modal>
            }
            {
              this.state.showGateWaySelectTablePL &&
              <Modal
                title="网管设备信息列表"
                visible={this.state.showGateWaySelectTablePL}
                onOk={this.hideGateWaySelectedModalpl}
                maskClosable={false}
                onCancel={this.hideGateWaySelectedModalpl}
                centered={true}
                destroyOnClose={true}
                width={1200}
              >
                {
                  <NetElementListModal
                    onSelect={this.onGateWayPLSelect}
                    multiple={this.state.businesstype === 2 ? true : false}
                    city={this.state.plbusinessLocation}
                    selectedRowKeys={this.state.plgateway_info}
                  />
                }
              </Modal>
            }
          </div>
        </div>
        <Drawer
          title={'批量操作'}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={700}
          maskClosable={false}
        >
          <FormItem {...formItemLayout} label="启用状态" >
            {getFieldDecorator('plusing', {
              // initialValue: detail ? detail.using ? 'true' : 'false' : null,
              rules: [
                // { required: true, message: '请填写属性标识!' },
              ],
            })(
              <Select style={{ width: 450 }}>
                <Option value={'true'}>启用</Option>
                <Option value={'false'}>未启用</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="入库状态">
            {getFieldDecorator('plstorage', {
              // initialValue: detail ? detail.storage ? 'true' : 'false' : null,
              rules: [
                // { required: true, message: '请填写属性标识!' },
              ],
            })(
              <Select style={{ width: 450 }} >
                <Option value={'true'}>已入库</Option>
                <Option value={'false'}>未入库</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="广播类型">
            {getFieldDecorator('plbroadcast_type', {
              // initialValue: detail ? detail.broadcast_type : null,
              rules: [
                // { required: true, message: '请填写属性标识!' },
              ],
            })(
              <Select style={{ width: 450 }} onChange={(value: any) => { this.plbroadcasttypeChange(value); }} >
                {IPBroadcastoptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="广播地点">
            {getFieldDecorator('plbroadcast_location', {
              // initialValue: (detail && detail.broadcastlocation !== null) ? detail.broadcastlocation : null,
              rules: [
                // { required: true, message: '请填写属性标识!' },
              ],
            })(
              <Select style={{ width: 450 }} mode={this.state.broadcasttype === 2 ? 'multiple' : 'default'} >
                {dataCenterListoptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="业务类型">
            {getFieldDecorator('plbusiness_type', {
              // initialValue: detail ? detail.business_type : null,
              rules: [
                // { required: true, message: '请填写属性标识!' },
              ],
            })(
              <Select style={{ width: 450 }} onChange={(value: any) => { this.plbusinesstypeChange(value); }}>
                {IPBroadcastoptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="业务地点">
            {getFieldDecorator('plbusiness_location', {
              // initialValue: detail ? detail.businesslocation : null,
              rules: [
                // { required: true, message: '请填写属性标识!' },
              ],
            })(
              <Select style={{ width: 450 }} onChange={(value: any) => { this.plbusinesslocationChange(value); }} mode={this.state.businesstype === 2 ? 'multiple' : 'default'}>
                {dataCenterListoptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="网关设备">
            {getFieldDecorator('plgateway_info', {
              // initialValue: (detail && detail.gateway_info) ? detail.gateway_info.ids : null,
              rules: [
                // { required: true, message: '请填写属性标识!' },
              ],
            })(
              <div>
                {getGateWaytagpl()}
                <Tag onClick={() => this.showGateWaySelectedModalpl()} style={{ background: '#fff', borderStyle: 'dashed' }}>
                  <Icon type="search" /> 选择网关设备
            </Tag>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('plnote', {
              // initialValue: detail ? detail.note : null,
              rules: [
                // { required: true, message: '请填写属性标识!' },
              ],
            })(
              <TextArea
                placeholder="请输入备注"
                // autoSize={true}
                style={{ width: 450, maxWidth: '200%' }}
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="资源类型">
            {getFieldDecorator(`plresource_type`, {
              rules: [
                // { required: true, message: '请填写属性标识!' },
              ],
            })(
              <Select style={{ width: 450 }} onChange={(value: any) => { this.plresourceTypeChange(value); }}>
                {ResourceTypeOptions}
              </Select>
            )}
          </FormItem>
          {this.state.plresourceType !== 1 && this.state.plresourceType !== null &&
            <FormItem {...formItemLayout} label="资源归属">
              {getFieldDecorator('plowner_domains', {
                // initialValue: detail ? detail.owner_domains : [],
                rules: [
                  // { required: true, message: '请填写属性标识!' },
                ],
              })(
                <div>
                  {getOwnerDomainstagPL()}
                  <Tag onClick={showDomainListModalPL} style={{ background: '#fff', borderStyle: 'dashed' }}>
                    <Icon type="search" /> 选择资源归属
              </Tag>
                </div>
              )}
            </FormItem>
          }
          <Divider />
          <Row style={{ textAlign: 'center' }}>
            <Button onClick={() => this.onClose()} >取消</Button>&nbsp;&nbsp;
            <Button type="primary" onClick={() => { this.plActionCommit(); }} >确定</Button>
          </Row>
        </Drawer>
      </div >
    );
  }
}

export default BQaddIpManeger;