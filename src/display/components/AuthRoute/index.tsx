import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import storageUtils from 'src/utils/storageUtils';
import IToken from 'src/dataModel/IToken';
import Constant from 'src/dataModel/Constant';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  path: any;
  component: any;
  location?: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  tokenInfo: IToken | null;
}

/**
 * 授权路由，所有使用该组件的，都必须登录
 */
class AuthRoute extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      tokenInfo: null
    };
  }

  UNSAFE_componentWillMount() {
    let tokenInfo: IToken | null = this.getTokenInfo();
    if (tokenInfo) {
      this.setState({
        ...this,
        tokenInfo: tokenInfo
      });
    }
  }

  UNSAFE_componentWillReceiveProps() {
    let tokenInfo: IToken | null = this.getTokenInfo();
    if (tokenInfo) {
      this.setState({
        ...this,
        tokenInfo: tokenInfo
      });
    }
  }

  /**
   * 获取登录token
   */
  public getTokenInfo = (): IToken | null => {
    let tokenInfo: IToken | null = null;
    const loginInfoStr = storageUtils.get(Constant.LOGIN_KEY);
    try {
      if (loginInfoStr && loginInfoStr.length > 0) {
        tokenInfo = JSON.parse(loginInfoStr);
      }
    } catch (e) {
      console.log('ajaxUtils获取登录用户错误：' + e);
    }

    return tokenInfo;
  }

  render() {
    const { tokenInfo } = this.state;
    let isLogin = false; // 是否登录
    let isAuth = true; // 是否有权限

    // console.log(this.state.tokenInfo);

    // // 获取登录信息
    if (tokenInfo && tokenInfo.token) {
      isLogin = true;
    }

    // console.log(isLogin);

    // 判断是否具有当前访问页面权限
    if (tokenInfo && tokenInfo.pages && tokenInfo.pages.length > 0) {
      // console.log(this.props.location.pathname);
      // console.log(tokenInfo.pages);
      const page = tokenInfo.pages.filter(p => p.url === this.props.location.pathname);
      if (page && page.length > 0) {
        isAuth = true;
        storageUtils.set(Constant.CURRENT_PAGE_KEY, JSON.stringify(page[0]));
      }
    }

    // console.log(this.props.location.pathname);

    // 如果授权成功，则路由到下一个地址
    if (isLogin && isAuth) {
      return (
        <Route path={this.props.path} component={this.props.component} {... this.props} />
      );
    }

    // 未登录
    if (!isLogin) {
      return (
        // 用户未登录或未授权，跳转到登录
        <Redirect to={'/login'} />
      );
    }

    // 未授权
    return (
      // 用户未登录或未授权，跳转到登录
      <Redirect to={'/login'} />
    );
  }
}

export default AuthRoute;