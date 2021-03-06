import * as React from 'react';
import CommonButton from 'src/display/components/CommonButton';
import CurrentPage from 'src/display/components/CurrentPage';
import { usermanagerdomains, usermanagergroups, usermanager } from 'src/api';
import { Tabs, Card, Icon, Row, Col, Modal, Tree, message, Spin, Tag, Popover } from 'antd';

const { TabPane } = Tabs;
const { TreeNode } = Tree;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  list: any[];
  defaultActiveKey: string;
  editData: any;
  showEdit: boolean;
  modules: any[];
  treeNodeList: any[];
  checkedRead: any[];
  checkedWrite: any[];
  loadding: boolean;
  expendKeys: string[];
}

/**
 * Permission
 */
class Permission extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      list: [], // 列表数据
      defaultActiveKey: '1',
      editData: null, // 待编辑的组织或工作空间
      showEdit: false, // 显示编辑权限
      modules: [],
      treeNodeList: [], // 权限树形结构数据
      checkedRead: [],
      checkedWrite: [],
      loadding: false,
      expendKeys: [], // 展开的节点
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
  }

  /**
   * 获取列表数据
   */
  getList = async () => {
    let res: any = null;
    await this.setState({
      loadding: true,
    });
    if (this.state.defaultActiveKey === '1') {
      // 组织权限
      res = await usermanagerdomains.getList({
        page: 1,
        page_size: 1000
      });
    } else {
      // 工作空间权限
      res = await usermanagergroups.getList({
        page: 1,
        page_size: 1000
      });
    }

    if (res.code) {
      // 去重
      if (res.results.data && res.results.data.length > 0) {
        res.results.data.forEach((k: any) => {
          const repeat: any[] = [];
          const noRepeatList: any[] = [];
          if (k.modules && k.modules.length > 0) {
            k.modules.forEach((p: any) => {
              if (repeat.indexOf(p.index) < 0) {
                repeat.push(p.index);
                noRepeatList.push(p);
              }
            });
            k.modules = noRepeatList;
          }
        });
      }

      this.setState({
        list: res.results.data
      });
    }
    await this.setState({
      loadding: false,
    });
  }

  render() {

    /**
     * 改变选项卡
     */
    const changeTab = (val: string) => {
      // console.log(val);
      this.setState({
        defaultActiveKey: val,
        list: [],
        page: 1,
        pageSize: 10,
      }, () => {
        this.getList();
      });
    };

    /**
     * 获取权限摘要
     */
    const getPermissionIntro = (p: any) => {
      const list: any[] = [];
      const allList: any[] = [];
      if (p && p.modules) {
        let hasMore = false;
        let i = p.modules.length;
        if (i > 4) {
          i = 4;
          hasMore = true;
        }

        // console.log(i);
        for (let j = 0; j < p.modules.length; j++) {
          if (j < i) {
            list.push(<div key={j}>{p.modules[j].title_cn}：{p.modules[j].read ? '读' : ''} / {p.modules[j].write ? '写' : ''}</div>);
          }

          allList.push(<div key={j}>{p.modules[j].title_cn}：{p.modules[j].read ? '读' : ''} / {p.modules[j].write ? '写' : ''}</div>);
        }

        if (hasMore) {
          list.push(
            <Popover content={allList} key="more" trigger="hover" placement="right">
              ……
            </Popover>);
        }
      }

      if (!list || list.length === 0) {
        list.push(<div key="div" style={{ height: 105 }}>暂未分配权限</div>);
      }
      return list;
    };

    /**
     * 递归组装树形
     */
    const getChild = (data: any, id: number) => {
      if (data && data.length > 0) {
        const childNode = data.filter((p: any) => p.belong === id);
        if (childNode && childNode.length > 0) {
          childNode.forEach((o: any) => {
            o.children = getChild(data, o.index);
          });

          return childNode;
        }
      }
    };

    /**
     * 显示编辑
     */
    const showEdit = async (data: any) => {
      // 获取可见权限
      const res = await usermanager.getModules();
      if (res.code && res.results.data && res.results.data.length > 0) {
        // 组装树形
        const treeNodeList = getChild(res.results.data, 0);
        // console.log(treeNodeList);
        // console.log(data.modules);

        // 处理已有的
        let checkedRead: any[] = [];
        let checkedWrite: any[] = [];

        if (data.modules && data.modules.length > 0) {
          res.results.data.forEach((p: any) => {
            const exits = data.modules.filter((o: any) => o.index === p.index);
            if (exits && exits.length > 0) {
              if (exits[0].read) {
                checkedRead.push(p.ID.toString());
              }
              if (exits[0].write) {
                checkedWrite.push(p.ID.toString());
              }
            }
          });
        }

        this.setState({
          modules: res.results.data,
          editData: data,
          showEdit: true,
          treeNodeList: treeNodeList,
          checkedRead,
          checkedWrite
        });
      }
    };

    /**
     * 获取权限卡片
     */
    const getPermissionCard = () => {
      const list: any[] = [];
      if (this.state.list && this.state.list.length > 0) {
        this.state.list.forEach(p => {
          list.push(
            <div key={p.id} style={{ minHeight: 260, padding: 20, width: '25%', float: 'left' }}>
              <Card
                title={<span>{p.name} {p.internal_domain ? <Tag color="blue" style={{ marginLeft: 10 }}>内部组织</Tag> : <Tag style={{ marginLeft: 10 }}>外部组织</Tag>}</span>}
                actions={[
                  <Icon type="setting" key="setting" onClick={() => { showEdit(p); }} />]}
              >
                {
                  getPermissionIntro(p)
                }
                {/* <div></div> */}
              </Card>
            </div>
          );
        });
      }

      return list;
    };

    /**
     * 取消
     */
    const onCancel = () => {
      // console.log('cancel');
      this.setState({
        editData: null,
        showEdit: false
      });
    };

    /**
     * 保存
     */
    const onOk = async () => {
      // console.log(this.state.checkedRead);
      // console.log(this.state.checkedWrite);

      const editData = this.state.list.filter(p => p.id === this.state.editData.id)[0];
      // console.log(editData);
      const modules: any[] = [];
      if (this.state.modules && this.state.modules.length > 0) {
        this.state.modules.forEach(p => {
          modules.push({
            ID: p.ID,
            name: p.Name,
            read: this.state.checkedRead && this.state.checkedRead.length > 0 && this.state.checkedRead.indexOf(p.ID.toString()) >= 0,
            write: this.state.checkedWrite && this.state.checkedWrite.length > 0 && this.state.checkedWrite.indexOf(p.ID.toString()) >= 0
          });
        });
      }

      editData.modules = modules;

      let res: any = null;
      // console.log(this.state.defaultActiveKey);
      // console.log(editData);
      if (this.state.defaultActiveKey === '1') {
        // 提交组织接口
        res = await usermanagerdomains.editAuth(editData.id, editData);
      } else {
        // 提交工作空间接口
        res = await usermanagergroups.editAuth(editData.id, editData);
      }

      if (res && res.code) {
        message.success('保存权限成功');
        onCancel();
        this.getList();
      } else {
        message.error('保存权限失败：' + res.msg);
      }
    };

    /**
     * 树形选择改变
     */
    const onCheck = (type: string, checkedKeys: any, info: any) => {
      // console.log(type);
      // console.log('onCheck', checkedKeys, info);
      if (type === 'read') {
        this.setState({
          checkedRead: checkedKeys
        }, () => {
          // 取消读，取消写
          if (this.state.checkedWrite && this.state.checkedWrite.length > 0) {
            const checkedWrite: any[] = [];
            // console.log(this.state.checkedWrite);
            // console.log(this.state.checkedRead);
            this.state.checkedWrite.forEach(w => {
              if (this.state.checkedRead.indexOf(w) >= 0) {
                checkedWrite.push(w);
              }
            });

            this.setState({
              checkedWrite: checkedWrite
            });
          }
        });
      } else {
        // 有写权限的一定要有读权限
        this.setState({
          // checkedRead: checkedKeys,
          checkedWrite: checkedKeys
        }, () => {
          // 勾选写，勾选读
          const checkedRead: any[] = [];
          if (this.state.checkedWrite && this.state.checkedWrite.length > 0) {
            this.state.checkedWrite.forEach(p => {
              if (this.state.checkedWrite.indexOf(p) >= 0) {
                checkedRead.push(p);
              }
            });

            this.setState({
              checkedRead: this.state.checkedRead.concat(checkedRead)
            });
          }
        });
      }
      // this.setState({
      //   checkedRead: checkedKeys,
      //   checkedWrite: checkedKeys
      // });
    };

    /**
     * 展开树形节点
     */
    const onExpand = (expandedKeys: any, a: any) => {
      // console.log(expandedKeys);
      // console.log(a);
      this.setState({
        expendKeys: expandedKeys
      });
    };

    /**
     * 获取属性子节点
     */
    const getChildNode = (node: any, read: boolean): any => {
      const list: any[] = [];
      if (node && node.children && node.children.length > 0) {
        node.children.forEach((p: any) => {
          list.push(
            <TreeNode title={p.title_cn} key={p.ID.toString()} disabled={read ? !p.read : !p.write}>
              {
                getChildNode(p, read)
              }
            </TreeNode>
          );
        });
      }

      return list;
    };

    /**
     * 获取属性节点
     */
    const getTreeNode = (read: boolean): any => {
      const list: any[] = [];
      // console.log(this.state.treeNodeList);
      if (this.state.treeNodeList && this.state.treeNodeList.length > 0) {
        this.state.treeNodeList.forEach(p => {
          list.push(
            <TreeNode title={p.title_cn} key={p.ID.toString()} disabled={read ? !p.read : !p.write}>
              {/* <TreeNode title={p.title_cn} key={p.ID}> */}
              {
                getChildNode(p, read)
              }
            </TreeNode>
          );
        });
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
            {/* <Button type="primary" icon="plus">新增</Button> */}
          </div>
        </div>
        <div className="content">
          <div className="page-content">
            {/* 下面是本页的内容 */}
            <Tabs defaultActiveKey={this.state.defaultActiveKey} type="card" onChange={changeTab}>
              <TabPane tab="组织权限" key="1" />
              <TabPane tab="工作空间权限" key="2" />
            </Tabs>
            {/* <Row> */}
            <Spin spinning={this.state.loadding}>
              {
                !this.state.loadding &&
                getPermissionCard()
              }
            </Spin>
            {/* </Row> */}
          </div>
        </div>
        {
          this.state.editData &&
          <Modal
            title={'编辑' + this.state.editData.name + '权限'}
            visible={this.state.showEdit}
            onOk={onOk}
            maskClosable={false}
            onCancel={onCancel}
            centered={true}
            destroyOnClose={true}
            width={800}
          >
            <Row>
              <Col span={12} style={{ padding: 10 }}>
                <Card title="读权限">
                  <Tree
                    checkable={true}
                    checkedKeys={this.state.checkedRead}
                    onCheck={onCheck.bind(this, 'read')}
                    onExpand={onExpand}
                    expandedKeys={this.state.expendKeys}
                  >
                    {
                      getTreeNode(true)
                    }
                  </Tree>
                </Card>
              </Col>
              <Col span={12} style={{ padding: 10 }}>
                <Card title="写权限">
                  <Tree
                    checkable={true}
                    checkedKeys={this.state.checkedWrite}
                    onCheck={onCheck.bind(this, 'write')}
                    onExpand={onExpand}
                    expandedKeys={this.state.expendKeys}
                  >
                    {
                      getTreeNode(false)
                    }
                  </Tree>
                </Card>
              </Col>
            </Row>
          </Modal>
        }
      </div>
    );
  }
}

export default Permission;