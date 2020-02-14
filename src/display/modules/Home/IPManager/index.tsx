import * as React from 'react';
import { IPManage, datacenter, netelement } from 'src/api';
import CurrentPage from 'src/display/components/CurrentPage';
import CommonButton from 'src/display/components/CommonButton';
import AddIpManeger from './addIpManeger';
import AddResoruce from './addResoruce';
import moment from 'moment';
import Edit from './edit';
import EditYW from './editYW';
import EditFD from './editFD';
import EditZY from './editZY';
import BQaddIpManeger from './BQaddIpManeger';
import Resource from './resource';
import {
  Button, Tabs, Table, Tooltip, Row, message, Drawer, Descriptions, Form, Input,
  Modal, notification, Icon, Tag, Popconfirm, Col, Divider, Select
} from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  list: Array<any>;
  IPType: Array<any>;
  IPBroadcast: Array<any>;
  listTwo: Array<any>;
  listThree: Array<any>;
  expandedRowKeys: Array<any>;
  expandedRowKeysThree: Array<any>;
  DatadictNetelement: any;
  secondData: {};
  thirddData: {};
  loading: boolean;
  visible: boolean;
  addvisible: boolean;
  gatewayInfo: any;
  moduleAction: any;
  IpmanageContracts: any;
  dataCenterList: any;
  DomainListUnLoginList: any;
  detailId: any;
  HTvisible: boolean;
  YWvisible: boolean;
  ZYvisible: boolean;
  FDvisible: boolean;
  LBvisible: boolean;
  BQvisible: boolean;
  tabsKey: any;
  HTlist: any;
  ContractTypes: any;
  ContractUnits: any;
  IPduanDrawer: any;
  IPvisible: boolean;
  addvisibleAddHT: boolean;
  nations: any;
  city: any;
  ResourceType: any;
  allCitys: any;
  buquan: any;
  buquanRecord: any;
  allVendor: any;
  allOs: any;
  allVerson: any;
  allRoom: any;
  allFloor: any;
}
/**
 * ISPManager
 */
