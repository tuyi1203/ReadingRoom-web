export default interface IPages {
  /**
   * 页面id
   */
  id: string;

  /**
   * 上级页面id
   */
  pid: string | null;

  /**
   * 页面名称
   */
  name: string | null;

  /**
   * 页面url，不包含域名部分
   */
  url: string;

  /**
   * 页面图标，antd Icon中的图标
   */
  icon: string | null;

  /**
   * 是否允许匿名访问
   */
  // anonymous: boolean;
}