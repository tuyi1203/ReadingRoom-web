import * as React from 'react';
import { Drawer, Menu, Icon } from 'antd';
import { Link, } from 'react-router-dom';
import IToken from 'src/dataModel/IToken';
import storageUtils from 'src/utils/storageUtils';
import Constant from 'src/dataModel/Constant';
import IPages from 'src/dataModel/IPages';
import './index.css';
const { SubMenu } = Menu;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  history?: any;
  showMap: boolean;
  closeMap: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  token: IToken;
}

/**
 * DEMO2
 */
class MenuMap extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      token: JSON.parse(storageUtils.get(Constant.LOGIN_KEY)),
    };
  }

  render() {
    // 找到1级菜单
    const pages: IPages[] = this.state.token ? this.state.token.pages : [];

    /**
     * 跳转到
     */
    const goTo = (url: string) => {
      this.props.closeMap();
      this.props.history.push(url);
    };

    /**
     * 获取叶子节点菜单
     */
    const getSubSubMenu = (subSubPages: IPages[]) => {
      const list: any[] = [];
      if (subSubPages && subSubPages.length > 0) {
        subSubPages.forEach(h => {
          list.push(
            <Menu.Item key={h.id}><a onClick={() => { goTo(h.url); }}>{h.name}</a></Menu.Item>
          );
        });
      }
      return list;
    };

    /**
     * 获取2级菜单
     */
    const getSubMenu = (pid: string) => {
      const list: any[] = [];
      const subPages = pages.filter(p => p.pid === pid);
      if (subPages && subPages.length > 0) {
        subPages.forEach(k => {
          // 判断当前节点是否有子节点
          const subSubPages = pages.filter(i => i.pid === k.id);
          if (subSubPages && subSubPages.length > 0) {
            // 加载子节点
            list.push(
              <Menu.ItemGroup title={k.name ? k.name : ''} key={k.id}>
                {
                  getSubSubMenu(subSubPages)
                }
              </Menu.ItemGroup>
            );
          } else {
            list.push(
              <Menu.Item key={k.id}><Link to={k.url}>{k.name}</Link></Menu.Item>
            );
          }
        });
      }
      return list;
    };

    /**
     * 获取1级菜单
     */
    const getFirstMenu = () => {
      const list: any[] = [];
      const firstPages = pages.filter(p => p.pid === '0');
      if (firstPages && firstPages.length > 0) {
        firstPages.forEach(o => {
          list.push(
            <SubMenu
              key={o.id}
              title={
                <span>
                  {
                    o.icon &&
                    <Icon type={o.icon} />
                  }
                  <span>{o.name}</span>
                </span>
              }
            >
              {getSubMenu(o.id)}
            </SubMenu>);
        });
      }

      return list;
    };

    return (
      <Drawer
        className="menu-map"
        title="整站导航"
        placement={'left'}
        closable={true}
        onClose={this.props.closeMap}
        visible={this.props.showMap}
        width={255}
      >
        <Menu mode="vertical" theme="dark">
          {
            getFirstMenu()
          }
        </Menu>
      </Drawer>
    );
  }
}

export default MenuMap;
