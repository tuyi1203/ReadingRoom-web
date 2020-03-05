import axios, { AxiosInstance } from 'axios';
import ContentType from 'src/dataModel/HttpContentType';
import Constant from 'src/dataModel/Constant';
import storageUtils from './storageUtils';
import IToken from 'src/dataModel/IToken';
import { message } from 'antd';
// let msgInstance: any;
// 测试地址
// axios.defaults.baseURL = '';    
// 线上地址
// axios.defaults.baseURL = '';  
// demo地址
// axios.defaults.baseURL = '';  
let config: object = {
  timeout: 20 * 1000, // 超时时间
  // baseURL: 'api/v1/auth',
  // withCredentials: true, // Check cross-site Access-Control
};

// 创建axios实例
const _axios: AxiosInstance = axios.create(config);

/**
 * 请求过滤器
 */
_axios.interceptors.request.use(
  (config) => {
    if (config.url !== '/qrlogin') {
      message.loading('数据加载中...', 0);
    }
    
    // console.log(config);
    // if (config.url === '/login' || config.url === '/login/basic' || config.url === '/login/register') {
    //   const data = config.data;
    //   const tmp = data.userName + ':' + data.password;
    //   const tmp2 = window.btoa(tmp);
    //   // console.log(tmp2);
    //   config.headers['Authorization'] = 'Basic ' + tmp2;
    // }
    // 发起请求前拦截器，可以在这里添加header等
    // window.$$_web_env.apiDomain
    config.url = window.$$_web_env.apiDomain + config.url;
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

/**
 * 响应过滤器
 */
_axios.interceptors.response.use(
  (response) => {
    message.destroy();
    // console.log(response);
    // 对于TOKEN失效，需要刷新或退出的逻辑，可以在这里处理
    // TO-DO
    return response;
  },
  (error) => {
    // message.error(error.message);
    setTimeout(() => {
      message.destroy();
      // msgInstance = null;
    }, 2000);
    // console.log(error);
    // 抓取特定的http-code，可以进行后续逻辑处理，如401跳转登录等
    // TO-DO
    return Promise.reject(error);
  }
);

/**
 * 设置请求header
 * @param contentType content-type
 */
const getHeader: any = (contentType: ContentType = ContentType.JSON) => {
  let header: any = {
    'Content-Type': contentType,
  };

  // 获取当前登录用户信息，将token放入header中
  const loginInfoStr = storageUtils.get(Constant.LOGIN_KEY);
  try {
    if (loginInfoStr && loginInfoStr.length > 0) {
      const tokenInfo: IToken = JSON.parse(loginInfoStr);
      if (tokenInfo !== null && tokenInfo.token && !header[Constant.HEADER_TOKEN_NAME]) {
        header[Constant.HEADER_TOKEN_NAME] = 'Bearer ' + tokenInfo.token;
      }
    }
  } catch (e) {
    console.log('ajaxUtils获取登录用户错误：' + e);
  }

  return header;
};

/**
 * 定义ajax方法
 */
var http = {
  /**
   * 发送get请求
   * @param url 请求地址，相对Url
   * @param params 请求参数，JSON对象
   */
  get: function (url: string, params: any): any {
    params = params || {};
    return new Promise((resolve, reject) => {
      _axios.get(url,
        {
          params: params,
          headers: getHeader()
        }).then((res) => {
          resolve(res.data);
        }).catch((error) => {
          reject(error);
        });
    });
  },

  // /**
  //  * 发送patch请求
  //  * @param url 请求地址，相对url
  //  * @param data 请求数据，JSON对象
  //  */
  // patch: function (url: string, data: any): any {
  //   data = data || {};
  //   return new Promise((resolve, reject) => {
  //     _axios.patch(url, data, {
  //       headers: getHeader()
  //     }).then((res) => {
  //       resolve(res.data);
  //     }).catch((error) => {
  //       reject(error);
  //     });
  //   });
  // },

  /**
   * 发送post请求
   * @param url 请求地址，相对url
   * @param data 请求数据，JSON对象
   */
  post: function (url: string, data: any): any {
    data = data || {};
    return new Promise((resolve, reject) => {
      _axios.post(url, data, {
        headers: getHeader()
      }).then((res) => {
        resolve(res.data);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  /**
   * 发送put请求
   * @param url 请求地址，相对url
   * @param data 请求数据，JSON对象
   */
  put: function (url: string, data: any): any {
    data = data || {};
    return new Promise((resolve, reject) => {
      _axios.put(url, data, {
        headers: getHeader()
      }).then((res) => {
        resolve(res.data);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  /**
   * 发送patch请求
   * @param url 请求地址，相对url
   * @param data 请求数据，JSON对象
   */
  patch: function (url: string, data: any): any {
    data = data || {};
    return new Promise((resolve, reject) => {
      _axios.patch(url, data, {
        headers: getHeader()
      }).then((res) => {
        resolve(res.data);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  /**
   * 发送delete请求
   * @param url 请求地址，相对URL
   * @param data 请求数据，JSON对象
   */
  delete: function (url: string, data: any): any {
    data = data || {};
    return new Promise((resolve, reject) => {
      _axios.delete(url, {
        params: data,
        headers: getHeader()
      }).then((res) => {
        resolve(res.data);
      }).catch((error) => {
        reject(error);
      });
    });
  },

  /**
   * 发送delete请求
   * @param url 请求地址，相对URL
   * @param data 请求数据，JSON对象
   */
  deleteWithBody: function (url: string, data: any): any {
    data = data || {};
    return new Promise((resolve, reject) => {
      _axios.delete(url, {
        data,
        headers: getHeader()
      }).then((res) => {
        resolve(res.data);
      }).catch((error) => {
        reject(error);
      });
    });
  },
};

export default http;