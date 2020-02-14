import * as React from 'react';
import { Form, Input, Icon, Button, message, Select } from 'antd';
import { system } from 'src/api';
import IToken from 'src/dataModel/IToken';
import IPages from 'src/dataModel/IPages';
import storageUtils from 'src/utils/storageUtils';
import Constant from 'src/dataModel/Constant';
import AnonymousPages from 'src/config/Menus';
import './index.css';
const FormItem = Form.Item;
const { Option } = Select;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  history: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  showBind: boolean;
  domainList: any[];
  roleList: any[];
  userName: string | null;
}

class Login extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showBind: false, // 是否显示绑定
      domainList: [], // 组列表
      roleList: [], // 角色列表
      userName: null, // 输入的用户名
    };
  }

  UNSAFE_componentWillMount() {
    this.getDomainRefer();
    this.getRoleList();
  }

  componentDidMount() {
    // 捕捉回车事件
    document.body.addEventListener('keyup', this.enterHandler);
  }

  componentWillUnmount() {
    // 注销
    document.body.removeEventListener('keyup', this.enterHandler);
  }

  /**
   * 响应回车事件
   */
  enterHandler = (e: any) => {
    if (e.keyCode === 13) {
      this.formSubmit();
    }
  }

  /**
   * 获取用户组
   */
  getDomainRefer = async () => {
    const res = await system.getDomain();
    if (res.code) {
      this.setState({
        domainList: res.results.data
      });
    }
  }

  /**
   * 获取角色列表
   */
  getRoleList = async () => {
    const res = await system.getRole();
    if (res.code) {
      this.setState({
        roleList: res.results.data
      });
    }
  }

  /**
   * 点击登录
   */
  formSubmit = () => {
    const { showBind } = this.state;
    this.props.form.validateFields(async (err: boolean, values: any) => {
      if (!err) {
        if (showBind) {
          const registerResult = await system.register(values);
          if (!registerResult.code) {
            message.error(registerResult.msg);
            return;
          }
          message.success('注册成功，请等待管理员审核');
          window.location.reload();
        } else {
          try {
            const loginResult = await system.login(values);
            // console.log(loginResult);
            if (!loginResult.code) {
              if (typeof loginResult.results === 'string') {
                this.setState({
                  showBind: true,
                  userName: values.userName
                });
                return;
              }
              message.error(loginResult.msg);
              return;
            }

            this.loginIn(loginResult, values);
          } catch (e) {
            // console.log(e);
            // 调用带basic的登录
            try {
              const loginResult = await system.loginBasic(values);
              if (!loginResult.code) {
                if (typeof loginResult.results === 'string') {
                  this.setState({
                    showBind: true,
                    userName: values.userName
                  });
                  return;
                }
                message.error(loginResult.msg);
                return;
              }

              this.loginIn(loginResult, values);
            } catch (e) {
              message.error('用户不存在或密码错误');
            }
          }
        }
      }
    });
  }

  /**
   * 处理登录
   */
  loginIn = (loginResult: any, values: any) => {
    // 设置登录返回的菜单权限
    const permissionPages: IPages[] = [];
    if (loginResult.results.modules && loginResult.results.modules.length > 0) {
      const pbcMenu = loginResult.results.modules;
      pbcMenu.forEach((p: any) => {
        permissionPages.push({
          id: p.index.toString(),
          pid: p.belong.toString(),
          name: p.title_cn,
          url: p.uri,
          icon: p.icon,
        });
      });
    }

    // 将匿名菜单添加到登录信息中
    const pages = permissionPages.concat(AnonymousPages);

    // 封装在token中
    const token: IToken = {
      token: loginResult.results.jwt,
      pages: pages,
      loginInfo: {
        avatar: null,
        name: values.userName
      }
    };

    // // 存入本地缓存中
    storageUtils.set(Constant.LOGIN_KEY, JSON.stringify(token));

    // 跳转到dashboard
    this.props.history.push('/usermanager/user');
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    const { showBind, domainList, roleList, userName } = this.state;
    const getDomainOpiton = () => {
      const list: any[] = [];
      if (domainList && domainList.length > 0) {
        domainList.forEach(p => {
          list.push(<Option key={p.id} value={p.id}>{p.name}</Option>);
        });
      }

      return list;
    };

    const getRoleOption = () => {
      const list: any[] = [];
      if (roleList && roleList.length > 0) {
        roleList.forEach(p => {
          list.push(<Option key={p.id} value={p.id}>{p.description}</Option>);
        });
      }

      return list;
    };

    return (
      <div className="auth-panel">
        {
          !showBind &&
          <div className="auth-form">
            <div className="logo" />
            <div className="text">天枢平台登录</div>
            <div className="form">
              <Form>
                <FormItem label="用户名">
                  {getFieldDecorator('userName', {
                    rules: [
                      { required: true, whitespace: true, message: '请输入用户名' },
                    ],
                  })(
                    <Input className="login" suffix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)', fontSize: '16px' }} />} placeholder="请输入用户名" />
                  )}
                </FormItem>
                <FormItem label="密码">
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码' }],
                  })(
                    <Input className="login" suffix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)', fontSize: '16px' }} />} type="password" placeholder="请输入密码" />
                  )}
                </FormItem>
                <FormItem className="login-button">
                  <Button type="primary" className="auth-form-button" onClick={() => this.formSubmit()}>登录</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        }
        {
          showBind &&
          <div className="auth-form">
            <div className="logo" />
            <div className="text">天枢平台注册</div>
            <div className="form">
              <Form layout="inline" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className="register-form">
                <FormItem label="用户名">
                  {getFieldDecorator('username', {
                    initialValue: userName ? userName : null,
                    rules: [
                      { required: true, whitespace: true, message: '请输入用户名' },
                    ],
                  })(
                    <Input disabled={true} placeholder="请输入用户名" />
                  )}
                </FormItem>
                <FormItem label="真实姓名">
                  {getFieldDecorator('alias_name', {
                    // initialValue: userName ? userName : null,
                    rules: [
                      { required: true, whitespace: true, message: '请输入真实姓名' },
                    ],
                  })(
                    <Input placeholder="请输入真实姓名" />
                  )}
                </FormItem>
                <FormItem label="用户组">
                  {getFieldDecorator('domain_id', {
                    rules: [
                      { required: true, message: '请选择用户组' },
                    ],
                  })(
                    <Select placeholder="请选择用户组">
                      {getDomainOpiton()}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="手机">
                  {getFieldDecorator('telephone', {
                    rules: [
                      { required: true, whitespace: true, message: '请填写用户手机' },
                    ],
                  })(
                    <Input placeholder="请输入手机号" />
                  )}
                </FormItem>
                <FormItem label="email">
                  {getFieldDecorator('email', {
                    rules: [
                      { required: true, whitespace: true, message: '请填写email' },
                    ],
                  })(
                    <Input type="emali" placeholder="请输入email" />
                  )}
                </FormItem>
                <FormItem label="角色">
                  {getFieldDecorator('role', {
                    rules: [
                      { required: true, message: '请选择用户角色' },
                    ],
                  })(
                    <Select placeholder="请选择角色">
                      {getRoleOption()}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="留言">
                  {getFieldDecorator('email_msg', {
                    rules: [
                      { required: true, whitespace: true, message: '请填写留言' },
                    ],
                  })(
                    <Input type="emali" placeholder="请输入留言" />
                  )}
                </FormItem>
                <FormItem className="register-button" wrapperCol={{ span: 24 }}>
                  <Button type="primary" className="auth-form-button" onClick={() => this.formSubmit()}>注册</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        }
      </div >
    );
  }
}

export default Form.create({})(Login);