class IPManager extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      list: [],
      tabsKey: '1',
      IPType: [],
      IPBroadcast: [],
      listTwo: [],
      listThree: [],
      secondData: {},
      thirddData: {},
      loading: false,
      expandedRowKeys: [],
      expandedRowKeysThree: [],
      HTlist: [], // 合同列表
      DatadictNetelement: [], // 所有网元设备
      addvisible: false, // 新建开关
      visible: false, // 抽屉开关
      gatewayInfo: {}, // 网关设备对象
      IpmanageContracts: null, // 合同编号
      dataCenterList: [], // 广播地点/业务地点
      DomainListUnLoginList: [], // 资源归属
      detailId: null, // 单个详情
      LBvisible: true, // 列表页面
      HTvisible: false, // 合同IP编辑
      YWvisible: false, // 业务IP编辑
      ZYvisible: false, // 资源IP编辑
      FDvisible: false, // 分段IP编辑
      BQvisible: false, // 补全
      addvisibleAddHT: false, // 新建合同
      IPvisible: false, // IP段抽屉
      ContractUnits: [], // 货币单位
      ContractTypes: [], // 资源类型
      IPduanDrawer: {}, // ip段抽屉数据
      nations: null, // 所有国家
      city: null, // 所有城市
      allCitys: [], // 所有城市
      ResourceType: null, // 资源类型
      buquan: null, // 资源类型
      buquanRecord: null, // 补全的对象
      allVendor: null, // 
      allOs: null, // 
      allVerson: null, // 
      allFloor: null, // 
      allRoom: null, // 
      moduleAction: {
        getList: this.getList.bind(this),
        closeAdd: this.closeAdd.bind(this),
        closeEditHT: this.closeEditHT.bind(this),
        changeexpandedRowKeys: this.changeexpandedRowKeys.bind(this),
        getChiildListThree: this.getChiildListThree.bind(this),
        deleteIpSement: this.deleteIpSement.bind(this),
        getHTlist: this.getHTlist.bind(this),
        getNetelement: this.getNetelement.bind(this),
      }

    };
  }

  /**
   * 采购渠道
   */
  purchaseChannelChoices = [
    { value: 1, label: '代购' },
    { value: 2, label: '直签' },
  ];

  UNSAFE_componentWillMount() {
    this.getList();
    this.getIPTypeList();
    this.getIpmanagerSegmentipsBroadcast();
    this.getAllDatadictNetelement();
    this.getIpmanageContracts();
    // this.getDataCenterList();
    this.getDomainListUnLogin();
    this.getHTlist();
    this.getContractUnit();
    this.getContractType();
    this.getNations();
    this.getResourceType();
    this.getVendorList();
    this.getOSList();
    this.getVersionList();
    this.getRoomList();
    this.getFloorList();
  }

  /**
   * 获取IPV4列表
   */
  getList = async (param?: any) => {
    let res = await IPManage.getList(param ? param : {});
    console.log('IPv4列表lists::', res);
    if (!res.code) {
      return;
    }
    if (res) {
      console.log(res.results.data);
      this.setState({ list: res.results.data });
    } else {
      message.error('未获取到数据!');
    }
  }
  /**
   * 获取IPV4二级子tabel
   */
  getChiildList = async (id: string) => {
    let res = await IPManage.getChildSegmentipsList(id, {});
    console.log('IPv4二级列表lists::', res);
    if (!res.code) {
      return res.code;
    } else if (res) {
      if (res.results.data.length <= 0) {
        return false;
      } else {
        this.setState({ listTwo: res.results.data });
        return true;
      }
    } else {
      return false;
    }
  }
  /**
   * 获取IPV4三级子tabel
   */
  getChiildListThree = async (id: string) => {
    let res = await IPManage.getChildSegmentipsList(id, {});
    console.log('IPv4三级列表lists::', res);
    if (!res.code) {
      return res.code;
    } else if (res) {
      console.log(res.results.data);
      if (res.results.data.length <= 0) {
        return false;
      } else {
        this.setState({ listThree: res.results.data });
        return true;
      }
    } else {
      return false;
    }
  }

  /**
   * 获取所有网关设备
   */
  getAllDatadictNetelement = async () => {
    let res = await IPManage.getAllDatadictNetelement({});
    console.log('所有网关设备列表lists::', res);
    if (!res.code) {
      return;
    }
    if (res) {
      this.setState({ DatadictNetelement: res.results }, () => {
        console.log(this.state.DatadictNetelement);
      });
    }
  }
  // 获取网关设备obj
  getDatadictNetelementName = (id: any) => {
    let obj = '';
    let data = this.state.DatadictNetelement;
    if (data && data.length > 0) {
      data.forEach((v: any) => {
        if (v.id === id) {
          obj = v;
        }
      });
    }
    return obj;
  }
  // 获取网关设备obj
  getDatadictNetelementNameByIds = (ids: Array<any>) => {
    let obj: any = [];
    if (ids && ids.length > 0) {
      ids.forEach((v: any) => {
        obj.push(this.getDatadictNetelementName(v));
      });
    }
    return obj;
  }
  /**
   * 获取数据中心列表(广播地点/业务地点)
   */
  getDataCenterList = async () => {
    const res = await datacenter.getList({
      page: 1,
      page_size: 1000
    });
    if (res.code) {
      let list = this.distinct(res.results.data);
      this.setState({
        dataCenterList: list,
      }, () => {
        console.log('业务地点/广播地点::', this.state.dataCenterList);
      });
    }
  }
  // 针对数据中心列表去重复
  distinct = (arr: any) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        if (arr[i].city === arr[j].city) {
          arr.splice(j, 1);
          len--;
          j--;
        }
      }
    }
    return arr;
  }
  /**
   * 获取资源归属
   */
  getDomainListUnLogin = async () => {
    const res = await IPManage.getDomainListUnLogin({});
    if (res.code) {
      this.setState({
        DomainListUnLoginList: res.results.data,
      }, () => {
        console.log('资源归属::', this.state.DomainListUnLoginList);
      });
    }
  }

  /**
   * 获取IP类型
   */
  getIPTypeList = async () => {
    let res = await IPManage.getIpmanagerSegmentipsIptype({});
    console.log('IP类型列表lists::', res);
    if (!res.code) {
      return;
    }
    if (res) {
      this.setState({ IPType: res.results.data });
    }

  }
  /**
   * 广播类型列表
   */
  getIpmanagerSegmentipsBroadcast = async () => {
    let res = await IPManage.getIpmanagerSegmentipsBroadcast({});
    console.log('广播类型列表lists::', res);
    if (!res.code) {
      return;
    }
    if (res) {
      this.setState({ IPBroadcast: res.results.data });
    }

  }
  callback = (key: any) => {
    console.log(key);
    this.setState({ tabsKey: key });
  }
  // 获取IP类型名称
  getIPTypeName = (id: any) => {
    let name = '';
    let iptype = this.state.IPType;
    if (iptype && iptype.length > 0) {
      iptype.forEach((v: any) => {
        if (v.id === id) {
          name = v.name;
        }
      });
    }
    return name;
  }
  // 获取广播类型名称
  getIPBroadcastName = (id: any) => {
    let name = '';
    let IPBroadcast = this.state.IPBroadcast;
    if (IPBroadcast && IPBroadcast.length > 0) {
      IPBroadcast.forEach((v: any) => {
        if (v.id === id) {
          name = v.name;
        }
      });
    }
    return name;
  }
  // 删除
  deleteIpSement = async (id: any) => {
    let res = await IPManage.deleteIpSement(id, {});
    console.log(res);
    if (res.code) {
      message.success('删除成功!');
      this.getList();
      this.setState({ expandedRowKeys: [], expandedRowKeysThree: [], secondData: {}, thirddData: {} });
    } else {
      message.error(res.msg);
    }

  }

  changeexpandedRowKeys = (list: any) => {
    this.setState({ expandedRowKeys: list });
  }
  changeexpandedRowKeysThree = (list: any) => {
    this.setState({ expandedRowKeysThree: list });
  }
  // 抽屉 开关
  showDrawer = async (element: any) => {
    console.log(element);
    const { nations, allCitys, allVendor, allOs, allVerson, allFloor, allRoom } = this.state;
    let nationName = '';
    if (element.nation && nations && nations.length > 0) {
      for (let index = 0; index < nations.length; index++) {
        const e = nations[index];
        if (e.id === element.nation) {
          nationName = e.nation;
        }
      }
    }
    let cityName = '';
    if (element.city && allCitys && allCitys.length > 0) {
      for (let index = 0; index < allCitys.length; index++) {
        const e = allCitys[index];
        if (e.id === element.city) {
          cityName = e.city;
        }
      }
    }
    let roomName = '';
    if (element.room && allRoom && allRoom.length > 0) {
      for (let index = 0; index < allRoom.length; index++) {
        const e = allRoom[index];
        if (e.id === element.room) {
          roomName = e.room;
        }
      }
    }
    let floorName = '';
    if (element.floor && allFloor && allFloor.length > 0) {
      for (let index = 0; index < allFloor.length; index++) {
        const e = allFloor[index];
        if (e.id === element.floor) {
          floorName = e.floor;
        }
      }
    }
    let vendorName = '';
    if (element.vendor && allVendor && allVendor.length > 0) {
      for (let index = 0; index < allVendor.length; index++) {
        const e = allVendor[index];
        if (e.id === element.vendor) {
          vendorName = e.vendor;
        }
      }
    }
    let osName = '';
    if (element.os && allOs && allOs.length > 0) {
      for (let index = 0; index < allOs.length; index++) {
        const e = allOs[index];
        if (e.id === element.os) {
          osName = e.os;
        }
      }
    }
    let versonName = '';
    let supportName = [];
    if (element.version && allVerson && allVerson.length > 0) {
      for (let index = 0; index < allVerson.length; index++) {
        const e = allVerson[index];
        if (e.id === element.version) {
          versonName = e.version;
          if (e.protocols_support && e.protocols_support.length > 0) {
            for (let index = 0; index < e.protocols_support.length; index++) {
              const s = e.protocols_support[index];
              supportName.push(s.name);
            }
          }
        }
      }
    }
    element.nationName = nationName;
    element.cityName = cityName;
    element.roomName = roomName;
    element.floorName = floorName;
    element.vendorName = vendorName;
    element.osName = osName;
    element.versonName = versonName;
    element.supportName = supportName.join(',');
    this.setState({
      visible: true,
      gatewayInfo: element
    });
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  }
  // IP段抽屉 开关
  showIPDrawer = (element: any) => {
    console.log(element);
    this.setState({
      IPvisible: true,
      IPduanDrawer: element
    });
  }

  iponClose = () => {
    this.setState({
      IPvisible: false,
    });
  }
  // 获取抽屉里面的Protocl Support
  getProtoclSupport = (protocolsSupport: any) => {
    let names: any = [];
    if (protocolsSupport && protocolsSupport.length > 0) {
      protocolsSupport.forEach((element: any) => {
        names.push(element.name);
      });
    }
    return names.join(',');
  }
  // 打开新建组件
  openAdd = () => {
    this.setState({ addvisible: true, LBvisible: false });
  }
  // 关闭新建组件
  closeAdd = () => {
    this.setState({ addvisible: false, LBvisible: true }, () => {
      this.getList();
    });
  }
  // 打开新建合同
  openAddHT = () => {
    this.setState({ addvisibleAddHT: true });
  }
  // 打开新建合同
  closeAddHT = () => {
    this.setState({ addvisibleAddHT: false });
  }

  /**
   * 获取合同编号
   */
  getIpmanageContracts = async () => {
    let res = await IPManage.getIpmanageContracts({});
    if (!res.code) {
      return;
    }
    if (res) {
      console.log(res.results);
      this.setState({ IpmanageContracts: res.results.data });
    }
  }
  // 编辑
  edit = async (record: any) => {
    if (record) {
      if (record.ip_type === 1) {
        this.setState({ HTvisible: true, detailId: record.id, LBvisible: false });
      }
      if (record.ip_type === 2) {
        this.setState({ YWvisible: true, detailId: record.id, LBvisible: false });
      }
      if (record.ip_type === 3) {
        this.setState({ ZYvisible: true, detailId: record.id, LBvisible: false });
      }
      if (record.ip_type === 4) {
        this.setState({ FDvisible: true, detailId: record.id, LBvisible: false });
      }

    }
  }
  // 关闭合同IP
  closeEditHT = () => {
    this.setState({
      HTvisible: false,
      YWvisible: false,
      ZYvisible: false,
      FDvisible: false,
      detailId: null,
      LBvisible: true,
      BQvisible: false
    }, () => {
      this.getList();
    });
  }
  // 获取合同列表
  getHTlist = async (param?: any) => {
    let res = await IPManage.getIpmanageContracts(param ? param : {});
    if (!res.code) {
      return;
    }
    if (res) {
      console.log('合同列表', res.results);
      this.setState({ HTlist: res.results.data });
    }
  }
  // 获取资源类型
  getContractType = async () => {
    let res = await IPManage.getContractType({});
    if (!res.code) {
      return;
    }
    if (res) {

      this.setState({ ContractTypes: res.results.data }, () => {
        console.log('资源类型', res.results);
      });
    }
  }
  // 获取货币单位
  getContractUnit = async () => {
    let res = await IPManage.getContractUnit({});
    if (!res.code) {
      return;
    }
    if (res) {
      this.setState({ ContractUnits: res.results.data }, () => {
        console.log('货币单位', res.results);
      });
    }
  }
  // 新增合同
  addNewHT = () => {
    this.props.form.validateFields(['contract_code', 'business_instance', 'resource_type',
      'authorization_instance', 'current_start_date', 'current_end_date', 'remind', 'note',
      'monetary_unit', 'monthly_payment'], async (err: boolean, values: any) => {
        console.log(values);
        if (err) {
          message.warning('校验有误!');
          return;
        }
        let param = {
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
        let res = await IPManage.postIpmanageContracts(param);
        if (!res.code) {
          return;
        }
        if (res.code) {
          this.getHTlist();
          this.closeAddHT();
        }
      });
  }
  // 获取资源归属者
  getownerdomains = (ownerdomains: any) => {
    let names: any = [];
    let DomainListUnLoginList = this.state.DomainListUnLoginList;
    if (DomainListUnLoginList && DomainListUnLoginList.length > 0 && ownerdomains && ownerdomains.length > 0) {
      ownerdomains.forEach((element: any) => {
        DomainListUnLoginList.forEach((element2: any) => {
          if (element === element2.id) {
            names.push(element2.name);
          }
        });
      });
    }
    if (names.length <= 0) {
      names.push('-');
      return names.join(',');
    } else {
      return names.join(',');
    }
  }
  IPduanGetBroadcastLocation = () => {
    let names: any = [];
    if (this.state.IPduanDrawer.broadcast_location !== null && this.state.IPduanDrawer.broadcast_location.length > 0) {
      for (let index = 0; index < this.state.IPduanDrawer.broadcast_location.length; index++) {
        const element = this.state.IPduanDrawer.broadcast_location[index];
        names.push(<Row key={'ipduan' + index}>{element.nation + '-' + element.city}</Row>);
      }
    }
    return names;
  }
  IPduanGetBussinessLocation = () => {
    let names: any = [];
    if (this.state.IPduanDrawer.business_location !== null && this.state.IPduanDrawer.business_location.length > 0) {
      for (let index = 0; index < this.state.IPduanDrawer.business_location.length; index++) {
        const element = this.state.IPduanDrawer.business_location[index];
        names.push(<Row key={'ipduanb' + index}>{element.nation + '-' + element.city}</Row>);
      }
    }
    return names;
  }
  IPduanGetWayInfo = () => {
    let list: any = [];
    if (this.state.IPduanDrawer.gateway_info && this.state.IPduanDrawer.gateway_info.ids && this.state.IPduanDrawer.gateway_info.ids.length > 0) {
      let objs = this.getDatadictNetelementNameByIds(this.state.IPduanDrawer.gateway_info.ids);
      objs.forEach((element: any, index: number) => {
        list.push(
          <Row key={'ipduanc' + index}>
            {element.name}
          </Row>
        );
      });
      return list;
    } else {
      return list;
    }
  }
  // IP段抽屉获取合同名称
  getHtname = (id: any) => {
    let HTlist = this.state.HTlist;
    let name = '';
    if (HTlist && HTlist.length > 0) {
      HTlist.forEach((v: any) => {
        if (v.id === id) {
          name = v.contract_code;
        }
      });
    }
    return name;
  }
  // 获取所有国家
  getNations = async () => {
    let res = await IPManage.getNations({});
    console.log('所有国家列表lists::', res);
    if (!res.code) {
      return;
    }
    if (res) {
      if (res.results && res.results.length > 0) {
        for (let index = 0; index < res.results.length; index++) {
          const element = res.results[index];
          let citys = await this.getCitys(element.id);
          element.citys = citys;
        }
      }
      this.setState({ nations: res.results }, () => {
        console.log(this.state.nations);
      });
    }
  }
  // 获取资源类型
  getResourceType = async () => {
    let res = await IPManage.getResourceType({});
    console.log('资源类型列表ResourceType::', res.results);
    if (!res.code) {
      return;
    }
    if (res) {
      this.setState({ ResourceType: res.results });
    }
  }
  // 获取对应城市
  getCitys = async (id: any) => {
    let res = await IPManage.getCitys({ nation: id });
    let allCitys = this.state.allCitys;
    allCitys = allCitys.concat(res.results);
    this.setState({ allCitys }, () => {
      console.log('所有城市', this.state.allCitys);
    });
    console.log('城市列表lists::', res);
    if (!res.code) {
      return;
    }
    if (res) {
      return res.results;
      // this.setState({ city: res.results });
    } else {
      return null;
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
  // 补全
  getIpmanagerAdd = async (id: any, record: any) => {
    let res = await IPManage.getIpmanagerAdd(id, {});
    if (res) {
      if (res.results.data.length > 0) {
        this.setState({ buquan: res.results, BQvisible: true, LBvisible: false, buquanRecord: record });
      } else {
        message.info('不需要补全!');
      }
    }
  }
  serchIPv4 = () => {
    this.props.form.validateFields(['IPserch', 'broadcastTypeSerch', 'creatorDomainSerch'], async (err: any, value: any) => {
      console.log(value);
      let param: {
        ip__icontains?: any;
        broadcast_type?: any;
        creator_domain?: any;
      } = {
        // ip__icontains: value.IPserch,
        broadcast_type: value.broadcastTypeSerch,
        creator_domain: value.creatorDomainSerch,
      };
      if (value.IPserch) {
        param.ip__icontains = value.IPserch;
      }
      this.getList(param);
      this.changeexpandedRowKeys([]);
      this.changeexpandedRowKeysThree([]);
    });
  }
  // 获取city对应的机房
  getRooms = async (cityID: any) => {
    let res = await datacenter.getRoomList({ city: cityID });
    console.log('city对应的机房::', res);
    if (!res.code) {
      return;
    }
    if (res.code && res.results.length > 0) {
      let names: any = [];
      for (let index = 0; index < res.results.length; index++) {
        const element = res.results[index];
        names.push(element.room);
      }
      return names.join(',');
    } else {
      return '';
    }
  }
  // 获取city对应的机房
  getFloors = async (roomID: any) => {
    let res = await datacenter.getFloorList({ room: roomID });
    console.log('room对应的楼层:', res);
    if (!res.code) {
      return;
    }
    if (res.code && res.results.length > 0) {
      let names: any = [];
      for (let index = 0; index < res.results.length; index++) {
        const element = res.results[index];
        names.push(element.floor);
      }
      return names.join(',');
    } else {
      return '';
    }
  }
  // 获取所有vendor
  getVendorList = async () => {
    let res = await netelement.getVendorList();
    console.log('所有vendor:', res);
    if (res.code) {
      this.setState({ allVendor: res.results });
    }
  }
  // 获取OS数据列表
  getOSList = async () => {
    let res = await netelement.getOsList();
    if (!res.code) {
      return;
    }
    console.log('所有OS:', res);
    if (res) {
      this.setState({
        allOs: res.results,
      });
    }
  }

  // 获取Version数据列表
  getVersionList = async () => {
    let res = await netelement.getVersionList();
    if (!res.code) {
      return;
    }
    console.log('所有verson:', res);
    if (res) {
      this.setState({
        allVerson: res.results,
      });
    }
  }
  // 获取机房数据列表
  getRoomList = async () => {
    let res = await datacenter.getRoomList();
    if (!res.code) {
      return;
    }
    console.log('所有机房:', res);
    if (res) {
      this.setState({
        allRoom: res.results,
      });
    }
  }

  // 获取楼层数据列表
  getFloorList = async () => {
    let res = await datacenter.getFloorList();
    if (!res.code) {
      return;
    }
    console.log('所有楼层:', res);
    if (res) {
      this.setState({
        allFloor: res.results,
      });
    }
  }
  render() {
    const { list } = this.state;
    const column = [
      {
        title: 'IP段',
        key: 'ip',
        dataIndex: 'ip',
        width: 250,
        render: (text: any, record: any) => {
          let us: any;
          let st: any;
          if (record.using) {
            us = <Tag color="green">已启用</Tag>;
          } else if (!record.using) {
            us = <Tag color="red">已禁用</Tag>;
          }
          if (record.storage) {
            st = <Tag color="green">已入库</Tag>;
          } else if (!record.storage) {
            st = <Tag color="red">未入库</Tag>;
          }
          return <span><a onClick={() => { this.showIPDrawer(record); }}>{record.ip}/{record.netmask}</a>&nbsp;{us}{st}</span>;
        }
      },
      {
        title: 'IP类型',
        key: 'ip_type',
        dataIndex: 'ip_type',
        width: 100,
        render: (text: any, record: any) => {
          let name = this.getIPTypeName(record.ip_type);
          return <span>{name}</span>;
        }
      },

      {
        title: '广播类型/地点',
        key: 'broadcast_type',
        dataIndex: 'broadcast_type',
        width: 200,
        render: (text: any, record: any) => {
          let name = this.getIPBroadcastName(record.broadcast_type);
          let bl: any;
          if (record.broadcast_location !== null && record.broadcast_location.length > 0) {
            let names = [];
            let name = '';
            for (let index = 0; index < record.broadcast_location.length; index++) {
              const element = record.broadcast_location[index];
              names.push(element.nation + '-' + element.city);
              if (index === 0) {
                name = element.nation + '-' + element.city + '...';
              }
            }
            bl = <Tooltip placement="topLeft" title={names.join(',')}><span >{name}</span></Tooltip>;
          } else {
            bl = null;
          }
          return <div><Row>{name}</Row><Row>{bl}</Row></div>;
        }
      },
      {
        title: '资源创建者/资源归属者',
        key: 'owner_domains',
        dataIndex: 'owner_domains',
        width: 200,
        render: (text: any, record: any) => {
          let name = this.getownerdomains([parseInt(record.creator_domain, 10)]);
          let names = this.getownerdomains(record.owner_domains);
          return <span>{name}/{names}</span>;
        }
      },
      {
        title: '备注',
        key: 'note',
        dataIndex: 'note',
        width: 200,
        render: (text: any, record: any) => {
          if (record.note !== null && record.note.length > 0) {
            return <Tooltip placement="topLeft" title={record.note}><span >{record.note}</span></Tooltip>;
          }
          return null;
        },
      },
      {
        title: '操作',
        key: 'actions',
        dataIndex: 'actions',
        width: 250,
        render: (text: any, record: any) => (
          <span>
            {/* <Row> */}
            <a href="javascript:;" type="primary" onClick={() => this.edit(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除吗?" onConfirm={() => { this.deleteIpSement(record.id); }}>
              <a href="javascript:;" type="danger">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="javascript:;" type="default" onClick={() => this.getIpmanagerAdd(record.id, record)}>补全</a>
            {/* <a href="javascript:;" onClick={() => { this.getIpmanagerAdd(record.id, record); }}>补全 </a> */}
            {/* <a href="javascript:;" onClick={() => { this.edit(record); }}>编辑 </a> */}
            {/* </Row> */}
            {/* <Row> <a href="javascript:;" onClick={() => { this.getIpmanagerAdd(record.id, record); }}>补全 </a></Row> */}
          </span>
        )
      },
    ];
    const onExpandTwo = async (expanded: any, record: any) => {
      // console.log('record', record);
      this.setState({ secondData: record }, async () => {
        if (expanded) {
          this.setState({ loading: true });
          let rescode = await this.getChiildList(record.id);
          if (rescode) {
            let list: any = [];
            list.push(record.id);
            this.setState({ loading: false }, () => {
              this.changeexpandedRowKeys(list);
            });
          } else {
            notification['warning']({
              message: '此IP下没有业务IP!',
              description: '',
              duration: 2,
              icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
            });
          }
        } else if (!expanded) {
          let list: any = [];
          this.setState({ loading: false }, () => {
            this.changeexpandedRowKeys(list);
          });
        }
      });
    };
    const onExpandThree = async (expanded: any, record: any) => {
      console.log('record', record);
      console.log('expanded', expanded);
      this.setState({ thirddData: record }, async () => {
        if (expanded) {
          this.setState({ loading: true });
          let rescode = await this.getChiildListThree(record.id);
          if (rescode) {
            let list: any = [];
            list.push(record.id);
            this.setState({ loading: false }, () => {
              this.changeexpandedRowKeysThree(list);
            });
          } else {
            notification['warning']({
              message: '此IP下没有分段IP!',
              description: '',
              duration: 2,
              icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
            });
          }
        } else if (!expanded) {
          let list: any = [];
          this.setState({ loading: false }, () => {
            this.changeexpandedRowKeysThree(list);
          });
        }
      });
    };
    // 展开三级子表格
    const expandedRowRenderThree = (record: any, index: any, indent: any, expanded: any) => {
      const subColumns = [
        {
          title: 'IP段',
          key: 'ip',
          dataIndex: 'ip',
          width: 250,
          render: (text: any, record: any) => {
            let us: any;
            let st: any;
            if (record.using) {
              us = <Tag color="green">已启用</Tag>;
            } else if (!record.using) {
              us = <Tag color="red">已禁用</Tag>;
            }
            if (record.storage) {
              st = <Tag color="green">已入库</Tag>;
            } else if (!record.storage) {
              st = <Tag color="red">未入库</Tag>;
            }
            return <span><a onClick={() => { this.showIPDrawer(record); }}>{record.ip}/{record.netmask}</a>&nbsp;{us}{st}</span>;
          }
        },
        {
          title: 'IP类型',
          key: 'ip_type',
          width: 100,
          dataIndex: 'ip_type',
          render: (text: any, record: any) => {
            let name = this.getIPTypeName(record.ip_type);
            return <span>{name}</span>;
          }
        },
        {
          title: '广播类型/地点',
          key: 'broadcast_type',
          dataIndex: 'broadcast_type',
          width: 200,
          render: (text: any, record: any) => {
            let name = this.getIPBroadcastName(record.broadcast_type);
            let bl: any;
            if (record.broadcast_location !== null && record.broadcast_location.length > 0) {
              let names = [];
              let name = '';
              for (let index = 0; index < record.broadcast_location.length; index++) {
                const element = record.broadcast_location[index];
                names.push(element.nation + '-' + element.city);
                if (index === 0) {
                  name = element.nation + '-' + element.city + '...';
                }
              }
              bl = <Tooltip placement="topLeft" title={names.join(',')}><span >{name}</span></Tooltip>;
            } else {
              bl = null;
            }
            return <div><Row>{name}</Row><Row>{bl}</Row></div>;
          }
        },
        {
          title: '业务类型/地点',
          key: 'business_type',
          dataIndex: 'business_type',
          width: 200,
          render: (text: any, record: any) => {
            let name = this.getIPBroadcastName(record.business_type);
            let bt: any;
            if (record.business_location !== null && record.business_location.length > 0) {
              let names = [];
              let name = '';
              for (let index = 0; index < record.business_location.length; index++) {
                const element = record.business_location[index];
                names.push(element.nation + '-' + element.city);
                if (index === 0) {
                  name = element.nation + '-' + element.city + '...';
                }
              }
              bt = <Tooltip placement="topLeft" title={names.join(',')}><span >{name}</span></Tooltip>;
            } else {
              bt = null;
            }
            return <div><Row>{name}</Row><Row>{bt}</Row></div>;
          }
        },
        {
          title: '网关设备',
          key: 'gateway_info',
          dataIndex: 'gateway_info',
          width: 200,
          render: (text: any, record: any) => {
            let list: any = [];
            if (record.gateway_info && record.gateway_info.ids && record.gateway_info.ids.length > 0) {
              let objs = this.getDatadictNetelementNameByIds(record.gateway_info.ids);
              objs.forEach((element: any, index: number) => {
                list.push(
                  <Row key={index + record.id}>
                    <a href="javascript:;" onClick={() => { this.showDrawer(element); }}>{element.name} </a>
                  </Row>
                );
              });

              return list;
            } else {
              return list;
            }
          }
        },
        {
          title: '资源创建者/资源归属者',
          key: 'owner_domains',
          dataIndex: 'owner_domains',
          width: 200,
          render: (text: any, record: any) => {
            let name = this.getownerdomains([parseInt(record.creator_domain, 10)]);
            let names = this.getownerdomains(record.owner_domains);
            return <span>{name}/{names}</span>;
          }
        },
        {
          title: '备注',
          key: 'note',
          width: 200,
          dataIndex: 'note',
          render: (text: any, record: any) => {
            if (record.note !== null && record.note.length > 0) {
              return <Tooltip placement="topLeft" title={record.note}><span >{record.note}</span></Tooltip>;
            }
            return null;
          },
        },
        {
          title: '操作',
          key: 'actions',
          dataIndex: 'actions',
          width: 100,
          render: (text: any, record: any) => (
            <span>
              <a type="primary" onClick={() => this.edit(record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确认删除吗?" onConfirm={() => { this.deleteIpSement(record.id); }}>
                <a type="danger">删除</a>
              </Popconfirm>
            </span>
          )
        },
      ];

      return (
        <span>
          <Table
            columns={subColumns}
            rowKey={(record, index) => record.id}
            dataSource={this.state.listThree}
            pagination={false}
            bordered={true}
            className="subTable"
            size={'small'}
          />
        </span>
      );
      // }
    };
    // 展开二级子表格
    const expandedRowRender = (record: any, index: any, indent: any, expanded: any) => {
      const subColumns = [
        {
          title: 'IP段',
          key: 'ip',
          dataIndex: 'ip',
          width: 250,
          render: (text: any, record: any) => {
            let us: any;
            let st: any;
            if (record.using) {
              us = <Tag color="green">已启用</Tag>;
            } else if (!record.using) {
              us = <Tag color="red">已禁用</Tag>;
            }
            if (record.storage) {
              st = <Tag color="green">已入库</Tag>;
            } else if (!record.storage) {
              st = <Tag color="red">未入库</Tag>;
            }
            return <span><a onClick={() => { this.showIPDrawer(record); }}>{record.ip}/{record.netmask}</a>&nbsp;{us}{st}</span>;
          }
        },
        {
          title: 'IP类型',
          key: 'ip_type',
          width: 100,
          dataIndex: 'ip_type',
          render: (text: any, record: any) => {
            let name = this.getIPTypeName(record.ip_type);
            return <span>{name}</span>;
          }
        },
        {
          title: '广播类型/地点',
          key: 'broadcast_type',
          dataIndex: 'broadcast_type',
          width: 200,
          render: (text: any, record: any) => {
            let name = this.getIPBroadcastName(record.broadcast_type);
            let bl: any;
            if (record.broadcast_location !== null && record.broadcast_location.length > 0) {
              let names = [];
              let name = '';
              for (let index = 0; index < record.broadcast_location.length; index++) {
                const element = record.broadcast_location[index];
                if (element !== null) {
                  names.push(element.nation + '-' + element.city);
                  if (index === 0) {
                    name = element.nation + '-' + element.city + '...';
                  }
                }
              }
              bl = <Tooltip placement="topLeft" title={names.join(',')}><span >{name}</span></Tooltip>;
            } else {
              bl = null;
            }
            return <div><Row>{name}</Row><Row>{bl}</Row></div>;
          }
        },
        {
          title: '业务类型/地点',
          key: 'business_type',
          dataIndex: 'business_type',
          width: 200,
          render: (text: any, record: any) => {
            let name = this.getIPBroadcastName(record.business_type);
            let bt: any;
            if (record.business_location !== null && record.business_location.length > 0) {
              let names = [];
              let name = '';
              for (let index = 0; index < record.business_location.length; index++) {
                const element = record.business_location[index];
                if (element !== null) {
                  names.push(element.nation + '-' + element.city);
                  if (index === 0) {
                    name = element.nation + '-' + element.city + '...';
                  }
                }
              }
              bt = <Tooltip placement="topLeft" title={names.join(',')}><span >{name}</span></Tooltip>;
            } else {
              bt = null;
            }
            return <div><Row>{name}</Row><Row>{bt}</Row></div>;
          }
        },
        {
          title: '网关设备',
          key: 'gateway_info',
          dataIndex: 'gateway_info',
          width: 200,
          render: (text: any, record: any) => {
            let list: any = [];
            if (record.gateway_info && record.gateway_info.ids && record.gateway_info.ids.length > 0) {
              let objs = this.getDatadictNetelementNameByIds(record.gateway_info.ids);
              objs.forEach((element: any, index: number) => {
                list.push(
                  <Row key={index + record.id}>
                    <a href="javascript:;" onClick={() => { this.showDrawer(element); }}>{element.name} </a>
                  </Row>
                );
              });

              return list;
            } else {
              return list;
            }
          }
        },
        {
          title: '资源创建者/资源归属者',
          key: 'owner_domains',
          dataIndex: 'owner_domains',
          width: 200,
          render: (text: any, record: any) => {
            let name = this.getownerdomains([parseInt(record.creator_domain, 10)]);
            let names = this.getownerdomains(record.owner_domains);
            return <span>{name}/{names}</span>;
          }
        },
        {
          title: '备注',
          key: 'note',
          dataIndex: 'note',
          width: 200,
          render: (text: any, record: any) => {
            if (record.note !== null && record.note.length > 0) {
              return <Tooltip placement="topLeft" title={record.note}><span >{record.note}</span></Tooltip>;
            }
            return null;
          },
        },
        {
          title: '操作',
          key: 'actions',
          dataIndex: 'actions',
          width: 200,
          render: (text: any, record: any) => (
            <span>
              <a type="primary" onClick={() => this.edit(record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确认删除吗?" onConfirm={() => { this.deleteIpSement(record.id); }}>
                <a type="danger">删除</a>
              </Popconfirm>
            </span>
          )
        },
      ];

      return (
        <span>
          <Table
            columns={subColumns}
            rowKey={(record, index) => record.id}
            dataSource={this.state.listTwo}
            pagination={false}
            bordered={true}
            size={'small'}
            className="subTable"
            onExpand={onExpandThree}
            expandedRowRender={expandedRowRenderThree}
            expandedRowKeys={this.state.expandedRowKeysThree}
          />
        </span>
      );
      // }
    };
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
    const { getFieldDecorator } = this.props.form;
    const { IPBroadcast, DomainListUnLoginList } = this.state;
    let IPBroadcastoptions: any = [];
    if (IPBroadcast && IPBroadcast.length > 0) {
      IPBroadcast.forEach((e: any) => {
        IPBroadcastoptions.push(<Option value={e.id} key={e.id}>{e.name}</Option>);
      });
    }
    let DomainListUnLoginoptions: any = [];
    if (DomainListUnLoginList && DomainListUnLoginList.length > 0) {
      DomainListUnLoginList.forEach((e: any) => {
        DomainListUnLoginoptions.push(<Option value={e.id} key={e.id}>{e.name}</Option>);
      });
    }
    return (
      <div style={{ width: '100%' }}>
        {this.state.LBvisible &&
          <div style={{ width: '100%' }}>
            <div className="layout-breadcrumb" >
              <div className="page-name">
                <CurrentPage />
              </div>
              <div className="page-button">
                <CommonButton />
                {/* 下面写本页面需要的按钮 */}
                {this.state.tabsKey && this.state.tabsKey === '1' &&
                  <Button type="primary" icon="plus" onClick={this.openAdd} >新建</Button>
                }
                {this.state.tabsKey && this.state.tabsKey === '2' &&
                  <Button type="primary" icon="plus" onClick={this.openAddHT} >新建合同</Button>
                }
              </div>
            </div>
            <div className="content" >
              <div className="page-content">
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                  <TabPane tab="IPv4资源池" key="1">
                    <Row>
                      <Form layout="inline">
                        <Col span={6}>
                          <FormItem
                            {...
                            {
                              labelCol: {
                                xs: { span: 24 },
                                sm: { span: 5 },
                              },
                              wrapperCol: {
                                xs: { span: 24 },
                                sm: { span: 19 },
                              },
                            }
                            }
                            label="IP"
                          >
                            {getFieldDecorator('IPserch', {
                              rules: [],
                            })(
                              <Input placeholder="请输入IP查询" allowClear={true} style={{ width: 200 }} />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          {/* IPBroadcast */}
                          <FormItem
                            {...formItemLayout}
                            label="广播类型"
                          >
                            {getFieldDecorator('broadcastTypeSerch', {
                              rules: [],
                            })(
                              <Select style={{ width: 200 }} placeholder="请选择广播类型" allowClear={true} >
                                {IPBroadcastoptions}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem
                            {...formItemLayout}
                            label="资源创建者"
                          >
                            {getFieldDecorator('creatorDomainSerch', {
                              rules: [],
                            })(
                              <Select style={{ width: 200 }} placeholder="请选择资源创建者" allowClear={true} >
                                {DomainListUnLoginoptions}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem>
                            <Button icon="search" onClick={this.serchIPv4} >查询</Button>
                          </FormItem>
                        </Col>
                      </Form>
                    </Row>
                    <br />
                    <Table
                      columns={column}
                      rowKey={record => record.id}
                      dataSource={list}
                      bordered={true}
                      expandedRowRender={expandedRowRender}
                      onExpand={onExpandTwo}
                      expandedRowKeys={this.state.expandedRowKeys}
                      // scroll={{ x: 2100 }}
                      pagination={false}
                      size={'small'}
                    />
                  </TabPane>
                  <TabPane tab="资源管理" key="2">
                    <Resource form={this.props.form} shareState={this.state} />
                  </TabPane>
                  {/* <TabPane tab="资源提醒" key="3">
              Content of Tab Pane 3
            </TabPane> */}
                </Tabs>
              </div>
            </div>
          </div>
        }
        <Drawer
          title={this.state.gatewayInfo ? '网元: ' + this.state.gatewayInfo.name : ''}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={700}
        >
          <Descriptions title="基础信息" column={1} />
          <Row><Col span={6}>设备名称：</Col><Col span={18}>{this.state.gatewayInfo.name}</Col></Row><br />
          <Row><Col span={6}>设备IP：</Col><Col span={18}>{this.state.gatewayInfo.ip}</Col></Row><br />
          <Row><Col span={6}>设备类型：</Col><Col span={18}>{this.state.gatewayInfo.net_element_device_type ? this.state.gatewayInfo.net_element_device_type.capability_name : ''}</Col></Row><br />
          <Row><Col span={6}>位置信息：</Col><Col span={18}>{this.state.gatewayInfo.location_info}</Col></Row><br />
          <Descriptions title="数据中心信息" column={1} />
          <Row><Col span={6}>国家：</Col><Col span={18}>{this.state.gatewayInfo.nationName ? this.state.gatewayInfo.nationName : ''}</Col></Row><br />
          <Row><Col span={6}>城市：</Col><Col span={18}>{this.state.gatewayInfo.cityName ? this.state.gatewayInfo.cityName : ''}</Col></Row><br />
          <Row><Col span={6}>机房：</Col><Col span={18}>{this.state.gatewayInfo.roomName ? this.state.gatewayInfo.roomName : ''}</Col></Row><br />
          <Row><Col span={6}>楼层：</Col><Col span={18}>{this.state.gatewayInfo.floorName ? this.state.gatewayInfo.floorName : ''}</Col></Row><br />
          <Descriptions title="网元字典信息" column={1} />
          <Row><Col span={6}>Venor：</Col><Col span={18}>{this.state.gatewayInfo.vendorName ? this.state.gatewayInfo.vendorName : ''}</Col></Row><br />
          <Row><Col span={6}>OS：</Col><Col span={18}>{this.state.gatewayInfo.osName ? this.state.gatewayInfo.osName : ''}</Col></Row><br />
          <Row><Col span={6}>Verson：</Col><Col span={18}>{this.state.gatewayInfo.versonName ? this.state.gatewayInfo.versonName : ''}</Col></Row><br />
          <Row><Col span={6}>Protocl Support：</Col><Col span={18}>{this.state.gatewayInfo.supportName ? this.state.gatewayInfo.supportName : ''}</Col></Row><br />
        </Drawer>
        {this.state.IPvisible &&
          <Drawer
            title={this.state.IPduanDrawer ? 'IP段: ' + this.state.IPduanDrawer.ip + '/' + this.state.IPduanDrawer.netmask : ''}
            placement="right"
            closable={false}
            onClose={this.iponClose}
            visible={this.state.IPvisible}
            width={700}
          >
            <Row><Col span={6}>IP类型：</Col><Col span={18}>{this.getIPTypeName(this.state.IPduanDrawer.ip_type)}</Col></Row><br />
            <Row><Col span={6}>启用状态：</Col><Col span={18}>{this.state.IPduanDrawer.using ? '已启用' : '未启用'}</Col></Row><br />
            <Row><Col span={6}>入库状态：</Col><Col span={18}>{this.state.IPduanDrawer.storage ? '已入库' : '未入库'}</Col></Row><br />
            <Row><Col span={6}>合同编号：</Col><Col span={18}>{this.state.IPduanDrawer.contract_ip ? this.getHtname(this.state.IPduanDrawer.contract_ip.contract) : ''}</Col></Row><br />
            <Row><Col span={6}>资源归属：</Col><Col span={18}>{this.getownerdomains(this.state.IPduanDrawer.owner_domains)}</Col></Row><br />
            <Row><Col span={6}>资源创建者：</Col><Col span={18}>{this.getownerdomains([parseInt(this.state.IPduanDrawer.creator_domain, 10)])}</Col></Row><br />
            <Divider orientation="left">广播信息</Divider>
            <Row><Col span={6}>广播类型：</Col><Col span={18}>{this.getIPBroadcastName(this.state.IPduanDrawer.broadcast_type)}</Col></Row><br />
            <Row>
              <Col span={6}>广播地点：</Col>
              <Col span={18}>
                {this.IPduanGetBroadcastLocation()}
              </Col>
            </Row>
            <br />
            <Divider orientation="left">业务信息</Divider>
            <Row><Col span={6}>业务类型：</Col><Col span={18}>{this.getIPBroadcastName(this.state.IPduanDrawer.business_type)}</Col></Row><br />
            <Row><Col span={6}>业务地点：</Col><Col span={18}>{this.IPduanGetBussinessLocation()}</Col></Row><br />
            <Row><Col span={6}>网关设备：</Col><Col span={18}>{this.IPduanGetWayInfo()}</Col></Row><br />
          </Drawer>
        }
        {this.state.addvisible &&
          <AddIpManeger form={this.props.form} shareState={this.state} />
        }
        {this.state.HTvisible &&
          <Edit form={this.props.form} shareState={this.state} />
        }
        {this.state.YWvisible &&
          <EditYW form={this.props.form} shareState={this.state} />
        }
        {this.state.FDvisible &&
          <EditFD form={this.props.form} shareState={this.state} />
        }
        {this.state.ZYvisible &&
          <EditZY form={this.props.form} shareState={this.state} />
        }
        {this.state.BQvisible &&
          <BQaddIpManeger form={this.props.form} shareState={this.state} />
        }
        {
          this.state.addvisibleAddHT &&
          <Modal
            title="新增"
            visible={this.state.addvisibleAddHT}
            onOk={this.addNewHT}
            maskClosable={false}
            onCancel={this.closeAddHT}
            centered={true}
            destroyOnClose={true}
            width={800}
          >
            <AddResoruce
              form={this.props.form}
              // editData={this.state.editData}
              purchaseChannelChoices={this.state.ContractTypes}
              monetaryUnitChoices={this.state.ContractUnits}
            // burstBillingChoices={this.burstBillingChoices}
            // changeTypeChoices={this.changeTypeChoices}
            />
          </Modal>
        }
      </div>
    );
  }
}

export default Form.create({})(IPManager);