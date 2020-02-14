import * as React from 'react';
import { netelementmanager, linemanager, system, contractmanager, usermanager } from 'src/api';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
import { Tabs, Button, Table, Modal, Form, message, Divider, Popconfirm, Input, Select } from 'antd';
import _ from 'lodash';
import AddEditContractForm from './addEditContractForm';
import NetElementInfoDrawer from './netElementInfoDrawer';
import ISPInfoDrawer from './ispInfoDrawer';
import ContractInfoDrawer from './contractInfoDrawer';
import AttachDrawer from './attachDrawer';
import AddEditISPManagerForm from './addEditForm';
import AddEditRenewForm from './addEditRenewForm';
import moment from 'moment';
import Urls from 'src/config/Urls';

const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  ISPlist: any;
  netelementList: any;
  domainList: any;
  contractList: any;
  showAdd: boolean;
  editData: any;
  showDrawer: boolean;
  drawerData: any;
  showISPDrawer: boolean;
  ISPDrawerData: any;
  showContractDrawer: boolean;
  contractDrawerData: any;
  showAttachDrawer: boolean;
  attachDrawerData: any;
  defaultActiveKey: string;
  showRenew: boolean;
  userList: any;
  filterItems: string[];
  filterParam: any;
}

const { TabPane } = Tabs;
const uploadAttachUrl = window.$$_web_env.apiDomain + Urls.fileUpload;
const dir = 'ispmanager';

/**
 * NetElementManager
 */
