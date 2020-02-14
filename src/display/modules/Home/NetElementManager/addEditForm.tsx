import * as React from 'react';
import { Form, Input, Select, Divider, Row, Col, Button, message } from 'antd';
import { netelement, netelementcustom, netelementusermanager, datacenter } from 'src/api';
import CommonUtils from 'src/utils/commonUtils';
import _ from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  devTypeChoices: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  // protocolSupportList: any[];
  userList: any;
  deviceTypeList: any;
  netElementList: any;
  dataCenterList: any;
  nationList: any;
  cityList: any;
  roomList: any;
  floorList: any;
  vendorList: any;
  osList: any;
  versionList: any;
  protocolList: any;
  connTestParam: {
    device_type: any,
    ip: any,
    port: any,
    username: any,
    password: any,
    net_device_type: any;
  };
}

/**
 * AddModal
 */
class AddEditModal extends React.PureComponent<IProps, IState> {

  port = 23;

  constructor(props: any) {
    super(props);
    this.state = {
      // protocolSupportList: [],
      userList: [],
      deviceTypeList: [],
      netElementList: [],
      dataCenterList: [],
      nationList: [],
      cityList: [],
      roomList: [],
      floorList: [],
      vendorList: [],
      osList: [],
      protocolList: [],
      versionList: [],
      connTestParam: {
        device_type: '',
        ip: '',
        port: null,
        username: '',
        password: '',
        net_device_type: null,
      }
    };
  }

  UNSAFE_componentWillMount() {
    // this.getProtocolSupportList();
    this.getUserList();
    this.getDeviceTypeList();
    // this.getNetElementList();
    // this.getDataCenterList();
    this.getNationList();
    this.getVendorList();
    if (this.props.editData) {
      const { device_type_id, user, ip, port, net_device_type } = this.props.editData;
      this.setState({
        connTestParam: {
          device_type: device_type_id ? _.find(this.props.devTypeChoices, ['value', device_type_id])?.label : '',
          ip,
          port,
          username: user ? user.username : '',
          password: user ? user.password : '',
          net_device_type,
        }
      });

      this.getCityList(this.props.editData.nation);
      this.getRoomList(this.props.editData.city);
      this.getFloorList(this.props.editData.room);
      this.getOSList(this.props.editData.vendor);
      this.getVersionAndProtocol(this.props.editData.os);
      // this.getProtocolList(this.props.editData.version);
    }
  }

  /**
   * 获取国家数据列表
   */
  getNationList = async () => {
    const res = await datacenter.getNationList();
    if (!res.code) {
      return;
    }
    console.log(res);

    if (res) {
      this.setState({
        nationList: res.results,
      });
    }
  }

  /**
   * 获取城市数据列表
   */
  getCityList = async (value: number) => {
    const res = await datacenter.getCityList({
      nation: value
    });
    if (!res.code) {
      return;
    }
    console.log(res);

    if (res) {
      this.setState({
        cityList: res.results,
      });
    }
  }

  /**
   * 国家数据发生改变
   */
  onNationChange = (value: number) => {
    this.clearFieldValue(['city', 'room', 'floor']);
    this.getCityList(value);
  }

  /**
   * 城市数据发生改变
   */
  onCityChange = (value: number) => {
    this.clearFieldValue(['room', 'floor']);
    this.getRoomList(value);
  }

