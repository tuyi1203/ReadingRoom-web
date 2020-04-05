class CommonUtils {

  /**
   * 正则校验
   * @param type 校验类型
   * @param val 待校验值
   */
  static regex(type: string, val: string) {
    var myreg;
    switch (type) {
      case 'mobile': // 校验手机号
        myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        break;
      case 'roleName': // 校验角色名称
        myreg = /^[a-z0-9\u4e00-\u9fa5]+$/i;
        break;
      case 'uint': // 验证正整数
        myreg = /^([1-9]\d*|0)$/;
        break;
      case 'ipwithport': // 校验带端口号的IP地址
        myreg = /^((2[0-4]\d|25[0-5]|[1]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[1]?\d\d?):\d+$/;
        break;
      case 'ip': // 校验带端口号的IP地址
        myreg = /^((2[0-4]\d|25[0-5]|[1]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[1]?\d\d?)$/;
        break;
      case 'alphabet': // 校验字母和下划线
        myreg = /^[a-zA-Z_]+$/;
        break;
      case 'kanji': // 校验中文汉字
        myreg =  /^[\u4e00-\u9fa5]+$/;
        break;
      default:
        myreg = /^$/;
        break;
    }

    return myreg.test(val);
  }
}

export default CommonUtils;