/**
 * 本地缓存帮助类
 */
class StorageUtils {
  /**
   * 存储缓存数据
   * @param {String} key 缓存key
   * @param {String} value 缓存value
   */
  static set(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * 获取缓存数据
   * @param {String} key 缓存key
   */
  static get(key: string): any {
    let value = sessionStorage.getItem(key);
    if (value) {
      value = JSON.parse(value);
    }
    return value;
  }

  /**
   * 移除
   * @param key 移除的key
   */
  static remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * 清空缓存数据
   */
  static clear(): void {
    sessionStorage.clear();
  }
}

export default StorageUtils;