import * as React from 'react';
import {
  // Form,
  // Input,
  // InputNumber,
  Checkbox,
  Row,
  Col,
  Tree
} from 'antd';
import { usermanager } from 'src/api';
import _ from 'lodash';
import './index.css';
// import CommonUtils from 'src/utils/commonUtils';

// const FormItem = Form.Item;
// const { TreeNode } = Tree;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  editData?: any;
}

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  permissionList: any[]; // 所有权限
  permissionTree: any[]; // 权限树
  defaultChecked: string[]; // 已经拥有的权限
  selectedNode: string; // 选中的权限
  childrenNode: any[]; // 选中权限的子权限
  oldCheckedPermissions: string[]; // 操作前权限树控制用
  newCheckedPermissions: string[]; // 操作后权限
  oldCheckedChildrenPermissions: string[]; // 子权限控制用
  newCheckedChildrenPermissions: string[]; // 操作后子权限
}

/**
 * permissionForm
 */
class PermissionForm extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      total: 0,
      page: 1,
      pageSize: 1000,
      selectedNode: '',
      permissionList: [],
      permissionTree: [],
      defaultChecked: [],
      childrenNode: [],
      oldCheckedPermissions: [],
      oldCheckedChildrenPermissions: [],
      newCheckedPermissions: [],
      newCheckedChildrenPermissions: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.getList();
  }

  /*
   * 设置树的半选中状态（去掉子节点没有全部选中的父节点）
   */
  initPermission = (permissions: string[], list: any[]): string[] => {
    const arr: string[] = [];

    const getChildren = (id: string): string[] => {
      const children: string[] = [];
      list.forEach(item => {
        if (item.pid.toString() === id) {
          children.push(item.id.toString());
        }
      });
      return children;
    };

    permissions.forEach(id => {
      const children = getChildren(id);
      console.log(children);
      if (children.length === 0) {
        arr.push(id);
      } else {
        let allChildrenChecked = true;
        children.forEach(o => {
          if (_.indexOf(permissions, o) === -1) {
            allChildrenChecked = false;
          }
        });
        if (allChildrenChecked) {
          arr.push(id);
        }
      }
    });
    return arr;
  }

  /*
   * 获取嵌套关系的权限列表
   */
  getPermissionTree = (permissions: any[], pid: number | string): any[] => {
    const tree = (id: number | string) => {
      let arr: any[] = [];
      permissions.filter((item: any) => {
        return item.pid === id;
      }).forEach((item: any) => {
        arr.push({
          key: item.id.toString(),
          // pid: item.pid,
          title: item.name_cn,
          children: tree(item.id)
        });
      });
      return arr;
    };
    return tree(pid);
  }

  /*
   * 获取权限列表
   */
  getList = async () => {
    // console.log(this.props.editData);
    const param: any = {
      page: this.state.page,
      page_size: this.state.pageSize
    };

    const res = await usermanager.getPermissionList(param);
    // console.log(res.code);
    if (res.code) {
      return;
    }

    if (res) {
      this.setState({
        total: res.results.total,
        permissionList: res.results.data,
        permissionTree: this.getPermissionTree(res.results.data, ''),
      }, () => {
        const initPermissions = this.initPermission(
          this.props.editData.permissions.map((item: any) => item.id.toString()),
          this.state.permissionList,
        );
        console.log(initPermissions);
        this.props.editData.commitPermissions = this.props.editData.permissions.map((item: any) => item.id);
        this.setState({
          defaultChecked: [...initPermissions],
          oldCheckedPermissions: [...initPermissions],
          newCheckedPermissions: [...initPermissions],
        }, () => {
          // console.log(this.state.checkedPermissions);
        });
      });
    }
  }

  render() {

    const {
      permissionTree,
      newCheckedPermissions,
      newCheckedChildrenPermissions,
    } = this.state;

    /*
     * 左侧权限树选择时处理，如果有子节点则初始化
     */
    const onSelect = (selectedKeys: any, info: any) => {
      const childrenNode = this.state.permissionList.filter((item: any) => {
        return item.pid.toString() === selectedKeys[0];
      });

      const initPermissions: string[] = [];
      if (childrenNode.length >= 1) {
        childrenNode.forEach(o => {
          if (_.indexOf(this.state.newCheckedPermissions, o.id.toString()) !== -1) {
            initPermissions.push(o.id.toString());
          }
        });
      }

      this.setState({
        childrenNode,
        oldCheckedChildrenPermissions: [...initPermissions],
        newCheckedChildrenPermissions: [...initPermissions],
        selectedNode: selectedKeys.length > 0 ? selectedKeys[0].toString() : '',
      });

    };

    /*
     * 左侧权限树勾选时处理
     */
    const onCheck = (checkedKeys: any, info: any) => {
      let addAction: boolean = false;
      let diffPermissions: string[]; // 差异权限
      const newCheckedPermissions = [...checkedKeys];
      let {
        oldCheckedPermissions,
        newCheckedChildrenPermissions,
      } = this.state;
      if (newCheckedPermissions.length > oldCheckedPermissions.length) {
        addAction = true;
        diffPermissions = _.difference(newCheckedPermissions, oldCheckedPermissions);
      } else {
        diffPermissions = _.difference(oldCheckedPermissions, newCheckedPermissions);
      }
      if (addAction) { // 如果是增选权限
        // 如果增加的权限在子节点权限中不存在，在子节点中增加适合的权限
        const { childrenNode } = this.state;
        childrenNode.forEach(o => {
          if (_.indexOf(diffPermissions, o.id.toString()) !== -1
            && _.indexOf(o.id.toString(), newCheckedChildrenPermissions) === -1) {
            newCheckedChildrenPermissions.push(o.id.toString());
          }
        });

      } else { // 如果是去掉权限
        // 如果被选中的子节点权限里有差异权限 ，则去掉他们
        diffPermissions.forEach(o => {
          if (_.indexOf(newCheckedChildrenPermissions, o) !== -1) {
            _.remove(newCheckedChildrenPermissions, permission => {
              return o === permission;
            });
          }
        });
      }

      // 设置状态
      this.setState({
        newCheckedPermissions: [...newCheckedPermissions],
        oldCheckedPermissions: [...newCheckedPermissions],
        newCheckedChildrenPermissions: [...newCheckedChildrenPermissions],
        oldCheckedChildrenPermissions: [...newCheckedChildrenPermissions],
      });
      // 获得所有选中的权限
      this.props.editData.commitPermissions = [...checkedKeys, ...info.halfCheckedKeys].map(o => parseInt(o, 10));
    };

    /*
     * 去掉父级节点的选中状态
     */
    const getParentKeys = (list: any[], nodeId: string) => {

      const parentNodes: string[] = [];

      const findParent = (list: any[], id: string) => {
        const node = _.find(list, (o) => {
          return o.id.toString() === id;
        });

        if (node && node.pid) {
          parentNodes.push(node.pid.toString());
          findParent(list, node.pid.toString());
        }
      };

      findParent(list, nodeId);
      return parentNodes;
    };

    /*
     * 递归寻找该节点的子节点
     */
    const getChildrenKeys = (list: any[], nodeId: string) => {

      const childrenKeys: string[] = [];

      const findChildren = (list: any[], id: string) => {

        const childrenNodes = list.filter(o => {
          return o.pid.toString() === id;
        });

        if (childrenNodes.length) {
          childrenNodes.forEach((o: any) => {
            childrenKeys.push(o.id.toString());
            findChildren(list, o.id.toString());
          });
        }
      };

      findChildren(list, nodeId);

      return childrenKeys;
    };

    /*
     * 添加父级节点的选中状态
     */
    const fillParentKeys = (checkedPermissions: string[], list: any[], nodeId: string) => {
      // console.log(checkedPermissions, list, nodeId);
      const parentKeys: string[] = [];

      const findBrotheres = (list: any[], id: string) => {
        const selectedNode: any = list.filter(o => {
          return o.id.toString() === id;
        })[0];
        // console.log(selectedNode);

        const broNodes: any[] = list.filter(o => {
          return (o.pid === selectedNode.pid && o.id !== selectedNode.id);
        });

        // console.log(broNodes);

        let broAllChecked = true;
        broNodes.forEach(o => {
          if (_.indexOf(checkedPermissions, o.id.toString()) === -1) {
            broAllChecked = false;
          }
        });

        if (broAllChecked && selectedNode.pid) {
          parentKeys.push(selectedNode.pid.toString());
          findBrotheres(list, selectedNode.pid.toString());
        }
      };

      findBrotheres(list, nodeId);
      return parentKeys;
    };

    /*
     * 获取提交用的权限（所有选中及权限及半选中的权限）
     */
    const getCommitPermissions = (list: any[], checkedPermissions: string[]): string[] => {
      const arr: string[] = [...checkedPermissions];
      checkedPermissions.forEach(o => {
        const parentKeys = getParentKeys(list, o);
        if (parentKeys.length) {
          parentKeys.forEach(p => {
            if (_.indexOf(arr, p) === -1) {
              arr.push(p);
            }
          });
        }
      });

      return arr;
    };

    /*
     * 右侧侧权限树checkbox发生改变时处理
     */

    const onChange = (checkedValue: any) => {
      let addAction = false;
      let diffPermissions: string[]; // 差异权限
      let {
        oldCheckedChildrenPermissions,
        newCheckedPermissions,
        permissionList,
      } = this.state;

      const newCheckedChildrenPermissions = [...checkedValue];

      if (newCheckedChildrenPermissions.length > oldCheckedChildrenPermissions.length) {
        addAction = true;
        diffPermissions = _.difference(newCheckedChildrenPermissions, oldCheckedChildrenPermissions);
      } else {
        diffPermissions = _.difference(oldCheckedChildrenPermissions, newCheckedChildrenPermissions);
      }

      console.log(diffPermissions, addAction);

      if (addAction) { // 如果是增选权限
        // 如果增加的权限在左侧权限树处于未选中状态，则选中他，如果选中后，父级节点的子节点即全部选中，则选中父级节点
        diffPermissions.forEach(o => {
          if (_.indexOf(newCheckedPermissions, o) === -1) {
            newCheckedPermissions.push(o);
          }
          const parentKeys: string[] = fillParentKeys(
            newCheckedPermissions,
            permissionList,
            o
          ); // 加上父节点
          parentKeys.forEach(p => {
            if (_.indexOf(newCheckedPermissions, p) === -1) {
              newCheckedPermissions.push(p);
            }
          });
          // 如果该节点有子节点，则所有字节点都需要为选中状态
          const childrenKeys: string[] = getChildrenKeys(permissionList, o);
          childrenKeys.forEach(p => {
            if (_.indexOf(newCheckedPermissions, p) === -1) {
              newCheckedPermissions.push(p);
            }
          });
          // console.log(childrenKeys);
        });

      } else { // 如果是去掉权限
        // 去掉子节点权限的同时，去掉左侧权限数的相应权限，同时递归去掉父级的权限
        diffPermissions.forEach(o => {
          if (_.indexOf(newCheckedPermissions, o) !== -1) {
            _.remove(newCheckedPermissions, permission => {
              return o === permission;
            });
          }
          const parentKeys: any[] = getParentKeys(permissionList, o);
          parentKeys.forEach(p => {
            if (_.indexOf(newCheckedPermissions, p) !== -1) {
              _.remove(newCheckedPermissions, permission => {
                return p === permission;
              });
            }
          });
          console.log('newCheckedPermissions', newCheckedPermissions);
          // 如果该节点有子节点，则所有字节点都需要取消选中状态
          const childrenKeys: string[] = getChildrenKeys(permissionList, o);
          childrenKeys.forEach(p => {
            if (_.indexOf(newCheckedPermissions, p) !== -1) {
              _.remove(newCheckedPermissions, permission => {
                return p === permission;
              });
            }
          });
          console.log(childrenKeys);
        });

      }

      this.setState({
        newCheckedPermissions: [...newCheckedPermissions],
        oldCheckedPermissions: [...newCheckedPermissions],
        newCheckedChildrenPermissions: [...newCheckedChildrenPermissions],
        oldCheckedChildrenPermissions: [...newCheckedChildrenPermissions],
      });

      // 添加所有选中节点的父节点为选中状态
      this.props.editData.commitPermissions = getCommitPermissions(permissionList, newCheckedPermissions).map(o => parseInt(o, 10));
    };

    /*
     * 获取子权限键值对
     */
    const getPermissionOptions = () => {
      const list: any[] = [];
      this.state.childrenNode.forEach(item => {
        list.push({ label: item.name_cn, value: item.id.toString() });
      });
      return list;
    };

    return (
      <div className="permission">
        <Row gutter={24}>
          <Col className="gutter-row" span={12}>
            <div className="panel">
              {permissionTree.length
                &&
                <Tree
                  checkable={true}
                  defaultExpandedKeys={[]}
                  defaultSelectedKeys={[]}
                  defaultCheckedKeys={this.state.defaultChecked}
                  onSelect={onSelect}
                  onCheck={onCheck}
                  checkedKeys={newCheckedPermissions}
                  defaultExpandAll={false}
                  treeData={permissionTree}
                // checkStrictly={true}
                />
              }
            </div>
          </Col>
          <Col className="gutter-row" span={12}>
            <div className="panel">
              <Checkbox.Group
                style={{ width: '100%', display: 'inline-block', marginRight: '0', }}
                onChange={onChange}
                options={getPermissionOptions()}
                value={newCheckedChildrenPermissions}
              />
            </div>
          </Col>
        </Row>
      </div >
    );
  }
}

export default PermissionForm;
