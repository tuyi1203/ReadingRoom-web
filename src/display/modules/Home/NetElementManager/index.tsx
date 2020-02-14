import * as React from 'react';
import { netelementusermanager, netelementmanager, netelement, datacenter } from 'src/api';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
import { Tabs, Button, Table, Modal, Form, message, Divider, Popconfirm, Popover, Input, Select } from 'antd';
import AddEditUserManagerForm from './addEditUserManagerForm';
import NetElementInfoDrawer from './netElementInfoDrawer';
import AddEditNetElementManagerForm from './addEditForm';
import _ from 'lodash';

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
  netElementManagerList: any;
  showAdd: boolean;
  editData: any;
  showDrawer: boolean;
  drawerData: any;
  defaultActiveKey: string;
  vendorList: any;
  osList: any;
  versionList: any;
  nationList: any;
  cityList: any;
  roomList: any;
  floorList: any;
  filterItems: string[];
  filterParam: any;
}

const { TabPane } = Tabs;

/**
 * NetElementManager
 */
class NetElementManager extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      netElementManagerList: [], // 网元管理数据列表
      vendorList: [], // Vendor数据列表
      osList: [], // os数据列表
      versionList: [], // version数据列表
      nationList: [], // 国家数据列表
      cityList: [], // 城市数据列表
      roomList: [], // 机房数据列表
      floorList: [], // 楼层数据列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      defaultActiveKey: '1', // 默认选中的tab
      showDrawer: false, // 是否显示抽屉
      drawerData: null, // 抽屉显示数据
      filterItems: [], // 显示的筛选项
      filterParam: {}, // 筛选对象数据
    };
  }

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
    this.getVendorList();
    this.getCityList();
    this.getNationList();
    this.getRoomList();
    this.getOSList();
    this.getFloorList();
    this.getVersionList();
  }

  /**
   * 获取网元数据列表
   */
  getList = async () => {
    // console.log(this.state.defaultActiveKey);
    let res: any;
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize
    };
    if (this.state.defaultActiveKey === '1') {
      // 增加筛选条件
      if (this.state.filterParam) {
        if (this.state.filterParam.s_name) {
          param.name__icontains = this.state.filterParam.s_name;
        }
        if (this.state.filterParam.s_ip) {
          param.ip__icontains = this.state.filterParam.s_ip;
        }
        if (this.state.filterParam.s_device_type) {
          param.device_type = this.state.filterParam.s_device_type;
        }
        if (this.state.filterParam.s_nation) {
          param.nation = this.state.filterParam.s_nation;
        }
        if (this.state.filterParam.s_city) {
          param.city = this.state.filterParam.s_city;
        }
        if (this.state.filterParam.s_room) {
          param.room = this.state.filterParam.s_room;
        }
        if (this.state.filterParam.s_floor) {
          param.floor = this.state.filterParam.s_floor;
        }
        if (this.state.filterParam.s_vendor) {
          param.vendor = this.state.filterParam.s_vendor;
        }
        if (this.state.filterParam.s_os) {
          param.os = this.state.filterParam.s_os;
        }
        if (this.state.filterParam.s_version) {
          param.version = this.state.filterParam.s_version;
        }
      }
      res = await netelementmanager.getList(param);
      if (!res.code) {
        return;
      }
      // res.results.data.forEach((record: any, key: any) => {
      //   res.results.data[key].datacenter = this.getDataCenter(record);
      // });
      console.log(res);
    } else if (this.state.defaultActiveKey === '2') {
      res = await netelementusermanager.getList(param);
      if (!res.code) {
        return;
      }
    }

    if (res) {
      this.setState({
        netElementManagerList: res.results.data,
        total: res.results.count
      });
    }
  }

  /**
   * 获取Vendor数据列表
   */
  getVendorList = async () => {
    let res;
    if (this.state.defaultActiveKey === '1') {
      res = await netelement.getVendorList({
      });
      if (!res.code) {
        return;
      }
      console.log(res);
    }

    if (res) {
      this.setState({
        vendorList: res.results,
      });
    }
  }

  /**
   * 获取OS数据列表
   */
  getOSList = async (vendor?: any) => {
    let res;
    if (this.state.defaultActiveKey === '1') {
      if (vendor) {
        res = await netelement.getOsList({ vendor });
      } else {
        res = await netelement.getOsList();
      }

      if (!res.code) {
        return;
      }
      console.log(res);
    }

    if (res) {
      this.setState({
        osList: res.results,
      });
    }
  }

  /**
   * 获取Version数据列表
   */
  getVersionList = async (os?: any) => {
    let res;
    if (this.state.defaultActiveKey === '1') {
      if (os) {
        res = await netelement.getVersionList({ os });
      } else {
        res = await netelement.getVersionList();
      }
      if (!res.code) {
        return;
      }
      console.log(res);
    }

    if (res) {
      this.setState({
        versionList: res.results,
      });
    }
  }

  /**
   * 获取国家数据列表
   */
  getNationList = async () => {
    let res;
    if (this.state.defaultActiveKey === '1') {
      res = await datacenter.getNationList();
      if (!res.code) {
        return;
      }
      console.log(res);
    }

    if (res) {
      this.setState({
        nationList: res.results,
      });
    }
  }

  /**
   * 获取城市数据列表
   */
  getCityList = async (nation?: number) => {
    let res;
    if (this.state.defaultActiveKey === '1') {
      if (nation) {
        res = await datacenter.getCityList({
          nation
        });
      } else {
        res = await datacenter.getCityList();
      }

      if (!res.code) {
        return;
      }
      console.log(res);
    }

    if (res) {
      this.setState({
        cityList: res.results,
      });
    }
  }

  /**
   * 获取机房数据列表
   */
  getRoomList = async (city?: number) => {
    let res;
    if (this.state.defaultActiveKey === '1') {
      if (city) {
        res = await datacenter.getRoomList({
          city
        });
      } else {
        res = await datacenter.getRoomList();
      }

      if (!res.code) {
        return;
      }
      console.log(res);
    }

    if (res) {
      this.setState({
        roomList: res.results,
      });
    }
  }

  /**
   * 获取楼层数据列表
   */
  getFloorList = async (room?: number) => {
    let res;
    if (this.state.defaultActiveKey === '1') {
      if (room) {
        res = await datacenter.getFloorList({ room });
      } else {
        res = await datacenter.getFloorList();
      }

      if (!res.code) {
        return;
      }
      console.log(res);
    }

    if (res) {
      this.setState({
        floorList: res.results,
      });
    }
  }

  /**
   * 国家数据发生改变
   */
  onNationChange = (value: number) => {
    this.clearFieldValue(['s_city', 's_room', 's_floor']);
    this.getCityList(value);
  }

  /**
   * 城市数据发生改变
   */
  onCityChange = (value: number) => {
    this.clearFieldValue(['s_room', 's_floor']);
    this.getRoomList(value);
  }

  /**
   * 机房数据发生改变
   */
  onRoomChange = (value: number) => {
    this.clearFieldValue(['s_floor']);
    this.getFloorList(value);
  }

  /**
   * Vendor数据发生改变
   */
  onVendorChange = (value: number) => {
    this.clearFieldValue(['s_os', 's_version']);
    this.getOSList(value);
  }

  /**
   * OS数据发生改变
   */
  onOSChange = (value: number) => {
    this.clearFieldValue(['s_version']);
    this.getVersionList(value);
  }

  /**
   * 清除关联数据残留
   */
  clearFieldValue = (fieldNames: string[]) => {
    let obj = {};
    fieldNames.forEach((element: string) => {
      obj[element] = '';
    });
    this.props.form.setFieldsValue(obj);
  }

  render() {

    const {
      total,
      page,
      pageSize,
      netElementManagerList,
      vendorList,
      nationList,
      cityList,
      roomList,
      osList,
      versionList,
      floorList
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
    const showEdit = (record: any) => {
      this.setState({
        editData: record,
        showAdd: true
      });
    };

    /*
   * 取得数据中心名称
   */
    // const getDataCenter = (record: any) => {
    //   const country = _.find(nationList, ['id', record.nation])?.nation_abbreviation;
    //   const city = _.find(cityList, ['id', record.city])?.city_abbreviation;
    //   const room = _.find(roomList, ['id', record.room])?.room;
    //   const floor = _.find(floorList, ['id', record.floor])?.floor;
    //   return country + '_' + city + '_' + room + '_' + floor;
    // };

    /**
     * 删除网元数据
     */
    const del = async (record: any) => {
      let res, statement: any;
      if (this.state.defaultActiveKey === '1') {
        res = await netelementmanager.del(record.id, {});
        statement = '网元数据';
      } else if (this.state.defaultActiveKey === '2') {
        res = await netelementusermanager.del(record.id, {});
        statement = '网元用户库数据';
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
    const showDrawer = (record: any) => {
      this.setState({
        showDrawer: true,
        drawerData: record
      });
      // console.log(this.state.showDrawer);
    };

    /*
    * 关闭抽屉
    */
    const onDrawerClose = () => {
      this.setState({
        showDrawer: false,
        drawerData: null
      });
    };

    /**
     * 网元管理列
     */
    let column;
    if (this.state.defaultActiveKey === '1') {
      column = [
        {
          title: '设备名称',
          key: 'name',
          dataIndex: 'name',
          render: (text: any, record: any) => {
            return (<span><a onClick={() => showDrawer(record)}>{text}</a></span>);
          }
        },
        {
          title: '设备IP',
          key: 'ip',
          dataIndex: 'ip',
        },
        {
          title: '设备类型',
          key: 'net_element_device_type',
          dataIndex: 'net_element_device_type',
          render: (text: { id: number, type_name: string }) => {
            return <span>{text && text.type_name}</span>;
          }
        },
        {
          title: '数据中心',
          children: [
            {
              title: '国家',
              key: 'nation',
              dataIndex: 'nation',
              render: (text: any, record: any) => {
                return <span>{text ? _.find(nationList, ['id', text])?.nation : ''}</span>;
              }
            },
            {
              title: '城市',
              key: 'city',
              dataIndex: 'city',
              render: (text: any, record: any) => {
                return <span>{text ? _.find(cityList, ['id', text])?.city : ''}</span>;
              }
            },
            {
              title: '机房',
              key: 'room',
              dataIndex: 'room',
              render: (text: any, record: any) => {
                return <span>{text ? _.find(roomList, ['id', text])?.room : ''}</span>;
              }
            },
            {
              title: '楼层',
              key: 'floor',
              dataIndex: 'floor',
              render: (text: any, record: any) => {
                return <span>{text ? _.find(floorList, ['id', text])?.floor : ''}</span>;
              }
            },
          ],
        },
        {
          title: '网元信息',
          children: [
            {
              title: 'Vendor',
              key: 'vendor',
              dataIndex: 'vendor',
              render: (text: any) => {
                return <span>{text ? (_.find(vendorList, ['id', text]) && _.find(vendorList, ['id', text]).vendor) : ''}</span>;
              }
            },
            {
              title: 'OS',
              key: 'os',
              dataIndex: 'os',
              render: (text: any) => {
                return <span>{text ? (_.find(osList, ['id', text]) && _.find(osList, ['id', text]).os) : ''}</span>;
              }
            },
            {
              title: 'Version',
              key: 'version',
              dataIndex: 'version',
              render: (text: any) => {
                return <span>{text ? (_.find(versionList, ['id', text]) && _.find(versionList, ['id', text]).version) : ''}</span>;
              }
            },
            {
              title: 'ProtocolSupport',
              key: 'id',
              dataIndex: 'version',
              render: (text: any, record: any) => {
                return (
                  <span>
                    {text
                      ? (_.find(versionList, ['id', text])
                        && _.find(versionList, ['id', text]).protocols_support
                        && _.find(versionList, ['id', text]).protocols_support.map((p: any) => { return p.name; }).join('，')) : ''}
                  </span>
                );
              }
            },
          ],
        },
        {
          title: '关联信息',
          key: 'referenced',
          dataIndex: 'referenced',
          render: (text: any, record: any) => {
            const info: any[] = [];
            _.forEach(record.referenced, (value: any, key: any) => {
              info.push(value);
            });
            const content = (
              <div>
                {info.map((item, key) => {
                  return <p key={key}>{item}</p>;
                })}
              </div>
            );
            return (
              <span>
                <Popover placement="topLeft" title="关联信息" content={content}>
                  <Button>关联信息</Button>
                </Popover>
              </span>
            );
          }
        },
        {
          title: '',
          key: 'action',
          dataIndex: 'action',
          width: 200,
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
          title: '用户名',
          key: 'username',
          dataIndex: 'username',
          width: 300,
        },
        {
          title: '组名',
          key: 'group',
          dataIndex: 'group',
          width: 300,
        },
        {
          title: '',
          key: 'action',
          dataIndex: 'action',
          width: 200,
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
    }

    /**
     * 关闭模态窗
     */
    const onCancel = () => {
      this.setState({
        showAdd: false,
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
            statement = '网元数据';
            if (this.state.editData) {
              res = await netelementmanager.edit(this.state.editData.id, values);
            } else {
              res = await netelementmanager.add(values);
            }
          } else if (this.state.defaultActiveKey === '2') {
            statement = '网元用户库';
            if (this.state.editData) {
              res = await netelementusermanager.edit(this.state.editData.id, values);
            } else {
              res = await netelementusermanager.add(values);
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
      this.props.form.validateFields(['s_name', 's_ip', 's_device_type', 's_nation', 's_city', 's_room', 's_floor', 's_vendor', 's_os', 's_version'], async (err: boolean, values: any) => {
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
              &&
              < Select mode="multiple" placeholder="请选择筛选条件" className="filter-select" onChange={changeFilter} style={{ maxWidth: 800 }}>
                <Option value={'s_name'}>设备名称</Option>
                <Option value={'s_ip'}>IP</Option>
                <Option value={'s_device_type'}>设备类型</Option>
                <Option value={'s_nation'}>国家</Option>
                <Option value={'s_city'}>城市</Option>
                <Option value={'s_room'}>机房</Option>
                <Option value={'s_floor'}>楼层</Option>
                <Option value={'s_vendor'}>Vendor</Option>
                <Option value={'s_os'}>OS</Option>
                <Option value={'s_version'}>Version</Option>
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
                    this.state.filterItems.indexOf('s_name') >= 0 &&
                    <Form.Item label="设备名称">
                      {getFieldDecorator('s_name', {
                        rules: [],
                      })(
                        <Input placeholder="请输入设备名称（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_ip') >= 0 &&
                    <Form.Item label="IP">
                      {getFieldDecorator('s_ip', {
                        rules: [],
                      })(
                        <Input placeholder="请输入IP（支持模糊匹配）" />
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_device_type') >= 0 &&
                    <Form.Item label="设备类型">
                      {getFieldDecorator('s_device_type', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {this.devTypeChoices.map((p: any) => (
                            <Option value={p.value} key={p.value}>{p.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_nation') >= 0 &&
                    <Form.Item label="国家">
                      {getFieldDecorator('s_nation', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                          onSelect={this.onNationChange}
                        >
                          {nationList.map((p: any) => (
                            <Option value={p.id} key={p.id}>{p.nation}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_city') >= 0 &&
                    <Form.Item label="城市">
                      {getFieldDecorator('s_city', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                          onSelect={this.onCityChange}
                        >
                          {cityList.map((p: any) => (
                            <Option value={p.id} key={p.id}>{p.city}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_room') >= 0 &&
                    <Form.Item label="机房">
                      {getFieldDecorator('s_room', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                          onSelect={this.onRoomChange}
                        >
                          {roomList.map((p: any) => (
                            <Option value={p.id} key={p.id}>{p.room}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_floor') >= 0 &&
                    <Form.Item label="楼层">
                      {getFieldDecorator('s_floor', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {floorList.map((p: any) => (
                            <Option value={p.id} key={p.id}>{p.floor}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_vendor') >= 0 &&
                    <Form.Item label="Vendor">
                      {getFieldDecorator('s_vendor', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                          onSelect={this.onVendorChange}
                        >
                          {vendorList.map((p: any) => (
                            <Option value={p.id} key={p.id}>{p.vendor}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_os') >= 0 &&
                    <Form.Item label="OS">
                      {getFieldDecorator('s_os', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                          onSelect={this.onOSChange}
                        >
                          {osList.map((p: any) => (
                            <Option value={p.id} key={p.id}>{p.os}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  }
                  {
                    this.state.filterItems.indexOf('s_version') >= 0 &&
                    <Form.Item label="Version">
                      {getFieldDecorator('s_version', {
                        rules: [],
                      })(
                        <Select
                          style={{ width: 200 }}
                        >
                          {versionList.map((p: any) => (
                            <Option value={p.id} key={p.id}>{p.version}</Option>
                          ))}
                        </Select>
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
              <TabPane tab="网元管理" key="1" />
              <TabPane tab="网元用户库" key="2" />
            </Tabs>
            <Table
              columns={column}
              rowKey="id"
              dataSource={netElementManagerList}
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
            width={600}
          >
            {
              this.state.defaultActiveKey === '1' &&
              <AddEditNetElementManagerForm
                form={this.props.form}
                editData={this.state.editData}
                devTypeChoices={this.devTypeChoices}
              />
            }
            {
              this.state.defaultActiveKey === '2' &&
              <AddEditUserManagerForm form={this.props.form} editData={this.state.editData} />
            }

          </Modal>
        }
        {
          this.state.defaultActiveKey === '1'
          && <NetElementInfoDrawer
            drawerData={this.state.drawerData}
            onClose={onDrawerClose}
            visible={this.state.showDrawer}
            nationList={nationList}
            cityList={cityList}
            roomList={roomList}
            floorList={floorList}
            devTypeChoices={this.devTypeChoices}
            vendorList={vendorList}
            osList={osList}
            versionList={versionList}
          />
        }
      </div >
    );
  }
}

export default Form.create({})(NetElementManager);