  /**
   * 机房数据发生改变
   */
  onRoomChange = (value: number) => {
    this.clearFieldValue(['floor']);
    this.getFloorList(value);
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

  /**
   * 清除关联数据残留
   */
  clearFieldAndProtocal = (fieldNames: string[]) => {
    let obj = {};
    fieldNames.forEach((element: string) => {
      obj[element] = '';
    });
    this.props.form.setFieldsValue(obj);
    this.setState({
      protocolList: [],
    });
  }

  /**
   * 获取机房数据列表
   */
  getRoomList = async (value: number) => {
    const res = await datacenter.getRoomList({
      city: value
    });
    if (!res.code) {
      return;
    }
    console.log(res);

    if (res) {
      this.setState({
        roomList: res.results,
      });
    }
  }

  /**
   * 获取楼层数据列表
   */
  getFloorList = async (value: number) => {
    const res = await datacenter.getFloorList({
      room: value
    });
    if (!res.code) {
      return;
    }
    console.log(res);

    if (res) {
      this.setState({
        floorList: res.results,
      });
    }
  }

  /**
   * 获取Vendor数据列表
   */
  getVendorList = async () => {
    const res = await netelement.getVendorList();
    if (!res.code) {
      return;
    }
    console.log(res);

    if (res) {
      this.setState({
        vendorList: res.results,
      });
    }
  }

  /**
   * Vendor数据发生改变
   */
  onVendorChange = (value: number) => {
    this.clearFieldAndProtocal(['os', 'version']);
    this.getOSList(value);
  }

  /**
   * OS数据发生改变
   */
  onOSChange = (value: number) => {
    this.clearFieldAndProtocal(['version']);
    this.getVersionList(value);
  }

  /**
   * Version数据发生改变
   */
  onVersionChange = (value: number) => {
    this.getProtocolList(value);
  }

  /**
   * 获取OS数据列表
   */
  getOSList = async (value: number) => {
    const res = await netelement.getOsList({
      vendor: value,
    });
    if (!res.code) {
      return;
    }
    console.log(res);

    if (res) {
      this.setState({
        osList: res.results,
      });
    }
  }

  /**
   * 获取Version数据列表
   */
  getVersionList = async (value: number) => {
    const res = await netelement.getVersionList({
      os: value,
    });
    if (!res.code) {
      return;
    }
    console.log(res);

    if (res) {
      this.setState({
        versionList: res.results,
      });
    }
  }

  /**
   * 获取Version数据列表
   */
  getVersionAndProtocol = async (value: number) => {
    const res = await netelement.getVersionList({
      os: value,
    });
    if (!res.code) {
      return;
    }
    console.log(res);

    if (res) {
      this.setState({
        versionList: res.results,
      }, () => {
        if (this.props.editData) {
          this.getProtocolList(this.props.editData.version);
        }
      });
    }
  }

  /**
   * 获取支持协议
   */
  getProtocolList = (value: number) => {
    const list = _.find(this.state.versionList, ['id', value])?.protocols_support || [];
    this.setState({
      protocolList: list,
    });
  }

  /**
   * 获取支持协议
   */
  // getProtocolSupportList = async () => {
  //   const res = await netelement.getProtocolSupport({});
  //   if (res.code) {
  //     this.setState({
  //       protocolSupportList: res.results
  //     });
  //   }
  // }

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
   * 获取设备类型列表
   */
  getDeviceTypeList = async () => {
    const res = await netelementcustom.getList({
      page: 1,
      page_size: 1000
    });
    if (res.code) {
      this.setState({
        deviceTypeList: res.results.data,
      });
    }
  }

  /**
   * 获取网元信息列表
   */
  // getNetElementList = async () => {
  //   const res = await netelement.getList({
  //     page: 1,
  //     page_size: 1000
  //   });
  //   if (res.code) {
  //     this.setState({
  //       netElementList: res.results.data,
  //     });
  //   }
  // }

  /**
   * 获取数据中心列表
   */
  getDataCenterList = async () => {
    const res = await datacenter.getList({
      page: 1,
      page_size: 1000
    });
    if (res.code) {
      this.setState({
        dataCenterList: res.results.data,
      });
    }
  }

  render() {
    const { editData,
      devTypeChoices,
    } = this.props;
    // console.log(editData);
    const { getFieldDecorator } = this.props.form;
    const {
      // protocolSupportList,
      userList,
      deviceTypeList,
      dataCenterList,
      // netElementList,
      nationList,
      cityList,
      roomList,
      floorList,
      vendorList,
      osList,
      versionList,
      protocolList,
    } = this.state;

    console.log(dataCenterList);

    /**
     * 获取ProtocolSupport选项
     */
    // const getProtocolSupportOptions = () => {
    //   const list: any[] = [];
    //   if (protocolSupportList && protocolSupportList.length > 0) {
    //     protocolSupportList.forEach(p => {
    //       list.push({
    //         label: p.name,
    //         value: p.id
    //       });
    //     });
    //   }
    //   return list;
    // };

    /**
     * 获取网元用户选项
     */
    const getUserOptions = () => {
      const list: any[] = [];
      if (userList && userList.length > 0) {
        userList.forEach((p: any) => {
          list.push({
            label: p.username,
            value: p.id
          });
        });
      }
      return list;
    };

    /**
     * 获取设备类型选项
     */
    const getDeviceTypeOptions = () => {
      const list: any[] = [];
      if (deviceTypeList && deviceTypeList.length > 0) {
        deviceTypeList.forEach((p: any) => {
          list.push({
            label: p.type_name + '_' + p.capability_name,
            value: p.id
          });
        });
      }
      return list;
    };

    /**
     * 获取网元信息选项
     */
    // const getNetElementOptions = () => {
    //   const list: any[] = [];
    //   if (netElementList && netElementList.length > 0) {
    //     netElementList.forEach((p: any) => {
    //       list.push({
    //         label: p.vendor,
    //         value: p.id
    //       });
    //     });
    //   }
    //   return list;
    // };

    /**
     * 获取数据中心选项
     */
    // const getDataCenterOptions = () => {
    //   const list: any[] = [];
    //   if (dataCenterList && dataCenterList.length > 0) {
    //     dataCenterList.forEach((p: any) => {
    //       list.push({
    //         label: p.nation,
    //         value: p.id
    //       });
    //     });
    //   }
    //   return list;
    // };

    /*
     * 连接用户选中值发生变化时改变相关信息
     */
    const onChangeUser = (value: number) => {
      const user = _.find(userList, ['id', value]);
      const { device_type, ip, port, net_device_type } = this.state.connTestParam;
      this.setState({
        connTestParam: {
          device_type,
          ip,
          port,
          net_device_type,
          username: user.username,
          password: user.password,
        }
      });
    };

    /*
     * 设备类型选中值发生变化时改变相关信息
     */
    const onChangeDeviceType = (value: number) => {
      const device = _.find(deviceTypeList, ['id', value]);
      const { username, password, ip, port, net_device_type } = this.state.connTestParam;
      this.setState({
        connTestParam: {
          device_type: device.type_name,
          ip,
          port,
          net_device_type,
          username,
          password,
        }
      });
    };

    /*
     * 网元信息选中值发生变化时改变相关信息
     */
    // const onChangeElement = (value: number) => {
    //   const element = _.find(netElementList, ['id', value]);
    //   const { os, version, protocols_support } = element;
    //   this.props.form.setFieldsValue({
    //     os,
    //     version,
    //     protocols_support: protocols_support.map((p: any) => { return p.id; }),
    //   });
    // };

    /*
     * 数据中心选中值发生变化时改变相关信息
     */
    // const onChangeDataCenter = (value: number) => {
    //   const dataCenter = _.find(dataCenterList, ['id', value]);
    //   const { city, room, floor } = dataCenter;
    //   this.props.form.setFieldsValue({
    //     city,
    //     room,
    //     floor,
    //   });
    // };

    /*
     * 连接测试按钮触发事件
     */
    const onConnTestBtnClick = async (event: any) => {
      this.props.form.validateFields(['ip', 'user_id', 'device_type_id', 'port'], async (err: boolean, values: any) => {
        if (!err) {
          // 取得IP和端口号
          const ip = this.props.form.getFieldValue('ip');
          const port = this.props.form.getFieldValue('port') || this.port;
          const deviceTypeId = this.props.form.getFieldValue('device_type_id');
          const userId = this.props.form.getFieldValue('user_id');
          const { username, password } = this.state.connTestParam;
          const params = {
            device_type: _.find(this.props.devTypeChoices, ['value', deviceTypeId])?.label,
            username,
            password,
            ip,
            port,
            // net_device_type: netDeviceType,
            netelementuser_id: userId
          };
          const res = await netelement.deviceConn(params);
          if (!res.code) {
            message.error(res.msg);
            return;
          }
          if (res.results && res.results.name) {
            this.props.form.setFieldsValue({
              'name': res.results.name,
            });
            return message.success('连接测试成功!');
          }
          message.error('连接测试失败!');
        }
      });
    };

    /**
     * ip地址校验
     */
    const validateIP = (rule: any, value: any, callback: any) => {
      if (!value || !CommonUtils.regex('ip', value)) {
        callback('IP地址必填且必须为正确的格式');
      }
      callback();
    };

    return (
      <div>
        <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Row>
            <Col span={24}>
              <FormItem label="设备名称">
                {getFieldDecorator('name', {
                  initialValue: editData ? editData.name : null,
                  rules: [
                    { required: true, message: '请输入设备名称' }
                  ],
                })(
                  <Input disabled={true} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="设备IP">
                {getFieldDecorator('ip', {
                  initialValue: editData ? editData.ip : null,
                  rules: [
                    {
                      validator: validateIP,
                    },
                    { required: true, message: '请输入IP地址' }
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="端口号">
                {getFieldDecorator('port', {
                  initialValue: editData ? editData.port : this.port,
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <FormItem label="连接用户" style={{ paddingLeft: 31 }} >
                {getFieldDecorator('user_id', {
                  initialValue: (editData && editData.user) ? editData.user.id : null,
                  rules: [
                    { required: true, message: '请选择连接用户' }
                  ],
                })(
                  <Select
                    style={{ width: 200 }}
                    onChange={onChangeUser}
                  >
                    {getUserOptions().map((user: any) => (
                      <Option value={user.value} key={user.value}>{user.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={onConnTestBtnClick}>连接测试</Button>
            </Col>
          </Row>
          <FormItem label="NETMIKO设备类型">
            {getFieldDecorator('device_type_id', {
              initialValue: editData ? editData.device_type_id : null,
              rules: [
                { required: true, message: 'NETMIKO设备类型' }
              ],
            })(
              <Select
                style={{ width: 200 }}
              >
                {devTypeChoices.map((type: any) => (
                  <Option value={type.value} key={type.value}>{type.label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="设备类型">
            {getFieldDecorator('net_element_device_type_id', {
              initialValue: (editData && editData.net_element_device_type_id) ? editData.net_element_device_type_id : null,
              rules: [
                { required: true, message: '请选择设备类型' }
              ],
            })(
              <Select
                style={{ width: 200 }}
                onChange={onChangeDeviceType}
              >
                {getDeviceTypeOptions().map((type: any) => (
                  <Option value={type.value} key={type.value}>{type.label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="位置信息">
            {getFieldDecorator('location_info', {
              initialValue: editData ? editData.location_info : null,
              rules: [
                { required: true, message: '请输入位置信息' }
              ],
            })(
              <Input />
            )}
          </FormItem>
          <Divider />
          <p style={{ marginBottom: 12, marginTop: 12 }}>网元信息</p>
          <FormItem label="Vendor">
            {getFieldDecorator('vendor', {
              initialValue: editData ? editData.vendor : null,
              rules: [
                { required: true, message: '请选择Vendor' }
              ],
            })(
              <Select
                style={{ width: 120 }}
                onChange={this.onVendorChange}
              >
                {vendorList.map((vendor: any) => (
                  <Option value={vendor.id} key={vendor.id}>{vendor.vendor}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="OS">
            {getFieldDecorator('os', {
              initialValue: editData ? editData.os : null,
              rules: [
                { required: true, message: '请选择OS' }
              ],
            })(
              <Select
                style={{ width: 120 }}
                onChange={this.onOSChange}
              >
                {osList.map((os: any) => (
                  <Option value={os.id} key={os.id}>{os.os}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="Version">
            {getFieldDecorator('version', {
              initialValue: editData ? editData.version : null,
              rules: [
                { required: true, message: '请选择Version' }
              ],
              // rules: [
              //   { required: true, message: '请输入位置信息' }
              // ],
            })(
              <Select
                style={{ width: 120 }}
                onChange={this.onVersionChange}
              >
                {versionList.map((version: any) => (
                  <Option value={version.id} key={version.id}>{version.version}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="Protocol support">
            {protocolList.map((p: any) => { return p.name; }).join('，')}
          </FormItem>
          <Divider />
          <p style={{ marginBottom: 12, marginTop: 12 }}>数据中心</p>
          <FormItem label="国家">
            {getFieldDecorator('nation', {
              initialValue: editData ? editData.nation : null,
              rules: [
                { required: true, message: '请选择国家' }
              ],
            })(
              <Select
                style={{ width: 120 }}
                onChange={this.onNationChange}
              >
                {nationList.map((nation: any) => (
                  <Option value={nation.id} key={nation.id}>{nation.nation}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="城市">
            {getFieldDecorator('city', {
              initialValue: editData ? editData.city : null,
              rules: [
                { required: true, message: '请选择城市' }
              ],
            })(
              <Select
                style={{ width: 120 }}
                onChange={this.onCityChange}
              >
                {cityList.map((city: any) => (
                  <Option value={city.id} key={city.id}>{city.city}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="机房">
            {getFieldDecorator('room', {
              initialValue: editData ? editData.room : null,
              rules: [
                { required: true, message: '请选择机房' }
              ],
            })(
              <Select
                style={{ width: 120 }}
                onChange={this.onRoomChange}
              >
                {roomList.map((room: any) => (
                  <Option value={room.id} key={room.id}>{room.room}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="楼层">
            {getFieldDecorator('floor', {
              initialValue: editData ? editData.floor : null,
              rules: [
                { required: true, message: '请选择楼层' }
              ],
            })(
              <Select
                style={{ width: 120 }}
              >
                {floorList.map((floor: any) => (
                  <Option value={floor.id} key={floor.id}>{floor.floor}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default AddEditModal;
