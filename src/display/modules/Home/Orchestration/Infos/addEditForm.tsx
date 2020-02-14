import * as React from 'react';
import { datacenter } from 'src/api';
import { Form, Input, Select, InputNumber } from 'antd';
import CommonUtils from 'src/utils/commonUtils';
import _ from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
  dataCenterList?: any;
  roleList?: any;
  typeList?: any;
  heatBeatGroupList: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  nationList: any;
  cityList: any;
  roomList: any;
}

/**
 * AddModal
 */
class AddEditModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      // protocolSupportList: [],
      nationList: [], // 国家数据列表
      cityList: [], // 城市数据列表
      roomList: [], // 机房数据列表
    };
  }

  UNSAFE_componentWillMount() {
    this.initRoomList();
  }

  /**
   * 初始化机房信息下拉框
   */
  initRoomList = async () => {
    const res = await datacenter.getNationList();
    if (!res.code) {
      return;
    }
    console.log(res);

    if (res) {
      this.setState({
        nationList: res.results,
      }, async () => {
        if (this.props.editData) {
          const nation = _.find(this.state.nationList, ['nation_abbreviation', this.props.editData.datacenter.split('_')[0]]).id;
          const cityRes = await datacenter.getCityList({
            nation
          });
          if (!cityRes.code) {
            return;
          }
          if (cityRes) {
            this.setState({
              cityList: cityRes.results,
            }, async () => {
              const city = _.find(this.state.cityList, ['city_abbreviation', this.props.editData.datacenter.split('_')[1]]).id;
              const roomRes = await datacenter.getRoomList({
                city
              });
              if (!roomRes.code) {
                return;
              }
              if (roomRes) {
                this.setState({
                  roomList: roomRes.results,
                });
              }
            });
          }
        }
      });
    }
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
   * 国家数据发生改变
   */
  onNationChange = (value: string) => {
    this.clearFieldValue(['city', 'room']);
    this.getCityList(value);
  }

  /**
   * 获取城市数据列表
   */
  getCityList = async (value?: string) => {
    let res;
    if (value && value.length > 0) {
      const natioId = _.find(this.state.nationList, ['nation', value]).id;
      res = await datacenter.getCityList({
        nation: natioId
      });
    } else {
      res = await datacenter.getCityList();
    }

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
   * 城市数据发生改变
   */
  onCityChange = (value: string) => {
    this.clearFieldValue(['room']);
    this.getRoomList(value);
  }

  /**
   * 获取机房数据列表
   */
  getRoomList = async (value?: string) => {
    let res;
    if (value && value.length > 0) {
      const cityId = _.find(this.state.cityList, ['city', value]).id;
      res = await datacenter.getRoomList({
        city: cityId
      });
    } else {
      res = await datacenter.getRoomList();
    }
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

  render() {
    const {
      editData,
      dataCenterList,
      roleList,
      typeList,
      heatBeatGroupList
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    console.log(dataCenterList);
    const { nationList, cityList, roomList } = this.state;

    /**
     * 获取数据中心选项
     */
    // const getDataCenterOptions = () => {
    //   const list: any[] = [];
    //   if (dataCenterList && dataCenterList.length > 0) {
    //     dataCenterList.forEach((p: any) => {
    //       list.push({
    //         label: p.nation_abbreviation + '_' + p.city_abbreviation + '_' + p.room,
    //         value: p.id
    //       });
    //     });
    //   }
    //   return list;
    // };

    /**
     * 获取编排器角色选项
     */
    const getRoleOptions = () => {
      const list: any[] = [];
      if (roleList && roleList.length > 0) {
        roleList.forEach((p: any) => {
          list.push({
            label: p.name,
            value: p.id
          });
        });
      }
      return list;
    };

    /**
     * 获取编排器类型选项
     */
    const getTypeOptions = () => {
      const list: any[] = [];
      if (typeList && typeList.length > 0) {
        typeList.forEach((p: any) => {
          list.push({
            label: p.name,
            value: p.id
          });
        });
      }
      return list;
    };

    /**
     * 获取编排器冗余组选项
     */
    const getHeatbeatGroupOptions = () => {
      const list: any[] = [];
      if (heatBeatGroupList && heatBeatGroupList.length > 0) {
        heatBeatGroupList.forEach((p: any) => {
          list.push({
            label: p.name,
            value: p.id
          });
        });
      }
      return list;
    };

    /**
     * IP地址
     */
    const validateIP = (rule: any, value: number, callback: any, label: string) => {
      if (!value || !CommonUtils.regex('ip', value.toString())) {
        callback(label + '的格式必须正确');
      }
      callback();
    };

    return (
      <Form className="modal-form" layout="inline" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        {/* <FormItem label="机房信息">
          {getFieldDecorator('datacenter_id', {
            initialValue: editData ? editData.datacenter_id : null,
            rules: [
              { required: true, message: '请选择机房信息' }
            ],
          })(
            <Select
              style={{ width: 200 }}
            >
              {getDataCenterOptions().map((type: any) => (
                <Option value={type.value} key={type.value}>{type.label}</Option>
              ))}
            </Select>
          )}
        </FormItem> */}
        <FormItem label="国家">
          {getFieldDecorator('nation', {
            initialValue: editData ? _.find(nationList, ['nation_abbreviation', editData.datacenter.split('_')[0]])?.nation : null,
            rules: [
              { required: true, message: '请选择国家' }
            ],
          })(
            <Select
              style={{ width: 120 }}
              onChange={this.onNationChange}
            >
              {nationList.map((nation: any) => (
                <Option value={nation.nation} key={nation.nation}>{nation.nation}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="城市">
          {getFieldDecorator('city', {
            initialValue: editData ? _.find(cityList, ['city_abbreviation', editData.datacenter.split('_')[1]])?.city : null,
            rules: [
              { required: true, message: '请选择城市' }
            ],
          })(
            <Select
              style={{ width: 120 }}
              onChange={this.onCityChange}
            >
              {cityList.map((city: any) => (
                <Option value={city.city} key={city.city}>{city.city}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="机房">
          {getFieldDecorator('room', {
            initialValue: editData ? editData.datacenter.split('_')[2] : null,
            rules: [
              { required: true, message: '请选择机房' }
            ],
          })(
            <Select
              style={{ width: 120 }}
            >
              {roomList.map((room: any) => (
                <Option value={room.room} key={room.room}>{room.room}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="冗余组">
          {getFieldDecorator('heat_beat_group', {
            initialValue: editData ? editData.heat_beat_group : null,
            rules: [
              { required: true, message: '请选择冗余组' }
            ],
          })(
            <Select
              style={{ width: 200 }}
            >
              {getHeatbeatGroupOptions().map((type: any) => (
                <Option value={type.value} key={type.value}>{type.label}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="编排器角色">
          {getFieldDecorator('role', {
            initialValue: editData ? editData.role : null,
            rules: [
              { required: true, message: '请选择编排器角色' }
            ],
          })(
            <Select
              style={{ width: 200 }}
            >
              {getRoleOptions().map((type: any) => (
                <Option value={type.value} key={type.value}>{type.label}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="编排器类型">
          {getFieldDecorator('orchestration_type', {
            initialValue: editData ? editData.orchestration_type : null,
            rules: [
              { required: true, message: '请选择编排器类型' }
            ],
          })(
            <Select
              style={{ width: 200 }}
            >
              {getTypeOptions().map((type: any) => (
                <Option value={type.value} key={type.value}>{type.label}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="编排器名称">
          {getFieldDecorator('name', {
            initialValue: editData ? editData.name : null,
            rules: [
              { required: true, message: '请输入编排器名称' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="编排器用户名">
          {getFieldDecorator('username', {
            initialValue: editData ? editData.username : null,
            rules: [
              { required: true, message: '请输入编排器用户名' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="编排器用户密码">
          {getFieldDecorator('password', {
            initialValue: editData ? editData.password : null,
            rules: [
              { required: true, message: '请输入编排器用户密码' }
            ],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem label="IP">
          {getFieldDecorator('ip', {
            initialValue: editData ? editData.ip : null,
            rules: [
              {
                validator: (rule: any, value: number, callback: any, label: string) => {
                  validateIP(rule, value, callback, 'ip');
                }
              },
              { required: true, message: '请输入IP' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="Port">
          {getFieldDecorator('port', {
            initialValue: editData ? editData.port : null,
            rules: [
              { required: true, message: '请输入Port' }
            ],
          })(
            <InputNumber />
          )}
        </FormItem>
        <FormItem label="编排器描述">
          {getFieldDecorator('description', {
            initialValue: editData ? editData.description : null,
            rules: [
            ],
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default AddEditModal;
