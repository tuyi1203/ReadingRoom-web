import * as React from 'react';
import { Menu, Icon } from 'antd';
import { Link, } from 'react-router-dom';
import IToken from 'src/dataModel/IToken';
import IPages from 'src/dataModel/IPages';
import storageUtils from 'src/utils/storageUtils';
import Constant from 'src/dataModel/Constant';
import './index.css';

const { SubMenu } = Menu;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  location?: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  token: IToken;
  currentPage: IPages;
  selectedKey: string[];
  openKey: string[];
}

/**
 * DEMO2
 */
class Slider extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      token: JSON.parse(storageUtils.get(Constant.LOGIN_KEY)),
      currentPage: JSON.parse(storageUtils.get(Constant.CURRENT_PAGE_KEY)),
      selectedKey: [],
      openKey: []
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({
      currentPage: JSON.parse(storageUtils.get(Constant.CURRENT_PAGE_KEY))
    }, () => {
      this.setSelectedAndOpenKeys();
    });
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      currentPage: JSON.parse(storageUtils.get(Constant.CURRENT_PAGE_KEY))
    }, () => {
      this.setSelectedAndOpenKeys();
    });
  }

  /**
   * 根据当前页设置左侧菜单选中及打开状态
   */
  setSelectedAndOpenKeys = () => {
    const { currentPage } = this.state;
    // 当前所在菜单
    let selectedKey: string[] = [];
    let openKey: string[] = [];
    if (currentPage) {
      selectedKey = [currentPage.id];
      if (currentPage.pid) {
        openKey = [currentPage.pid];
      }
    }

    this.setState({
      selectedKey: selectedKey,
      openKey: openKey
    });
  }

  render() {
    const pages: IPages[] = this.state.token ? this.state.token.pages : [];
    const { currentPage, selectedKey, openKey } = this.state;
    // console.log(currentPage);

    // 当前所在菜单
    // let selectedKey: string[] = [];
    // let openKey: string[] = [];
    // if (currentPage) {
    //   selectedKey = [currentPage.id];
    //   if (currentPage.pid) {
    //     openKey = [currentPage.pid];
    //   }
    // }

    // /**
    //  * 获取菜单标题
    //  * @param k IPages对象
    //  */
    // const getMenuTitle = (k: IPages): any => {
    //   return (
    //     <span>
    //       {
    //         k.icon &&
    //         <Icon type={k.icon.replace('/', '')} />
    //       }
    //       <span>{k.name}</span>
    //     </span>
    //   );
    // };

    /**
     * 获取子菜单
     */
    const getSubMenu = (id: string): any => {
      const list: any = [];
      // 找到当前模块的所有1级菜单
      const subMenus = pages.filter(p => p.pid === id);
      if (subMenus && subMenus.length > 0) {
        subMenus.forEach(o => {
          const subPages = pages.filter(i => i.pid === o.id);
          if (!subPages || subPages.length === 0) {
            if (o.url) {
              list.push(
                <Menu.Item key={o.id}>
                  <Link to={o.url}>
                    {
                      o.icon &&
                      <Icon type={o.icon} />
                    }
                    <span>{o.name}</span>
                  </Link>
                </Menu.Item>
              );
            }
          } else {
            // 生成2级菜单
            list.push(
              <SubMenu
                key={o.id}
                title={
                  <span>
                    {
                      o.icon &&
                      <Icon type="mail" />
                    }

                    <span>{o.name}</span>
                  </span>
                }
              >
                {subPages.map((k) => { return <Menu.Item key={k.id}><Link to={k.url}>{k.name}</Link></Menu.Item>; })}
              </SubMenu>
            );
          }
        });
      }
      return list;
    };

    /**
     * 获取顶部菜单
     */
    const getTopPage = (id: string | null): IPages | null => {
      if (pages && pages.length > 0) {
        const parentPage = pages.filter(p => p.id === id);
        if (parentPage && parentPage.length > 0) {
          if (parentPage[0].pid === '0') {
            return parentPage[0];
          } else {
            return getTopPage(parentPage[0].pid);
          }
        }
      }

      return null;
    };

    /**
     * 获取菜单信息
     */
    const getMenus = (): any[] => {
      const list: any = [];
      if (currentPage) {
        // 找到当前菜单的顶级菜单
        const topPage = getTopPage(currentPage.id);
        if (topPage) {
          return getSubMenu(topPage.id);
        }
      }

      return list;
    };

    /**
     * 获取当前模块名称
     */
    const getTopName = (): string | null => {
      if (currentPage) {
        // 找到当前菜单的顶级菜单
        const topPage = getTopPage(currentPage.id);
        if (topPage) {
          return topPage.name;
        }
      }

      return null;
    };

    // console.log(openKey);
    /**
     * 改变打开的树非叶子节点
     */
    const openChange = (val: any) => {
      // console.log(val);
      this.setState({
        openKey: val
      });
    };

    return (
      <div className="sider">
        <div className="logo">{getTopName()}</div>
        <Menu
          key="subMenu"
          theme="dark"
          mode="inline"
          selectedKeys={selectedKey}
          openKeys={openKey}
          // defaultSelectedKeys={[this.props.currentRoot ? this.props.currentRoot.id.toString() : '']}
          // defaultOpenKeys={openKey}
          onOpenChange={openChange}
        >
          {
            getMenus()
          }
        </Menu>
      </div >
    );
  }
}

export default Slider;