class ISPManager extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      ISPlist: [], // 运营商管理数据列表
      netelementList: [], // 网元列表
      domainList: [], // 用户组
      contractList: [], // 合同列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      defaultActiveKey: '1', // 默认选中的tab
      showDrawer: false, // 是否显示抽屉
      drawerData: null, // 抽屉显示数据
      showISPDrawer: false, // 是否显示运营商信息抽屉
      ISPDrawerData: null, // 运营商信息数据
      showContractDrawer: false, // 是否显示合同信息抽屉
      contractDrawerData: null, // 合同信息抽屉数据
      showAttachDrawer: false, // 是否显示合同附件信息抽屉
      attachDrawerData: null, // 合同附件信息抽屉数据
      showRenew: false, // 是否显示合同续约Form
      userList: [], // 用户列表
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
    };
  }

  /**
   * 互联类型
   */
  connTypeChoices = [
    { value: 1, label: 'ISP运营商' },
    { value: 2, label: '下游IPT' },
    { value: 3, label: 'Direct IX' },
    { value: 4, label: '其它' },
  ];

  /**
   * 黑洞类型
   */
  blackholesTypeChoices = [
    { value: 1, label: '专用BGP' },
    { value: 2, label: '链路BGP' },
    { value: 3, label: 'API' },
    { value: 4, label: '不支持黑洞' },
  ];

  /**
   * 路由条目
   */
  routesNumTypeChoices = [
    { value: 1, label: '混合统计' },
    { value: 2, label: '独立统计' },
  ];

  /**
   * 内部链路代号
   */
  lineNumTypeChoices = [
    { value: 'ISP-IKG-', label: 'ISP-IKG-' },
    { value: 'ISP-DIX-', label: 'ISP-DIX-' },
    { value: 'ISP-IPT-', label: 'ISP-IPT-' },
    { value: 'ISP-OTHER-', label: 'ISP-OTHER-' },
  ];

  /**
   * 采购渠道
   */
  purchaseChannelChoices = [
    { value: 1, label: '代购' },
    { value: 2, label: '直签' },
  ];

  /**
   * 货币单位
   */
  monetaryUnitChoices = [
    { value: 1, label: '美元' },
    { value: 2, label: '港币' },
    { value: 3, label: '人民币' },
  ];

  /**
   * 突发计费
   */
  burstBillingChoices = [
    { value: 1, label: 'B=C' },
    { value: 2, label: 'B>C' },
    { value: 3, label: 'B<C' },
    { value: 4, label: '无突发' },
  ];

  /**
   * 变更类型
   */
  changeTypeChoices = [
    { value: 1, label: '续约' },
    { value: 2, label: '信息变更' },
  ];

  /**
   * Netmiko设备类型
   */
  devTypeChoices = [
    { value: 1, label: 'cisco_ios' },
    { value: 2, label: 'juniper' },
    { value: 3, label: 'huawei' },
  ];

  UNSAFE_componentWillMount() {
    this.getList();
    if (this.state.defaultActiveKey === '1') {
      this.getDomainList();
      this.getContractList();
      this.getUserList();
    }
  }

  /*
 * 获取用户列表
 */
  getUserList = async () => {
    const param: any = {
      page: 1,
      page_size: 1000
    };

    const res = await usermanager.getList(param);
    // console.log(res.code);
    if (!res.code) {
      return;
    }

    if (res) {
      this.setState({
        userList: res.results.data,
      });
    }
  }

  /**
   * 获取运营商数据列表
   */
  getList = async () => {
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize
    };

    let res;
    if (this.state.defaultActiveKey === '1') {
      // 增加筛选条件
      if (this.state.filterParam) {
        if (this.state.filterParam.s_opposite_name) {
          param.opposite_name__icontains = this.state.filterParam.s_opposite_name;
        }
        if (this.state.filterParam.s_line_num) {
          param.line_num__icontains = this.state.filterParam.s_line_num;
        }
        if (this.state.filterParam.s_isp_line_num) {
          param.isp_line_num__icontains = this.state.filterParam.s_isp_line_num;
        }
        if (this.state.filterParam.s_asn) {
          param.asn__icontains = this.state.filterParam.s_asn;
        }
        if (this.state.filterParam.s_phyical_ap_id) {
          param.phyical_ap_id__icontains = this.state.filterParam.s_phyical_ap_id;
        }
        if (this.state.filterParam.s_logic_ap_id) {
          param.logic_ap_id__icontains = this.state.filterParam.s_logic_ap_id;
        }
        if (this.state.filterParam.s_product_type) {
          param.product_type__icontains = this.state.filterParam.s_product_type;
        }
        if (this.state.filterParam.s_local_addr) {
          param.local_addr__icontains = this.state.filterParam.s_local_addr;
        }
        if (this.state.filterParam.s_blackhole_type) {
          param.blackhole_type__icontains = this.state.filterParam.s_blackhole_type;
        }
        if (this.state.filterParam.s_conn_type) {
          param.conn_type = this.state.filterParam.s_conn_type;
        }
        if (this.state.filterParam.s_creator) {
          param.creator = this.state.filterParam.s_creator;
        }
        if (this.state.filterParam.s_owner) {
          param.owner = this.state.filterParam.s_owner;
        }
      }
      res = await linemanager.getList(param);
      const elementRes = await netelementmanager.getList({});
      if (!res.code || !elementRes) {
        return;
      }
      this.setState({
        netelementList: elementRes.results,
      });
    } else if (this.state.defaultActiveKey === '2') {
      if (this.state.filterParam) {
        if (this.state.filterParam.s_contract_num) {
          param.contract_num__icontains = this.state.filterParam.s_contract_num;
        }
        if (this.state.filterParam.s_business_entity) {
          param.business_entity__icontains = this.state.filterParam.s_business_entity;
        }
        if (this.state.filterParam.s_authorized_subject) {
          param.authorized_subject__icontains = this.state.filterParam.s_authorized_subject;
        }
      }
      res = await contractmanager.getList(param);
      if (!res.code) {
        return;
      }
    }

    if (res) {
      this.setState({
        ISPlist: res.results.data,
        total: res.results.count
      });
    }
  }

  /**
   * 获取用户组列表
   */
  getDomainList = async () => {
    const res = await system.getDomain();
    if (!res.code) {
      return;
    }
    if (res) {
      this.setState({
        domainList: res.results.data,
      });
    }
  }

  /**
   * 获取合同列表
   */
  getContractList = async () => {
    const res = await linemanager.getContractList({});
    if (!res.code) {
      return;
    }
    console.log(res);
    if (res) {
      this.setState({
        contractList: res.results,
      });
    }
  }

  render() {

    const {
      total,
      page,
      pageSize,
      ISPlist,
      netelementList,
      domainList,
      contractList,
      userList
    } = this.state;

    const { getFieldDecorator } = this.props.form;

    /*
    * 模态窗显示
    */
    const showAdd = () => {
      this.setState({
        showAdd: true
      });
    };

    /**
     * 显示编辑
     */
    const showEdit = (record: any, showRenew?: boolean) => {
      this.setState({
        editData: record,
        showAdd: true
      });
      if (showRenew) {
        this.setState({
          showRenew: true,
        });
      }
    };

    /**
     * 删除运营商数据
     */
    const del = async (record: any) => {
      let res, statement: any;
      if (this.state.defaultActiveKey === '1') {
        res = await linemanager.del(record.id, {});
        statement = '运营商数据';
      } else if (this.state.defaultActiveKey === '2') {
        res = await contractmanager.del(record.id, {});
        statement = '资源信息';
      }

      if (res && !res.code) {
        message.error(res.msg);
        return;
      }

      message.success(statement + '删除成功');
      this.getList();
    };

    /*
    * 显示抽屉
    */
    const showDrawer = (record: any, ISP?: boolean, attach?: boolean) => {
      if (this.state.defaultActiveKey === '1') {
        if (ISP) {
          this.setState({
            showISPDrawer: true,
            ISPDrawerData: record
          });
        } else {
          this.setState({
            showDrawer: true,
            drawerData: record
          });
        }
      }
      if (this.state.defaultActiveKey === '2') {
        if (attach) {
          this.setState({
            showAttachDrawer: true,
            attachDrawerData: record
          });
        } else {
          this.setState({
            showContractDrawer: true,
            contractDrawerData: record
          });
        }
      }
    };

    /*
    * 关闭抽屉
    */
    const onDrawerClose = (e: any, ISP?: boolean, attach?: boolean) => {
      if (this.state.defaultActiveKey === '1') {
        if (ISP) {
          this.setState({
            showISPDrawer: false,
            ISPDrawerData: null
          });
        } else {
          this.setState({
            showDrawer: false,
            drawerData: null
          });
        }
      }
      if (this.state.defaultActiveKey === '2') {
        if (attach) {
          this.setState({
            showAttachDrawer: false,
            attachDrawerData: null
          });
        } else {
          this.setState({
            showContractDrawer: false,
            contractDrawerData: null
          });
        }
      }
    };

    /**
     * 运营商管理列
     */
    let column;
    if (this.state.defaultActiveKey === '1') {
      column = [
        {
          title: '互联类型',
          key: 'conn_type_id',
          dataIndex: 'conn_type_id',
          width: 100,
          render: (text: any, record: any) => {
            return (<span>{_.find(this.connTypeChoices, ['value', text])?.label}</span>);
          }
        },
        {
          title: '对端名称',
          key: 'opposite_name',
          dataIndex: 'opposite_name',
          width: 150,
        },
        {
          title: 'ASN',
          key: 'asn',
          dataIndex: 'asn',
          width: 100,
        },
        {
          title: '内部链路代号',
          key: 'line_num',
          dataIndex: 'line_num',
          width: 150,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        // {
        //   title: '供应商链路代号',
        //   key: 'isp_line_num',
        //   dataIndex: 'isp_line_num',
        //   width: 150,
        // },
        // {
        //   title: '路由成分',
        //   key: 'route_ingredient',
        //   dataIndex: 'route_ingredient',
        //   width: 150,
        // },
        // {
        //   title: '合同编号',
        //   key: 'contract.contract_num',
        //   dataIndex: 'contract.contract_num',
        //   width: 150,
        // },
        {
          title: '物理入网点',
          key: 'phyical_ap_id',
          dataIndex: 'phyical_ap_id',
          width: 150,
          render: (text: any, record: any) => {
            return (
              <span>
                <a onClick={() => showDrawer(_.find(netelementList, ['id', text]))}>
                  {_.find(netelementList, ['id', text])?.name}
                </a>
              </span>
            );
          }
        },
        // {
        //   title: '物理入网点端接口',
        //   key: 'phyical_ap_phyical_port',
        //   dataIndex: 'phyical_ap_phyical_port',
        //   width: 150,
        // },
        // {
        //   title: '物理入网点接口速率',
        //   key: 'phyical_ap_port_rate',
        //   dataIndex: 'phyical_ap_port_rate',
        //   width: 180,
        // },
        {
          title: '逻辑入网点',
          key: 'logic_ap_id',
          dataIndex: 'logic_ap_id',
          width: 150,
          render: (text: any, record: any) => {
            return (
              <span>
                <a onClick={() => showDrawer(_.find(netelementList, ['id', text]))}>
                  {_.find(netelementList, ['id', text])?.name}
                </a>
              </span>
            );
          }
        },
        // {
        //   title: '产品类型',
        //   key: 'product_type',
        //   dataIndex: 'product_type',
        //   width: 150,
        // },
        {
          title: '逻辑入网点接口',
          key: 'logic_ap_phyical_port',
          dataIndex: 'logic_ap_phyical_port',
          width: 150,
        },
        // {
        //   title: '逻辑入网点接口速率',
        //   key: 'logic_ap_port_rate',
        //   dataIndex: 'logic_ap_port_rate',
        //   width: 180,
        // },
        {
          title: '承诺带宽',
          key: 'committed_bw',
          dataIndex: 'committed_bw',
          width: 150,
          render: (text: any, record: any) => {
            return (<span>{text}M</span>);
          }
        },
        {
          title: '突发带宽',
          key: 'burst_bw',
          dataIndex: 'burst_bw',
          width: 150,
          render: (text: any, record: any) => {
            return (<span>{text}M</span>);
          }
        },
        // {
        //   title: '本端地址',
        //   key: 'local_addr',
        //   dataIndex: 'local_addr',
        //   width: 150,
        //   render: (text: any, record: any) => {
        //     return (<span>{text}M</span>);
        //   }
        // },
        // {
        //   title: '对端地址',
        //   key: 'remote_addr',
        //   dataIndex: 'remote_addr',
        //   width: 150,
        //   render: (text: any, record: any) => {
        //     return (<span>{text}M</span>);
        //   }
        // },
        // {
        //   title: '黑洞方式',
        //   key: 'blackholes_type_id',
        //   dataIndex: 'blackholes_type_id',
        //   width: 150,
        //   render: (text: any, record: any) => {
        //     return (<span>{_.find(this.blackholesTypeChoices, ['value', text]) ?.label}</span>);
        //   }
        // },
        // {
        //   title: '黑洞Community',
        //   key: 'blackholes_community',
        //   dataIndex: 'blackholes_community',
        //   width: 150,
        // },
        // {
        //   title: '路由条目',
        //   key: 'routes_num_type_id',
        //   dataIndex: 'routes_num_type_id',
        //   width: 150,
        //   render: (text: any, record: any) => {
        //     return (<span>{_.find(this.routesNumTypeChoices, ['value', text]) ?.label}</span>);
        //   }
        // },
        // {
        //   title: '普通路由条目',
        //   key: 'prefixes_num',
        //   dataIndex: 'prefixes_num',
        //   width: 150,
        // },
        // {
        //   title: '黑洞路由条目',
        //   key: 'blackholes_num',
        //   dataIndex: 'blackholes_num',
        //   width: 150,
        // },
        // {
        //   title: '资源归属',
        //   key: 'owner',
        //   dataIndex: 'owner',
        //   width: 200,
        //   render: (text: any, record: any) => {
        //     let list: any[] = [];
        //     if (_.size(text) > 0) {
        //       _.forEach(text, (value: any, key: any) => {
        //         const domain = _.find(domainList, ['id', parseInt(key, 10)]);
        //         if (domain) {
        //           list.push(domain.name);
        //         }
        //       });
        //     }
        //     return (<span>{list.join('，')}</span>);
        //   }
        // },
        {
          title: '',
          key: 'action',
          dataIndex: 'action',
          width: 200,
          // fixed: 'right' as 'right',
          render: (text: any, record: any) => {
            return (
              <div>
                <Button type="primary" onClick={() => showEdit(record)}>编辑</Button>
                <Divider type="vertical" />
                <Popconfirm title="确认删除吗?" onConfirm={() => del(record)}>
                  <Button type="danger">删除</Button>
                </Popconfirm>
              </div>
            );
          }
        },
      ];
    } else if (this.state.defaultActiveKey === '2') {
      column = [
        {
          title: '合同编号',
          key: 'contract_num',
          dataIndex: 'contract_num',
          width: 150,
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record, true)}>{text}</a></span>);
          }
        },
        {
          title: '商务实体',
          key: 'business_entity',
          dataIndex: 'business_entity',
          width: 260,
        },
        {
          title: '授权主体',
          key: 'authorized_subject',
          dataIndex: 'authorized_subject',
          width: 250,
        },
        {
          title: '服务起始',
          key: 'start_date',
          dataIndex: 'start_date',
          width: 150,
        },
        {
          title: '服务结束',
          key: 'end_date',
          dataIndex: 'end_date',
          width: 150,
        },
        {
          title: '合同附件',
          key: 'id',
          dataIndex: 'id',
          width: 100,
          render: (text: any, record: any) => {
            return (
              <span>
                <a onClick={() => showDrawer(record, false, true)}>
                  打开附件
                </a>
              </span>
            );
          }
        },
        {
          title: '',
          key: 'action',
          dataIndex: 'action',
          render: (text: any, record: any) => {
            return (
              <div>
                <Button type="primary" onClick={() => showEdit(record)}>编辑</Button>
                <Divider type="vertical" />
                <Popconfirm title="确认删除吗?" onConfirm={() => del(record)}>
                  <Button type="danger">删除</Button>
                </Popconfirm>
                <Divider type="vertical" />
                <Button type="primary" onClick={() => showEdit(record, true)}>合同续约</Button>
              </div>
            );
          }
        },
      ];
    }

    /**
     * 关闭模态窗
     */
    const onCancel = () => {
      this.setState({
        showAdd: false,
        showRenew: false,
        editData: null
      });
    };

    /*
    * 模态窗保存
    */
    const onOk = () => {
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        if (!err) {
          let res: any, statement: any = null;

          if (this.state.defaultActiveKey === '1') {
            statement = '运营商数据';
            values.line_num = values.line_num_1 + values.line_num_2;
            let owner: any = {};
            if (_.size(values.owner)) {
              _.forEach(values.owner, val => {
                owner[val] = 1;
              });
            }
            values.owner = owner;
            if (this.state.editData) {
              res = await linemanager.edit(this.state.editData.id, values);
            } else {
              res = await linemanager.add(values);
            }
          } else if (this.state.defaultActiveKey === '2') {
            statement = '资源信息';
            let dateValues = this.props.form.getFieldsValue([
              'start_date',
              'end_date'
            ]);
            const { start_date, end_date } = dateValues;
            const formatDate = 'YYYY-MM-DD';
            values.start_date = moment(start_date).format(formatDate);
            values.end_date = moment(end_date).format(formatDate);
            if (!this.state.showRenew) {
              if (_.isEmpty(values.contract_remind)) {
                values = _.omit(values, 'contract_remind');
              }
              if (_.isEmpty(values.desc)) {
                values = _.omit(values, 'desc');
              }

              if (this.state.editData) {
                res = await contractmanager.edit(this.state.editData.id, values);
              } else {
                res = await contractmanager.add(values);
              }
            } else {
              let dateValues = this.props.form.getFieldsValue([
                'renewal_start_date',
                'renewal_end_date'
              ]);
              const { renewal_start_date, renewal_end_date } = dateValues;
              values.renewal_start_date = moment(renewal_start_date).format(formatDate);
              values.renewal_end_date = moment(renewal_end_date).format(formatDate);
              res = await contractmanager.editRenew(this.state.editData.id, values);
            }
          }

          if (!res.code) {
            message.error(res.msg);
            return;
          }
          message.success(statement + '保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 改变分页
     */
    const changePage = (page: number) => {
      this.setState({
        page: page
      }, () => {
        this.getList();
      });
    };

    /**
     * 改变页大小
     */
    const changePageSize = (current: number, size: number) => {
      this.setState({
        pageSize: size
      }, () => {
        this.getList();
      });
    };

    /**
     * 改变选项卡
     */
    const changeTab = (val: string) => {
      // console.log(val);
      this.setState({
        defaultActiveKey: val,
        page: 1,
        pageSize: 10,
      }, () => {
        this.getList();
      });
    };

    /**
     * 提交查询
     */
    const onSearch = () => {
      this.props.form.validateFields(['s_opposite_name', 's_line_num', 's_isp_line_num', 's_asn', 's_phyical_ap_id', 's_logic_ap_id', 's_product_type', 's_local_addr', 's_blackhole_type', 's_conn_type', 's_creator', 's_owner', 's_contract_num', 's_business_entity', 's_authorized_subject'], async (err: boolean, values: any) => {
        if (!err) {
          this.setState({
            filterParam: values
          }, () => {
            console.log(this.state.filterParam);
            this.getList();
          });
        }
      });
    };

    /**
     * 改变筛选项
     */
    const changeFilter = (val: any) => {
      // console.log(val);
      this.setState({
        filterItems: val
      }, () => {
        onSearch();
      });
    };

    return (
      <div>
        <div className="layout-breadcrumb">
          <div className="page-name">
            <CurrentPage />
          </div>
          <div className="page-button">
            <CommonButton />
            {/* 下面写本页面需要的按钮 */}
            <Button type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button>
            {/* 下面本页的筛选项 */}
            {this.state.defaultActiveKey === '1'
              && <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter} style={{ maxWidth: 800 }}>
                <Option value={'s_opposite_name'}>对端名称</Option>
                <Option value={'s_line_num'}>内部链路代号</Option>
                <Option value={'s_isp_line_num'}>供应商链路代号</Option>
                <Option value={'s_asn'}>ASN</Option>
                <Option value={'s_phyical_ap_id'}>物理入网点</Option>
                <Option value={'s_logic_ap_id'}>逻辑入网点</Option>
                <Option value={'s_product_type'}>产品类型</Option>
                <Option value={'s_local_addr'}>本端地址</Option>
                <Option value={'s_blackhole_type'}>黑洞方式</Option>
                <Option value={'s_conn_type'}>互联类型</Option>
                <Option value={'s_creator'}>资源创建者</Option>
                <Option value={'s_owner'}>资源归属者</Option>
              </Select>
            }
            {this.state.defaultActiveKey === '2'
              && <Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter} >
                <Option value={'s_contract_num'}>合同编号</Option>
                <Option value={'s_business_entity'}>商务实体</Option>
                <Option value={'s_authorized_subject'}>授权主体</Option>
              </Select>
            }
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面本页的筛选内容，根据筛选项选择显示 */}
            {
              this.state.filterItems && this.state.filterItems.length > 0 &&
              <div className="filter-content">
                <Form className="filter-form" layout="inline" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  {
                    this.state.filterItems.indexOf('s_opposite_name') >= 0 &&
                    <Form.Item label="对端名称">
                      {getFieldDecorator('s_opposite_name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入对端名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_line_num') >= 0 &&
                    <Form.Item label="内部链路代号">
                      {getFieldDecorator('s_line_num', {
                        rules: [],
                      })(
                        <Input placeholder="请输入内部链路代号（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_isp_line_num') >= 0 &&
                    <Form.Item label="供应商链路代号">
                      {getFieldDecorator('s_isp_line_num', {
                        rules: [],
                      })(
                        <Input placeholder="请输入供应商链路代号（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_asn') >= 0 &&
                    <Form.Item label="ASN">
                      {getFieldDecorator('s_asn', {
                        rules: [],
                      })(
                        <Input placeholder="请输入ASN（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_phyical_ap_id') >= 0 &&
                    <Form.Item label="物理入网点">
                      {getFieldDecorator('s_phyical_ap_id', {
                        rules: [],
                      })(
                        <Input placeholder="请输入物理入网点（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_logic_ap_id') >= 0 &&
                    <Form.Item label="逻辑入网点">
                      {getFieldDecorator('s_logic_ap_id', {
                        rules: [],
                      })(
                        <Input placeholder="请输入逻辑入网点（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_product_type') >= 0 &&
                    <Form.Item label="产品类型">
                      {getFieldDecorator('s_product_type', {
                        rules: [],
                      })(
                        <Input placeholder="请输入产品类型（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_local_addr') >= 0 &&
                    <Form.Item label="本端地址">
                      {getFieldDecorator('s_local_addr', {
                        rules: [],
                      })(
                        <Input placeholder="请输入本端地址（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_blackhole_type') >= 0 &&
                    <Form.Item label="黑洞方式">
                      {getFieldDecorator('s_blackhole_type', {
                        rules: [],
                      })(
                        <Input placeholder="请输入黑洞方式（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_conn_type') >= 0 &&
                    <Form.Item label="互联类型">
                      {getFieldDecorator('s_conn_type', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {this.connTypeChoices.map((p: any) => (
                            <Option value={p.value} key={p.value}>{p.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_creator') >= 0 &&
                    <Form.Item label="资源创建者">
                      {getFieldDecorator('s_creator', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {userList.map((p: any) => (
                            <Option value={p.id} key={p.id}>{p.alias_name}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_owner') >= 0 &&
                    <Form.Item label="资源归属者">
                      {getFieldDecorator('s_owner', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {domainList.map((p: any) => (
                            <Option value={p.id} key={p.id}>{p.name}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_contract_num') >= 0 &&
                    <Form.Item label="合同编号">
                      {getFieldDecorator('s_contract_num', {
                        rules: [],
                      })(
                        <Input placeholder="请输入合同编号（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_business_entity') >= 0 &&
                    <Form.Item label="商务实体">
                      {getFieldDecorator('s_business_entity', {
                        rules: [],
                      })(
                        <Input placeholder="请输入商务实体（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_authorized_subject') >= 0 &&
                    <Form.Item label="授权主体">
                      {getFieldDecorator('s_authorized_subject', {
                        rules: [],
                      })(
                        <Input placeholder="请输入授权主体（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" onClick={onSearch}>查询</Button>
                  </Form.Item>
                </Form>
              </div>
            }
            {/* 下面是本页的内容 */}
            <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
              <TabPane tab="链路管理" key="1" />
              <TabPane tab="资源管理" key="2" />
            </Tabs>
            {this.state.defaultActiveKey === '1'
              &&
              <Table
                columns={column}
                rowKey="id"
                dataSource={ISPlist}
                bordered={true}
                // scroll={{ x: 1300 }}
                pagination={{
                  size: 'small',
                  showQuickJumper: true,
                  showSizeChanger: true,
                  onChange: changePage,
                  onShowSizeChange: changePageSize,
                  total,
                  current: page,
                  pageSize,
                }}
              />
            }
            {this.state.defaultActiveKey === '2'
              &&
              <Table
                columns={column}
                rowKey="id"
                dataSource={ISPlist}
                bordered={true}
                pagination={{
                  size: 'small',
                  showQuickJumper: true,
                  showSizeChanger: true,
                  onChange: changePage,
                  onShowSizeChange: changePageSize,
                  total,
                  current: page,
                  pageSize,
                }}
              />
            }
          </div>
        </div>
        {
          this.state.showAdd &&
          <Modal
            title={this.state.editData ? '修改' : '新增'}
            visible={this.state.showAdd}
            onOk={onOk}
            maskClosable={false}
            onCancel={onCancel}
            centered={true}
            destroyOnClose={true}
            width={800}
          >
            {
              this.state.defaultActiveKey === '1'
              && this.state.showAdd
              &&
              <AddEditISPManagerForm
                form={this.props.form}
                editData={this.state.editData}
                connTypeChoices={this.connTypeChoices}
                lineNumTypeChoices={this.lineNumTypeChoices}
                blackholesTypeChoices={this.blackholesTypeChoices}
                routesNumTypeChoices={this.routesNumTypeChoices}
                domainList={domainList}
                contractList={contractList}
                devTypeChoices={this.devTypeChoices}
              />
            }
            {
              this.state.defaultActiveKey === '2'
              && !this.state.showRenew
              &&
              <AddEditContractForm
                form={this.props.form}
                editData={this.state.editData}
                purchaseChannelChoices={this.purchaseChannelChoices}
                monetaryUnitChoices={this.monetaryUnitChoices}
                burstBillingChoices={this.burstBillingChoices}
                changeTypeChoices={this.changeTypeChoices}
              />
            }
            {
              this.state.defaultActiveKey === '2'
              && this.state.showRenew
              &&
              <AddEditRenewForm
                form={this.props.form}
                editData={this.state.editData}
              />
            }
          </Modal>
        }
        {
          this.state.defaultActiveKey === '1'
          && <NetElementInfoDrawer
            drawerData={this.state.drawerData}
            onClose={onDrawerClose}
            visible={this.state.showDrawer}
            devTypeChoices={this.devTypeChoices}
          />
        }
        {
          this.state.defaultActiveKey === '1'
          && <ISPInfoDrawer
            drawerData={this.state.ISPDrawerData}
            onClose={(e: any) => onDrawerClose(e, true)}
            visible={this.state.showISPDrawer}
            connTypeChoices={this.connTypeChoices}
            netElementList={netelementList}
            blackholesTypeChoices={this.blackholesTypeChoices}
            routesNumTypeChoices={this.routesNumTypeChoices}
            domainList={domainList}
          />
        }
        {
          this.state.defaultActiveKey === '2'
          && <ContractInfoDrawer
            drawerData={this.state.contractDrawerData}
            onClose={onDrawerClose}
            visible={this.state.showContractDrawer}
            purchaseChannelChoices={this.purchaseChannelChoices}
            monetaryUnitChoices={this.monetaryUnitChoices}
            burstBillingChoices={this.burstBillingChoices}
            changeTypeChoices={this.changeTypeChoices}
          />
        }
        {
          this.state.defaultActiveKey === '2'
          && this.state.showAttachDrawer
          && <AttachDrawer
            drawerData={this.state.attachDrawerData}
            onClose={(e: any) => onDrawerClose(e, false, true)}
            visible={this.state.showAttachDrawer}
            action={uploadAttachUrl}
            dir={dir}
          />
        }
      </div>
    );
  }
}

export default Form.create({})(ISPManager);