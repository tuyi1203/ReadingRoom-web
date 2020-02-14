import IPages from './IPages';
import ILoginInfo from './ILoginInfo';

/**
 * 登录Token接口
 */
export default interface IToken {
  /**
   * token
   */
  token: string;

  /**
   * token失效时间
   */
  // tokenExpireDate: Date | null;

  /**
   * 刷新token
   */
  // refeshToken: string | null;

  /**
   * 租户id
   */
  // tenantId: string | null;

  /**
   * 角色id
   */
  // roleId: string | null;

  /**
   * 角色名称
   */
  // roleName: string | null;

  /**
   * 有权限访问的页面
   */
  pages: IPages[];

  /**
   * 登录信息
   */
  loginInfo: ILoginInfo;
}