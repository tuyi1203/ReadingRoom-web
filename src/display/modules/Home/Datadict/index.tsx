import * as React from 'react';
import { Tabs, Button, Table, Modal, Form, message, Divider, Popconfirm, Row, Col, Tree, Card, Tag } from 'antd';
import { netelement, netelementcustom } from 'src/api';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
import AddEditModal from './addEditForm';
import AddEditCustomForm from './addEditCustomForm';
import AddEditProcolForm from './addEditProtocolForm';

const { TabPane } = Tabs;
const { TreeNode } = Tree;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  netElementList: any;
  showAdd: boolean;
  editData: any;
  defaultActiveKey: string;
  pageChildren: number;
  pageSizeChildren: number;
  totalChildren: number;
  childrenList: any[];
  vendorTree: any[];
  osTree: any[];
  versionTree: any[];
  treeData: any[];
  selectedTreeNode: any;
  protocolSupportList: any;
}

/**
 * 网元字典
 */
class Datadict extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      netElementList: [], // 网元自定义字典列表
      showAdd: false, // 是否显示添加
      editData: null, // 编辑数据
      defaultActiveKey: '1', // 默认选中的tab
      pageChildren: 1, // 子字典当前页
      pageSizeChildren: 10, // 子字典页大小
      totalChildren: 0, // 子字典总条数
      childrenList: [], // 子字典分页数据
      vendorTree: [], // 厂商树形结构数据
      osTree: [], // 系统树数据
      versionTree: [], // 版本树数据
      treeData: [], // 组装好树形结构的数据
      selectedTreeNode: null, // 选中的节点
      protocolSupportList: null, // 支持协议列表数据
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
  }

  /**
   * 获取厂商分页列表
   */
  getChildrenPageList = async () => {
    let res;
    if (this.state.selectedTreeNode) {
      switch (this.state.selectedTreeNode.type) {
        case 'vendor':
          res = await netelement.getOsPageList({
            page: this.state.pageChildren,
            page_size: this.state.pageSizeChildren,
            vendor: this.state.selectedTreeNode.id
          });
          break;
        case 'os':
          res = await netelement.getVersionPageList({
            page: this.state.pageChildren,
            page_size: this.state.pageSizeChildren,
            os: this.state.selectedTreeNode.id
          });
          break;
        default:
          res = await netelement.getVendorPageList({
            page: this.state.pageChildren,
            page_size: this.state.pageSizeChildren
          });
          break;
      }
    } else {
      // 查询vendor
      res = await netelement.getVendorPageList({
        page: this.state.pageChildren,
        page_size: this.state.pageSizeChildren
      });
    }

    if (res.code) {
      this.setState({
        childrenList: res.results.data,
        totalChildren: res.results.count
      });
    }
  }

  /**
   * 获取厂商树形结构
   */
  getVendorTree = async () => {
    const res = await netelement.getVendorList();
    if (res.code) {
      this.setState({
        vendorTree: res.results
      }, () => {
        this.getOsTree();
      });
    }
  }

  /**
   * 获取系统树
   */
  getOsTree = async () => {
    const res = await netelement.getOsList();
    if (res.code) {
      this.setState({
        osTree: res.results
      }, () => {
        this.getVersionTree();
      });
    }
  }

  /**
   * 获取版本树
   */
  getVersionTree = async () => {
    const res = await netelement.getVersionList();
    if (res.code) {
      this.setState({
        versionTree: res.results
      }, () => {
        this.getTreeData();
      });
    }
  }

  /**
   * 组装树形结构
   */
  getTreeData = () => {
    const { vendorTree, osTree, versionTree } = this.state;
    const treeData: any[] = [];
    if (vendorTree && vendorTree.length > 0) {
      vendorTree.forEach(p => {
        const vendor: any = {
          id: p.id,
          key: 'vendor-' + p.id,
          name: p.vendor,
          data: p,
          type: 'vendor',
          children: []
        };

        // 找子节点
        if (osTree && osTree.length > 0) {
          const subOs = osTree.filter(o => o.vendor === p.id);
          if (subOs && subOs.length > 0) {
            const subOss: any[] = [];
            subOs.forEach((k: any) => {
              const os: any = {
                id: k.id,
                key: 'os-' + k.id,
                name: k.os,
                data: k,
                type: 'os',
                children: []
              };
              // 找子节点
              if (versionTree && versionTree.length > 0) {
                const subVersion = versionTree.filter(o => o.os === k.id);
                if (subVersion && subVersion.length > 0) {
                  const subVersions: any[] = [];
                  subVersion.forEach(s => {
                    subVersions.push({
                      id: s.id,
                      key: 'version-' + s.id,
                      name: s.version,
                      data: s,
                      type: 'version',
                      children: []
                    });
                  });
                  os.children = subVersions;
                }
              }
              subOss.push(os);
            });
            vendor.children = subOss;
          }
        }

        treeData.push(vendor);
      });
    }

    // console.log(treeData);

    this.setState({
      treeData: treeData
    });
  }

  /**
   * 获取网元数据列表
   */
  getList = async () => {
    // console.log(this.state.defaultActiveKey);
    let res;
    if (this.state.defaultActiveKey === '1') {
      this.getVendorTree();
      this.getChildrenPageList();
    } else if (this.state.defaultActiveKey === '2') {
      res = await netelementcustom.getList({
        page: this.state.page,
        page_size: this.state.pageSize
      });
      if (!res.code) {
        return;
      } else {
        this.setState({
          netElementList: res.results.data,
          total: res.results.count
        });
      }
    } else if (this.state.defaultActiveKey === '3') {
      res = await netelement.getProtocolSupport({
        page: this.state.page,
        page_size: this.state.pageSize
      });
      if (!res.code) {
        return;
      }
      this.setState({
        protocolSupportList: res.results
      });
    }
  }

  render() {
    /**
     * 显示添加
     */
    const showAdd = () => {
      if (this.state.defaultActiveKey === '1') {
        if (this.state.selectedTreeNode && this.state.selectedTreeNode.type === 'version') {
          message.warn('选中version无法新增');
          return;
        }
      }
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
     * 删除网元
     */
    const del = async (record: any) => {
      let res;
      if (this.state.defaultActiveKey === '1') {
        // res = await netelement.del(record.id, {});
        if (!this.state.selectedTreeNode) {
          res = await netelement.delVendor(record.id);
        } else if (this.state.selectedTreeNode.type === 'vendor') {
          res = await netelement.delOs(record.id);
        } else if (this.state.selectedTreeNode.type === 'os') {
          res = await netelement.delVersion(record.id);
        }
      } else if (this.state.defaultActiveKey === '2') {
        res = await netelementcustom.del(record.id, {});
      }

      if (res && !res.code) {
        message.error(res.msg);
        return;
      }

      message.success('删除成功');
      this.getList();
    };

    /**
     * 网元自定义字典列
     */
    const column = [
      {
        title: '类别名称',
        key: 'type_name',
        dataIndex: 'type_name',
      },
      {
        title: '能力名称',
        key: 'capability_name',
        dataIndex: 'capability_name',
      },
      {
        title: '能力描述',
        key: 'capability_desc',
        dataIndex: 'capability_desc',
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

    /**
     * 网元自定义字典列
     */
    const pColumn = [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
      },
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
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

    /**
     * 关闭模态窗
     */
    const onCancel = () => {
      this.setState({
        showAdd: false,
        editData: null
      });
    };

    /**
     * 网元自定义字典保存
     */
    const onOk = () => {
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        if (!err) {
          if (this.state.defaultActiveKey === '1') {
            let res: any;
            if (!this.state.selectedTreeNode) {
              // 处理vendor
              if (this.state.editData) {
                // 编辑
                res = await netelement.editVendor(this.state.editData.id, values);
              } else {
                // 新增
                res = await netelement.addVendor(values);
              }
            } else if (this.state.selectedTreeNode.type === 'vendor') {
              values.vendor = this.state.selectedTreeNode.id;
              // 处理os
              if (this.state.editData) {
                // 编辑
                res = await netelement.editOs(this.state.editData.id, values);
              } else {
                // 新增
                res = await netelement.addOs(values);
              }
            } else if (this.state.selectedTreeNode.type === 'os') {
              values.os = this.state.selectedTreeNode.id;
              // 处理version
              if (this.state.editData) {
                // 编辑
                res = await netelement.editVersion(this.state.editData.id, values);
              } else {
                // 新增
                res = await netelement.addVersion(values);
              }
            }
            if (!res.code) {
              message.error(res.msg);
              return;
            }
            message.success('保存成功');
            onCancel();
            this.getList();
          } else if (this.state.defaultActiveKey === '2') {
            let res: any;
            if (this.state.editData) {
              res = await netelementcustom.edit(this.state.editData.id, values);
            } else {
              res = await netelementcustom.add(values);
            }

            if (!res.code) {
              message.error(res.msg);
              return;
            }
            message.success('网元自定义字典保存成功');
            onCancel();
            this.getList();
          } else if (this.state.defaultActiveKey === '3') {
            let res: any;
            if (this.state.editData) {
              res = await netelement.editProtocolSupport(this.state.editData.id, values);
            } else {
              res = await netelement.addProtocolSupport(values);
            }

            if (!res.code) {
              message.error(res.msg);
              return;
            }
            message.success('ProtocolSupport保存成功');
            onCancel();
            this.getList();
          }
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
     * 改变分页
     */
    const changePageChildren = (page: number) => {
      this.setState({
        pageChildren: page
      }, () => {
        this.getChildrenPageList();
      });
    };

    /**
     * 改变页大小
     */
    const changePageSizeChildren = (current: number, size: number) => {
      this.setState({
        pageSizeChildren: size
      }, () => {
        this.getChildrenPageList();
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
     * 获取子树节点
     */
    const getSubTree = (children: any[]) => {
      const list: any[] = [];
      if (children && children.length > 0) {
        children.forEach(p => {
          list.push(
            <TreeNode title={p.name + '（' + p.type + '）'} key={p.key} type={p.type} data={p}>{getSubTree(p.children)}</TreeNode>
          );
        });
      }
      return list;
    };

    /**
     * 选中树节点
     */
    const treeSelect = (a: any, b: any) => {
      // console.log(a);
      // console.log(b);
      this.setState({
        selectedTreeNode: b.node.props.data,
        pageChildren: 1,
        pageSizeChildren: 10
      }, () => {
        this.getChildrenPageList();
      });
    };

    /**
     * 选中节点标题
     */
    const getSelectTitle = () => {
      if (this.state.selectedTreeNode) {
        // console.log(this.state.selectedTreeNode);
        let protocal: any[] = [];
        if (this.state.selectedTreeNode.type === 'version') {
          if (this.state.selectedTreeNode.data.protocols_support) {
            this.state.selectedTreeNode.data.protocols_support.forEach((p: any) => {
              protocal.push(<Tag color="blue" key={p.id} title="支持协议">{p.name}</Tag>);
            });
          }
        }
        return <div key="info">{this.state.selectedTreeNode.name}（{this.state.selectedTreeNode.type}）{protocal}</div>;
      }

      return <div key="info">全部</div>;
    };

    /**
     * 获取按钮
     */
    const getExtra = () => {
      const list: any[] = [];
      if (!this.state.selectedTreeNode || (this.state.selectedTreeNode && this.state.selectedTreeNode.type !== 'version')) {
        list.push(<Button key="add" type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button>);
      }

      // if (this.state.selectedTreeNode) {
      //   switch (this.state.selectedTreeNode.type) {
      //     case 'vendor':
      //       list.push(
      //         <div key="extra">
      //           <Button key="edit-vendor" type="primary" style={{ marginLeft: 10 }} onClick={() => { showEdit(this.state.selectedTreeNode); }}>编辑</Button>
      //           <Button key="del-vendor" type="danger" style={{ marginLeft: 10 }}>删除</Button>
      //         </div>
      //       );
      //       break;
      //     case 'os':
      //       list.push(
      //         <div key="extra">
      //           <Button key="edit-os" type="primary" style={{ marginLeft: 10 }}>编辑</Button>
      //           <Button key="del-os" type="danger" style={{ marginLeft: 10 }}>删除</Button>
      //         </div>
      //       );
      //       break;
      //     case 'version':
      //       list.push(
      //         <div key="extra">
      //           <Button key="edit-version" type="primary" style={{ marginLeft: 10 }}>编辑</Button>
      //           <Button key="del-version" type="danger" style={{ marginLeft: 10 }}>删除</Button>
      //         </div>
      //       );
      //       break;
      //     default:
      //       break;
      //   }
      // }

      return list;
    };

    /**
     * 子字典列
     */
    const getChildrenColumn = () => {
      let column: any = [];
      if (this.state.selectedTreeNode) {
        switch (this.state.selectedTreeNode.type) {
          case 'vendor':
            column = [
              {
                title: '类型',
                key: 'type',
                dataIndex: 'type',
                width: 100,
                render: (text: any, record: any) => {
                  return <span>os</span>;
                }
              },
              {
                title: 'os',
                key: 'os',
                dataIndex: 'os',
              },
              {
                title: '操作',
                key: 'action',
                dataIndex: 'action',
                width: 300,
                render: (text: any, record: any) => {
                  return (
                    <span><Button type="primary" onClick={() => { showEdit(record); }}>编辑</Button><Divider type="vertical" />
                      <Popconfirm title="确认删除吗?" onConfirm={() => del(record)}>
                        <Button type="danger">删除</Button>
                      </Popconfirm>
                    </span>);
                }
              },
            ];
            break;
          case 'os':
            column = [
              {
                title: '类型',
                key: 'type',
                dataIndex: 'type',
                width: 100,
                render: (text: any, record: any) => {
                  return <span>version</span>;
                }
              },
              {
                title: 'version',
                key: 'version',
                dataIndex: 'version',
                width: 300,
              },
              {
                title: 'protocols_support',
                key: 'protocols_support',
                dataIndex: 'protocols_support',
                render: (text: any, record: any) => {
                  console.log(text);
                  if (text && text.length > 0) {
                    return <span>{text.map((p: any) => p.name).join(',')}</span>;
                  }

                  return null;
                }
              },
              {
                title: '操作',
                key: 'action',
                width: 300,
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
            ];
            break;
          default:
            column = [
              {
                title: '类型',
                key: 'type',
                dataIndex: 'type',
                width: 100,
                render: (text: any, record: any) => {
                  return <span>vendor</span>;
                }
              },
              {
                title: 'vendor',
                key: 'vendor',
                dataIndex: 'vendor',
              },
              {
                title: '操作',
                key: 'action',
                dataIndex: 'action',
                width: 300,
                render: (text: any, record: any) => {
                  return (
                    <span><Button type="primary" onClick={() => { showEdit(record); }}>编辑</Button><Divider type="vertical" />
                      <Popconfirm title="确认删除吗?" onConfirm={() => del(record)}>
                        <Button type="danger">删除</Button>
                      </Popconfirm>
                    </span>);
                }
              },
            ];
            break;
        }
      } else {
        column = [
          {
            title: '类型',
            key: 'type',
            dataIndex: 'type',
            width: 100,
            render: (text: any, record: any) => {
              return <span>vendor</span>;
            }
          },
          {
            title: 'vendor',
            key: 'vendor',
            dataIndex: 'vendor',
          },
          {
            title: '操作',
            key: 'action',
            width: 300,
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
        ];
      }

      return column;
    };

    /**
     * 获取子集类型
     */
    const getSubType = (type: string) => {
      let sub = '';
      switch (type) {
        case 'vendor':
          sub = 'os';
          break;
        case 'os':
          sub = 'version';
          break;
        default:
          sub = 'vendor';
          break;
      }

      return sub;
    };

    const { protocolSupportList } = this.state;

    return (
      <div>
        <div className="layout-breadcrumb">
          <div className="page-name">
            <CurrentPage />
          </div>
          <div className="page-button">
            <CommonButton />
            {/* 下面写本页面需要的按钮 */}
            {
              this.state.defaultActiveKey === '2' &&
              <Button type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button>
            }
            {
              this.state.defaultActiveKey === '3' &&
              <Button type="primary" icon="plus" onClick={() => { showAdd(); }}>新增</Button>
            }

          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面是本页的内容 */}
            <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
              <TabPane tab="网元能力字典" key="1" >
                <Row>
                  <Col span={6} style={{ paddingRight: 10 }}>
                    <Card title="数据字典树" className="tree-card">
                      <Tree defaultExpandedKeys={['all']} showLine={true} onSelect={treeSelect} selectedKeys={this.state.selectedTreeNode ? [this.state.selectedTreeNode.key] : ['all']}>
                        <TreeNode title="全部" key={'all'} type={'all'} data={null}>{getSubTree(this.state.treeData)}</TreeNode>
                      </Tree>
                    </Card>
                  </Col>
                  <Col span={18}>
                    <Card title={getSelectTitle()} extra={getExtra()} className="tree-card">
                      {
                        (!this.state.selectedTreeNode || this.state.selectedTreeNode.type !== 'version') &&
                        <div>
                          <div style={{ marginBottom: 5 }}>子集列表：</div>
                          <Table
                            rowKey="id"
                            columns={getChildrenColumn()}
                            dataSource={this.state.childrenList}
                            bordered={true}
                            pagination={{
                              size: 'small',
                              showQuickJumper: true,
                              showSizeChanger: true,
                              onChange: changePageChildren,
                              onShowSizeChange: changePageSizeChildren,
                              total: this.state.totalChildren,
                              current: this.state.pageChildren,
                              pageSize: this.state.pageSizeChildren
                            }}
                          />
                        </div>
                      }
                      {
                        this.state.selectedTreeNode && this.state.selectedTreeNode.type === 'version' &&
                        <div>无子集字典数据</div>
                      }
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="网元自定义字典" key="2" >
                <Table
                  columns={column}
                  rowKey="id"
                  dataSource={this.state.netElementList}
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
              </TabPane>
              <TabPane tab="ProtocolSupport" key="3" >
                <Table
                  columns={pColumn}
                  rowKey="id"
                  dataSource={protocolSupportList && protocolSupportList.data}
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
              </TabPane>
            </Tabs>
          </div>
        </div>
        {
          this.state.showAdd &&
          <Modal
            title={(this.state.editData ? '修改' : '新增') + ((this.state.defaultActiveKey === '1') ? (this.state.selectedTreeNode ? getSubType(this.state.selectedTreeNode.type) : 'vendor') : '')}
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
              <AddEditModal form={this.props.form} editData={this.state.editData} selectedTreeNode={this.state.selectedTreeNode} />
            }
            {
              this.state.defaultActiveKey === '2' &&
              <AddEditCustomForm form={this.props.form} editData={this.state.editData} />
            }
            {
              this.state.defaultActiveKey === '3' &&
              <AddEditProcolForm form={this.props.form} editData={this.state.editData} />
            }
          </Modal>
        }
      </div>
    );
  }
}

export default Form.create({})(Datadict);
