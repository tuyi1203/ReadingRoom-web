import * as React from 'react';
import { infos, heatbeatgroups, datacenter } from 'src/api';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
import { Button, Table, Form, Divider, Popconfirm, Modal, message } from 'antd';
import HeatbeatGroupDetailDrawer from './heatbeatGroupDetailDrawer';
import AddEditModal from './addEditForm';
import _ from 'lodash';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  total: number;
  page: number;
  pageSize: number;
  infoList: any;
  dataCenterList: any;
  roleList: any;
  typeList: any;
  heatBeatGroupList: any;
  methodList: any;
  showDrawer: boolean;
  drawerData: any;
  showAdd: boolean;
  editData: any;
  nationList: any;
  cityList: any;
  roomList: any;
}

/**
 * Infos
 */
class Infos extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      infoList: [],
      dataCenterList: [], // 数据中心列表
      roleList: [],
      typeList: [],
      methodList: [],
      heatBeatGroupList: [],
      total: 0,
      showDrawer: false, // 是否显示抽屉
      drawerData: null, // 抽屉显示数据
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      nationList: [], // 国家数据列表
      cityList: [], // 城市数据列表
      roomList: [], // 机房数据列表
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
    this.getCityList();
    this.getNationList();
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
  getCityList = async () => {
    const res = await datacenter.getCityList();

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
   * 获取编排器数据列表
   */
  getList = async () => {

    const res = await infos.getList({
      page: this.state.page,
      page_size: this.state.pageSize
    });

    // const dataCenterRes = await datacenter.getList({
    //   page: 1,
    //   page_size: 1000,
    // });

    const typeRes = await infos.getTypes({});

    const roleRes = await infos.getRole({});

    const heatBeatGroupRes = await heatbeatgroups.getList({});

    const methodRes = await heatbeatgroups.getMethodList({});

    if (!res.code
      || !typeRes.code || !roleRes.code
      || !heatBeatGroupRes.code || !methodRes.code) {
      return;
    }

    if (res
      && typeRes && roleRes
      && heatBeatGroupRes && methodRes) {
      const list: any[] = [];
      res.results.data.forEach((item, index) => {
        item.heatBeatGroupInfo = _.find(heatBeatGroupRes.results.data, ['id', item.heat_beat_group]);
        item.roleInfo = _.find(roleRes.results.data, ['id', item.role]);
        item.typeInfo = _.find(typeRes.results.data, ['id', item.orchestration_type]);
        list.push(item);
      });
      this.setState({
        infoList: list,
        total: res.results.count,
        // dataCenterList: dataCenterRes.results.data,
        roleList: roleRes.results.data,
        typeList: typeRes.results.data,
        heatBeatGroupList: heatBeatGroupRes.results.data,
        methodList: methodRes.results.data,
      });
    }
  }

  render() {

    const {
      total,
      page,
      pageSize,
      infoList,
      nationList,
      cityList,
    } = this.state;

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

    /*
     * 删除一行数据
     */
    const del = async (record: any) => {
      const res = await infos.del(record.id, {});
      if (res && !res.code) {
        message.error(res.msg);
        return;
      }
      message.success('编排信息数据删除成功');
      this.getList();
    };

    /**
     * 模态窗保存
     */
    const onCancel = () => {
      this.setState({
        showAdd: false,
        editData: null
      });
    };

    /**
     * 显示添加
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

    /**
     * 模态窗保存
     */
    const onOk = () => {
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        if (!err) {
          // const { datacenter_id } = values;
          // const dataCenterInfo = _.find(this.state.dataCenterList, ['id', datacenter_id]);
          // values.datacenter = dataCenterInfo.nation_abbreviation
          //   + '_' + dataCenterInfo.city_abbreviation
          //   + '_' + dataCenterInfo.room;
          values.datacenter =
            _.find(nationList, ['nation', values.nation]).nation_abbreviation
            + '_' + _.find(cityList, ['city', values.city]).city_abbreviation
            + '_' + values.room;
          let res: any = null;
          if (this.state.editData) {
            // 编辑
            res = await infos.edit(this.state.editData.id, values);
          } else {
            // 新增
            console.log(values);
            res = await infos.add(values);
          }
          if (!res.code) {
            message.error(res.msg);
            return;
          }
          message.success('编排信息数据保存成功');
          onCancel();
          this.getList();
        }
      });
    };

    /**
     * 编排信息列
     */
    const column = [
      {
        title: '机房信息',
        key: 'datacenter',
        dataIndex: 'datacenter',
        width: 150,
      },
      {
        title: '冗余组',
        key: 'heatBeatGroupInfo.name',
        dataIndex: 'heatBeatGroupInfo.name',
        width: 150,
        render: (text: any, record: any) => {
          return (<span><a onClick={() => showDrawer(record)}>{text}</a></span>);
        }
      },
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '编排器角色',
        key: 'roleInfo.name',
        dataIndex: 'roleInfo.name',
        width: 150,
      },
      {
        title: '编排器类型',
        key: 'typeInfo.name',
        dataIndex: 'typeInfo.name',
        width: 150,
      },
      {
        title: 'IP地址',
        key: 'ip',
        dataIndex: 'ip',
        width: 150,
      },
      {
        title: '版本',
        key: 'version',
        dataIndex: 'version',
        width: 150,
      },
      {
        title: '失联时间',
        key: 'lost_at',
        dataIndex: 'lost_at',
        width: 150,
      },
      {
        title: '告警阈值',
        key: 'heatBeatGroupInfo.warning',
        dataIndex: 'heatBeatGroupInfo.warning',
        width: 150,
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
            </div>
          );
        }
      },
    ];

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
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面是本页的内容 */}
            <Table
              columns={column}
              rowKey="id"
              dataSource={infoList}
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
        <HeatbeatGroupDetailDrawer
          drawerData={this.state.drawerData}
          onClose={onDrawerClose}
          visible={this.state.showDrawer}
          methodList={this.state.methodList}
        />
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
            {<AddEditModal
              form={this.props.form}
              editData={this.state.editData}
              dataCenterList={this.state.dataCenterList}
              roleList={this.state.roleList}
              typeList={this.state.typeList}
              heatBeatGroupList={this.state.heatBeatGroupList}
            />}
          </Modal>
        }
      </div>
    );
  }
}

export default Form.create({})(Infos);