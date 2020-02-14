import * as React from 'react';
import { Breadcrumb } from 'antd';
import IToken from 'src/dataModel/IToken';
import IPages from 'src/dataModel/IPages';
import storageUtils from 'src/utils/storageUtils';
import Constant from 'src/dataModel/Constant';
import './index.css';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  token: IToken;
  currentPage: IPages;
}

/**
 * DEMO2
 */
class Bread extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      token: JSON.parse(storageUtils.get(Constant.LOGIN_KEY)),
      currentPage: JSON.parse(storageUtils.get(Constant.CURRENT_PAGE_KEY))
    };
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      token: JSON.parse(storageUtils.get(Constant.LOGIN_KEY)),
      currentPage: JSON.parse(storageUtils.get(Constant.CURRENT_PAGE_KEY))
    });
  }

  render() {
    const pages: IPages[] = this.state.token ? this.state.token.pages : [];
    const { currentPage } = this.state;
    const breadcrumbList: any[] = [];

    /**
     * 递归找上级
     */
    const getParent = (pid: string | null) => {
      if (pid && pages && pages.length > 0) {
        const parent = pages.filter(p => p.id === pid);
        if (parent && parent.length > 0) {
          breadcrumbList.push(<Breadcrumb.Item key={parent[0].id}>{parent[0].name}</Breadcrumb.Item>);
          getParent(parent[0].pid);
        }
      }
    };

    if (currentPage) {
      breadcrumbList.push(<Breadcrumb.Item key={currentPage.id}>{currentPage.name}</Breadcrumb.Item>);
      // 递归找上级
      getParent(currentPage.pid);
    }

    return (
      <div className="layout-breadcrumb">
        {/* <Breadcrumb style={{ margin: '15px 21px' }}>
          {breadcrumbList && breadcrumbList.length > 0 ? breadcrumbList.reverse() : null}
        </Breadcrumb> */}
      </div>
    );
  }
}

export default Bread;
