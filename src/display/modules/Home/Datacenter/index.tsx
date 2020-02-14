import * as React from 'react';
import { datacenter } from 'src/api';
import { Button, Form, Table, message, Divider, Popconfirm, Modal, Row, Col, Card, Tree } from 'antd';
// import { Button, Form, message, Modal, Row, Col, Card, Tree } from 'antd';
import AddEditModal from './addEditForm';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';

const { TreeNode } = Tree;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  dataCenterList: any;
  showAdd: boolean;
  editData: any;
  nationTree: any[];
  cityTree: any[];
  roomTree: any[];
  floorTree: any[];
  selectedTreeNode: any;
  treeData: any[];
}

/**
 * Datacenter
 */
class Datacenter extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      dataCenterList: [], // 数据中心字典列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      nationTree: [], // 国家树数据
      cityTree: [], // 城市树数据
      roomTree: [], // 机房树数据
      floorTree: [], // 楼层树数据
      selectedTreeNode: null, // 选择的树节点
      treeData: [], // 树形结构数据
    };
  }

  UNSAFE_componentWillMount() {
    // this.getList();
    this.getNationTree();
  }

  /**
   * 获取国家树
   */
  getNationTree = async () => {
    const res = await datacenter.getNationList();
    if (res.code) {
      this.setState({
        nationTree: res.results
      }, () => {
        this.getCityTree();
      });
    }
  }

  /**
   * 获取城市树
   */
  getCityTree = async () => {
    const res = await datacenter.getCityList();
    if (res.code) {
      this.setState({
        cityTree: res.results
      }, () => {
        this.getRoomTree();
      });
    }
  }

  /**
   * 获取机房树
   */
  getRoomTree = async () => {
    const res = await datacenter.getRoomList();
    if (res.code) {
      this.setState({
        roomTree: res.results
      }, () => {
        this.getFloorTree();
      });
    }
  }

  /**
   * 获取楼层树
   */
  getFloorTree = async () => {
    const res = await datacenter.getFloorList();
    if (res.code) {
      this.setState({
        floorTree: res.results
      }, () => {
        this.getTreeData();
        this.getList();
      });
    }
  }

  /**
   * 组装属性数据
   */
  getTreeData = () => {
    const { nationTree, cityTree, roomTree, floorTree } = this.state;
    const treeData: any[] = [];
    if (nationTree && nationTree.length > 0) {
      nationTree.forEach(p => {
        const nation: any = {
          id: p.id,
          key: 'nation-' + p.id,
          name: p.nation + '-' + p.nation_abbreviation,
          data: p,
          type: 'nation',
          children: []
        };

        // 找子节点
        if (cityTree && cityTree.length > 0) {
          const subCity = cityTree.filter(o => o.nation === p.id);
          if (subCity && subCity.length > 0) {
            const subCitys: any[] = [];
            subCity.forEach((k: any) => {
              const city: any = {
                id: k.id,
                key: 'city-' + k.id,
                name: k.city + '-' + k.city_abbreviation,
                data: k,
                type: 'city',
                children: []
              };
              // 找子节点
              if (roomTree && roomTree.length > 0) {
                const subRoom = roomTree.filter(o => o.city === k.id);
                if (subRoom && subRoom.length > 0) {
                  const subRooms: any[] = [];
                  subRoom.forEach(s => {
                    const room: any = {
                      id: s.id,
                      key: 'room-' + s.id,
                      name: s.room,
                      data: s,
                      type: 'room',
                      children: []
                    };

                    // 找子节点
                    if (floorTree && floorTree.length > 0) {
                      const subFloor = floorTree.filter(o => o.room === s.id);
                      if (subFloor && subFloor.length > 0) {
                        const subFloors: any[] = [];
                        subFloor.forEach(a => {
                          subFloors.push({
                            id: a.id,
                            key: 'floor-' + a.id,
                            name: a.floor,
                            data: a,
                            type: 'floor',
                            children: []
                          });
                        });
                        room.children = subFloors;
                      }
                    }

                    subRooms.push(room);
                  });
                  city.children = subRooms;
                }
              }
              subCitys.push(city);
            });
            nation.children = subCitys;
          }
        }

        treeData.push(nation);
      });
    }

    // console.log(treeData);

    this.setState({
      treeData: treeData
    });
  }

  /**
   * 获取数据中心字典列表
   */
  getList = async () => {
    // console.log(this.state.defaultActiveKey);
    const { selectedTreeNode } = this.state;
    let res;
    if (!selectedTreeNode) {
      // 查询nation
      res = await datacenter.getNationPageList({
        page: this.state.page,
        page_size: this.state.pageSize
      });
    } else if (selectedTreeNode.type === 'nation') {
      // 查询city
      res = await datacenter.getCityPageList({
        page: this.state.page,
        page_size: this.state.pageSize,
        nation: selectedTreeNode.id
      });
    } else if (selectedTreeNode.type === 'city') {
      // 查询room
      res = await datacenter.getRoomPageList({
        page: this.state.page,
        page_size: this.state.pageSize,
        city: selectedTreeNode.id
      });
    } else {
      // 查询floor
      res = await datacenter.getFloorPageList({
        page: this.state.page,
        page_size: this.state.pageSize,
        room: selectedTreeNode.id
      });
    }
    // if (this.state.selectedTreeNode.type)
    // res = await datacenter.getList({
    //   page: this.state.page,
    //   page_size: this.state.pageSize
    // });
    // // console.log(res.code);
    if (!res.code) {
      return;
    }

    this.setState({
      dataCenterList: res.results.data,
      total: res.results.count
    });
  }

  render() {

    // const { total, page, pageSize, dataCenterList } = this.state;
    const { selectedTreeNode, editData } = this.state;

    /**
     * 获取类型名称
     */
    const getTypeName = (type: string): string => {
      let name;
      switch (type) {
        case 'nation':
          name = '国家';
          break;
        case 'city':
          name = '城市';
          break;
        case 'room':
          name = '机房';
          break;
        default:
          name = '楼层';
          break;
      }

      return name;
    };

    /**
     * 删除一行数据
     */
    const del = async (record: any) => {
      // const res = await datacenter.del(record.id, {});
      let res: any;
      if (!selectedTreeNode) {
        res = await datacenter.delNation(record.id);
      } else if (selectedTreeNode.type === 'nation') {
        res = await datacenter.delCity(record.id);
      } else if (selectedTreeNode.type === 'city') {
        res = await datacenter.delRoom(record.id);
      } else if (selectedTreeNode.type === 'room') {
        res = await datacenter.delFloor(record.id);
      }
      if (res && !res.code) {
        message.error(res.msg);
        return;
      }
      message.success('数据中心字典删除成功');
      this.getNationTree();
      this.getList();
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
     * 获取表格列定义
     */
    const getChildrenColumn = () => {
      let columns: any = [];
      if (!selectedTreeNode) {
        columns = [
          {
            title: '类型',
            key: 'type',
            dataIndex: 'type',
            width: 100,
            render: (text: any, record: any) => {
              return <span>{getTypeName('nation')}</span>;
            }
          },
          // {
          //   title: 'id',
          //   key: 'id',
          //   dataIndex: 'id',
          //   width: 100
          // },
          {
            title: '国家',
            key: 'nation',
            dataIndex: 'nation',
            width: 100
          },
          {
            title: '简称',
            key: 'nation_abbreviation',
            dataIndex: 'nation_abbreviation',
            width: 100
          },
        ];
      } else {
        if (selectedTreeNode.type === 'nation') {
          // city
          columns = [
            {
              title: '类型',
              key: 'type',
              dataIndex: 'type',
              width: 100,
              render: (text: any, record: any) => {
                return <span>{getTypeName('city')}</span>;
              }
            },
            // {
            //   title: 'id',
            //   key: 'id',
            //   dataIndex: 'id',
            //   width: 100
            // },
            {
              title: '城市',
              key: 'city',
              dataIndex: 'city',
              width: 100
            },
            {
              title: '简称',
              key: 'city_abbreviation',
              dataIndex: 'city_abbreviation',
              width: 100
            },
          ];
        } else if (selectedTreeNode.type === 'city') {
          // room
          columns = [
            {
              title: '类型',
              key: 'type',
              dataIndex: 'type',
              width: 100,
              render: (text: any, record: any) => {
                return <span>{getTypeName('room')}</span>;
              }
            },
            // {
            //   title: 'id',
            //   key: 'id',
            //   dataIndex: 'id',
            //   width: 100
            // },
            {
              title: '机房',
              key: 'room',
              dataIndex: 'room',
              width: 200
            }
          ];
        } else if (selectedTreeNode.type === 'room') {
          // floor
          columns = [
            {
              title: '类型',
              key: 'type',
              dataIndex: 'type',
              width: 100,
              render: (text: any, record: any) => {
                return <span>{getTypeName('floor')}</span>;
              }
            },
            // {
            //   title: 'id',
            //   key: 'id',
            //   dataIndex: 'id',
            //   width: 100
            // },
            {
              title: '楼层',
              key: 'floor',
              dataIndex: 'floor',
              width: 200
            }
          ];
        }
      }

      columns.push(
        {
          title: '操作',
          key: 'action',
          width: 200,
          dataIndex: 'action',
          render: (text: any, record: any) => {
            return (
              <span><Button type="primary" onClick={() => { showEdit(record); }}>编辑</Button><Divider type="vertical" />
                <Popconfirm title="确认删除吗?" onConfirm={() => del(record)}>
                  <Button type="danger">删除</Button>
                </Popconfirm>
              </span>);
          }
        },
      );

      return columns;
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
     * 模态窗保存
     */
    const onOk = () => {
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        if (!err) {
          let res: any = null;
          if (!selectedTreeNode) {
            // nation
            if (editData) {
              res = await datacenter.editNation(editData.id, values);
            } else {
              res = await datacenter.addNation(values);
            }
          } else if (selectedTreeNode.type === 'nation') {
            values.nation = selectedTreeNode.id;
            // city
            if (editData) {
              res = await datacenter.editCity(editData.id, values);
            } else {
              res = await datacenter.addCity(values);
            }
          } else if (selectedTreeNode.type === 'city') {
            values.city = selectedTreeNode.id;
            // room
            if (editData) {
              res = await datacenter.editRoom(editData.id, values);
            } else {
              res = await datacenter.addRoom(values);
            }
          } else if (selectedTreeNode.type === 'room') {
            values.room = selectedTreeNode.id;
            // floor
            if (editData) {
              res = await datacenter.editFloor(editData.id, values);
            } else {
              res = await datacenter.addFloor(values);
            }
          }
          if (!res.code) {
            message.error(res.msg);
            return;
          }
          message.success('数据中心字典数据保存成功');
          onCancel();
          this.getNationTree();
          this.getList();
        }
      });
    };

    /**
     * 获取子树节点
     */
    const getSubTree = (children: any[]) => {
      const list: any[] = [];
      if (children && children.length > 0) {
        children.forEach(p => {
          list.push(
            <TreeNode title={p.name + '（' + getTypeName(p.type) + '）'} key={p.key} type={p.type} data={p}>{getSubTree(p.children)}</TreeNode>
          );
        });
      }
      return list;
    };

    /**
     * 选中树
     */
    const treeSelect = (a: any, b: any) => {
      // console.log(a);
      // console.log(b);
      this.setState({
        selectedTreeNode: b.node.props.data,
        page: 1,
        pageSize: 10
      }, () => {
        this.getList();
      });
    };

    /**
     * 选中节点标题
     */
    const getSelectTitle = () => {
      if (this.state.selectedTreeNode) {
        // console.log(this.state.selectedTreeNode);
        return <div key="info">{this.state.selectedTreeNode.name}（{getTypeName(this.state.selectedTreeNode.type)}）</div>;
      }

      return <div key="info">全部</div>;
    };

    /**
     * 获取按钮
     */
    const getExtra = () => {
      const list: any[] = [];
      if (!this.state.selectedTreeNode || (this.state.selectedTreeNode && this.state.selectedTreeNode.type !== 'floor')) {
        list.push(<Button key="add" type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button>);
      }
      return list;
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
            {/* <Button type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button> */}
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面是本页的内容 */}
            <Row>
              <Col span={6} style={{ paddingRight: 10 }}>
                <Card title="数据中心字典树" className="tree-card">
                  <Tree defaultExpandedKeys={['all']} showLine={true} onSelect={treeSelect} selectedKeys={this.state.selectedTreeNode ? [this.state.selectedTreeNode.key] : ['all']}>
                    <TreeNode title="全部" key={'all'} type={'all'} data={null}>{getSubTree(this.state.treeData)}</TreeNode>
                  </Tree>
                </Card>
              </Col>
              <Col span={18}>
                <Card title={getSelectTitle()} extra={getExtra()} className="tree-card">
                  {
                    (!this.state.selectedTreeNode || this.state.selectedTreeNode.type !== 'floor') &&
                    <div>
                      <div style={{ marginBottom: 5 }}>子集列表：</div>
                      <Table
                        rowKey="id"
                        columns={getChildrenColumn()}
                        dataSource={this.state.dataCenterList}
                        bordered={true}
                        pagination={{
                          size: 'small',
                          showQuickJumper: true,
                          showSizeChanger: true,
                          onChange: changePage,
                          onShowSizeChange: changePageSize,
                          total: this.state.total,
                          current: this.state.page,
                          pageSize: this.state.pageSize
                        }}
                      />
                    </div>
                  }
                  {
                    this.state.selectedTreeNode && this.state.selectedTreeNode.type === 'floor' &&
                    <div>无子集字典数据</div>
                  }
                </Card>
              </Col>
            </Row>
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
            {<AddEditModal form={this.props.form} editData={this.state.editData} selectedTreeNode={this.state.selectedTreeNode} />}
          </Modal>
        }
      </div >
    );
  }
}

export default Form.create({})(Datacenter);