import * as React from 'react';
import { datacenter, netelement } from 'src/api';
import { Table, Button } from 'antd';
import { netelementmanager } from 'src/api';
import _ from 'lodash';
// import CommonUtils from 'src/utils/commonUtils';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  onSelect: any;
  multiple?: boolean; // 是否多选
  selectedRowKeys?: any[]; // 多选默认选中的项
  city?: any; // 需要查询的CITY
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  vendorList: any;
  osList: any;
  versionList: any;
  nationList: any;
  cityList: any;
  roomList: any;
  floorList: any;
  selectedRowKeys: any[];
  netElementList: any[];
}

/**
 * NetElementListModal
 */
class NetElementListModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      vendorList: [], // Vendor数据列表
      osList: [], // os数据列表
      versionList: [], // version数据列表
      nationList: [], // 国家数据列表
      cityList: [], // 城市数据列表
      roomList: [], // 机房数据列表
      floorList: [], // 楼层数据列表
      selectedRowKeys: [], // 多选选中的行
      netElementList: [], // 可选中的网元数据列表
    };
  }

  UNSAFE_componentWillMount() {
    console.log('拿到的city:', this.props.city);
    console.log('拿到的multiple:', this.props.multiple);
    console.log('拿到的selectedRowKeys:', this.props.selectedRowKeys);
    this.city();
    this.getVendorList();
    this.getCityList();
    this.getNationList();
    this.getRoomList();
    this.getOSList();
    this.getFloorList();
    this.getVersionList();
  }

  // 判断city
  city = async () => {
    if (this.props.city) {
      let list: any = [];
      if (typeof this.props.city === 'number') {
        list = await this.getNetElementList(this.props.city);
        this.setState({ netElementList: list });
      } else if (typeof this.props.city === 'object') {
        if (this.props.city && this.props.city.length > 0) {
          for (let index = 0; index < this.props.city.length; index++) {
            const element = this.props.city[index];
            let Netelements = await this.getNetElementList(element);
            list = list.concat(Netelements);
          }
          this.setState({ netElementList: list }, () => {
            const selectedRowKeys = this.props.selectedRowKeys;
            if (selectedRowKeys && selectedRowKeys.length > 0) {
              this.setState({
                selectedRowKeys
              });
            }
          });
        }
      }
    } else {
      this.getNetElementList2();
    }
  }
  /**
   * 获取网元信息列表
   */
  getNetElementList = async (city?: any) => {
    let param: {
      page: any,
      page_size: any,
      city?: any,
    } = {
      page: 1,
      page_size: 999
    };
    if (city) {
      param.city = city;
    }
    const res = await netelementmanager.getList(param);
    if (res.code) {
      return res.results.data;
    } else {
      return [];
    }
  }
  /**
   * 获取网元信息列表
   */
  getNetElementList2 = async () => {
    let param: {
      page: any,
      page_size: any,
    } = {
      page: this.state.page,
      page_size: this.state.pageSize
    };
    const res = await netelementmanager.getList(param);
    if (res.code) {
      this.setState({
        netElementList: res.results.data,
        total: res.results.count,
      }, () => {
        const selectedRowKeys = this.props.selectedRowKeys;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
          this.setState({
            selectedRowKeys
          });
        }
      });
    }
  }

  onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    console.log('selectedRows changed: ', selectedRows);
    this.setState({ selectedRowKeys });
    if (this.props.onSelect && typeof this.props.onSelect === 'function') {
      // console.log(typeof this.props.onSelect);
      // 回调传入选中的记录对象列表
      this.props.onSelect(selectedRowKeys, selectedRows);
    }
  }

  /**
   * 获取Vendor数据列表
   */
  getVendorList = async () => {
    const res = await netelement.getVendorList({});
    if (!res.code) {
      return;
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
    const res = await netelement.getOsList();

    if (!res.code) {
      return;
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
    const res = await netelement.getVersionList({ os });
    if (!res.code) {
      return;
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
    const res = await datacenter.getNationList();
    if (!res.code) {
      return;
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
    const res = await datacenter.getCityList();

    if (!res.code) {
      return;
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
    const res = await datacenter.getRoomList();

    if (!res.code) {
      return;
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
    const res = await datacenter.getFloorList();

    if (!res.code) {
      return;
    }

    if (res) {
      this.setState({
        floorList: res.results,
      });
    }
  }

  render() {
    const { onSelect } = this.props;
    const { netElementList } = this.state;
    const {
      total,
      page,
      pageSize,
      nationList,
      cityList,
      roomList,
      floorList,
      vendorList,
      osList,
      versionList,
    } = this.state;

    /**
     * 多选默认选中
     */
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };

    /**
     * 改变分页
     */
    const changePage = (page: number) => {
      this.setState({
        page: page
      }, () => {
        this.getNetElementList();
      });
    };

    /**
     * 改变页大小
     */
    const changePageSize = (current: number, size: number) => {
      this.setState({
        pageSize: size,
        page: 1
      }, () => {
        this.getNetElementList();
      });
    };

    let column;
    if (this.props.multiple) {
      column = [
        {
          title: '设备名称',
          key: 'name',
          dataIndex: 'name',
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
          width: 300,
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
                return <span>{text ? _.find(nationList, ['id', text]) ?.nation : ''}</span>;
              }
            },
            {
              title: '城市',
              key: 'city',
              dataIndex: 'city',
              render: (text: any, record: any) => {
                return <span>{text ? _.find(cityList, ['id', text]) ?.city : ''}</span>;
              }
            },
            {
              title: '机房',
              key: 'room',
              dataIndex: 'room',
              render: (text: any, record: any) => {
                return <span>{text ? _.find(roomList, ['id', text]) ?.room : ''}</span>;
              }
            },
            {
              title: '楼层',
              key: 'floor',
              dataIndex: 'floor',
              render: (text: any, record: any) => {
                return <span>{text ? _.find(floorList, ['id', text]) ?.floor : ''}</span>;
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
        }
      ];
    } else {
      column = [
        {
          title: '设备名称',
          key: 'name',
          dataIndex: 'name',
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
          width: 300,
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
                return <span>{text ? _.find(nationList, ['id', text]) ?.nation : ''}</span>;
              }
            },
            {
              title: '城市',
              key: 'city',
              dataIndex: 'city',
              render: (text: any, record: any) => {
                return <span>{text ? _.find(cityList, ['id', text]) ?.city : ''}</span>;
              }
            },
            {
              title: '机房',
              key: 'room',
              dataIndex: 'room',
              render: (text: any, record: any) => {
                return <span>{text ? _.find(roomList, ['id', text]) ?.room : ''}</span>;
              }
            },
            {
              title: '楼层',
              key: 'floor',
              dataIndex: 'floor',
              render: (text: any, record: any) => {
                return <span>{text ? _.find(floorList, ['id', text]) ?.floor : ''}</span>;
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
          title: '',
          key: 'action',
          dataIndex: 'action',
          width: 200,
          render: (text: any, record: any) => {
            return (
              <div>
                <Button type="primary" onClick={() => onSelect(record)}>选择</Button>
              </div>
            );
          }
        },
      ];
    }

    return (
      <div>
        {
          this.props.multiple &&
          <Table
            columns={column}
            rowKey="id"
            dataSource={netElementList}
            bordered={true}
            rowSelection={rowSelection}
            pagination={this.props.city ? false : {
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
        {
          !this.props.multiple &&
          <Table
            columns={column}
            rowKey="id"
            dataSource={netElementList}
            bordered={true}
            pagination={this.props.city ? false : {
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
    );
  }
}

export default NetElementListModal;
