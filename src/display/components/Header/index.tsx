import * as React from 'react';
import { Layout, Icon, Menu, Dropdown, Avatar, message, Modal } from 'antd';
import { Link, } from 'react-router-dom';
import IToken from 'src/dataModel/IToken';
import storageUtils from 'src/utils/storageUtils';
import Constant from 'src/dataModel/Constant';
import IPages from 'src/dataModel/IPages';
import { system, progress } from 'src/api';
import MenuMap from '../MenuMap';
import './index.css';
import PasswordResetForm from './passwordResetForm';

const { Header } = Layout;

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
    collapsed: boolean;
    toggle: any;
    history?: any;
    form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
    token: IToken;
    currentPage: IPages;
    shortcutPages: IPages[];
    showMap: boolean;
    showPasswordPanel: boolean;
}

/**
 * DEMO2
 */
class MyHeader extends React.PureComponent<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            token: JSON.parse(storageUtils.get(Constant.LOGIN_KEY)),
            currentPage: JSON.parse(storageUtils.get(Constant.CURRENT_PAGE_KEY)),
            shortcutPages: [],
            showMap: false,
            showPasswordPanel: false,
        };
    }

    UNSAFE_componentWillMount() {
        this.getShortcutMenu();
    }

    /**
     * 获取快捷菜单列表
     */
    getShortcutMenu = async () => {
        const res = await system.getShortcutMenuList();
        if (!res.code && res.results && res.results.data && res.results.data.length > 0) {
            // console.log(res.results.index);
            // console.log(this.state.token.pages);
            const indexs: string[] = [];
            res.results.data.forEach((p: string) => {
                indexs.push(p);
            });
            // 匹配登录用户已有菜单
            const shortcutMenus = this.state.token.pages.filter((p: any) => indexs.indexOf(p.id.toString()) >= 0);
            this.setState({
                shortcutPages: shortcutMenus
            });
        }
    }

    render() {
        /**
         * 注销
         */
        const logOut = () => {
            // 清空登录信息
            storageUtils.remove(Constant.LOGIN_KEY);
            storageUtils.remove(Constant.SENCE_ID);

            // 返回登录页
            window.location.href = '/login';
        };

        /**
         * 取消弹出窗口
         */
        const onCancel = () => {
            this.setState({
                showPasswordPanel: false,
            });
        };

        /**
         * 保存密码
         */
        const onOk = () => {
            this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
                if (!err) {
                    let res: any = null;
                    let params: any = null;
                    params = { ...values };

                    res = await progress.resetPassword(params);
                    if (res.code) {
                        message.error(res.msg);
                        return;
                    }
                    message.success('密码修改成功');
                    onCancel();
                }
            });
        };

        /**
         * 点击修改密码按钮
         */
        const onClick = () => {
            this.setState({
                showPasswordPanel: true,
            });
            console.log(!this.state.showPasswordPanel);
        };

        // 登录信息下拉菜单
        const menu = (
            <Menu>
                <Menu.Item key="4">
                    <a onClick={() => onClick()}>修改登陆密码</a>
                </Menu.Item>
                <Menu.Item key="3">
                    <a onClick={() => logOut()}>注销</a>
                </Menu.Item>
            </Menu>
        );

        /**
         * 删除快捷菜单
         */
        const delMenu = async (id: number) => {
            // message.info('暂无法删除，等待后端接口');
            const res = await system.delShortcutMenu(id);
            if (!res.code) {
                message.success('删除快捷菜单成功');
                window.location.reload();
            } else {
                message.error('删除快捷菜单失败：' + res.msg);
            }
        };

        /**
         * 添加快捷菜单
         */
        const addMenu = async () => {
            // console.log(this.state.currentPage);
            const currentPage: IPages = JSON.parse(storageUtils.get(Constant.CURRENT_PAGE_KEY));
            // console.log(currentPage);
            // console.log(this.state.shortcutPages);
            if (this.state.shortcutPages && this.state.shortcutPages.length > 0) {
                if (this.state.shortcutPages.length >= 5) {
                    message.warn('最多只能添加5个快捷菜单');
                    return;
                }
                const exits = this.state.shortcutPages.filter(p => p.id === currentPage.id);
                if (exits && exits.length > 0) {
                    message.warn('当前菜单已添加到快捷菜单');
                    return;
                }
            }
            const res = await system.saveShortcutMenu({
                menu_id: currentPage.id
            });
            if (!res.code) {
                message.success('保存快捷菜单成功');
                window.location.reload();
            } else {
                message.error('保存快捷菜单失败：' + res.msg);
            }
        };

        /**
         * 切换显示地图
         */
        const openMap = () => {
            this.setState({
                showMap: true
            });
        };

        /**
         * 关闭地图
         */
        const closeMap = () => {
            this.setState({
                showMap: false
            });
        };

        /**
         * 获取快捷菜单
         */
        const getShortcutMenus = () => {
            const list: any[] = [];
            if (this.state.shortcutPages && this.state.shortcutPages.length > 0) {
                this.state.shortcutPages.forEach((p: IPages) => {
                    list.push(
                        <div className="menus-item" key={p.id}>
                            <div className="item"><Link to={p.url}>
                                {p.name}
                            </Link></div>
                            <div className="close" onClick={() => { delMenu(p.id); }} />
                        </div>
                    );
                });
            }

            return list;
        };

        return (
            <Header className="layout-header" >
                <div className="logo">
                    <div className="show-all" onClick={openMap} />
                    <div className="header-logo" />
                </div>
                <div className="menu-bar">
                    {getShortcutMenus()}
                    {
                        !this.state.shortcutPages || this.state.shortcutPages.length < 5 &&
                        <div className="menus-item">
                            <div className="item add" onClick={() => { addMenu(); }} />
                        </div>
                    }

                </div>
                <div className="login-info">
                    <div className="info">
                        <Dropdown overlay={menu} className="account">
                            <div className="user-name">
                                {this.state.token && this.state.token.loginInfo ? this.state.token.loginInfo.name + ' ' : ''}
                                <Icon type="caret-down" /></div>
                        </Dropdown>
                        <Avatar icon="user" className="avatar" />
                    </div>
                    <div className="msg">
                        {/* <Badge count={1} overflowCount={99} offset={[0, 12]} >
              <Icon className="notice" type="bell" />
            </Badge> */}
                    </div>
                </div>
                {/* 网站地图 */}
                <MenuMap showMap={this.state.showMap} closeMap={closeMap} history={this.props.history} />
                {this.state.showPasswordPanel &&
                    <Modal
                        title="修改密码"
                        visible={this.state.showPasswordPanel}
                        onOk={onOk}
                        maskClosable={false}
                        onCancel={onCancel}
                        centered={true}
                        destroyOnClose={true}
                        width={600}
                    >
                        <PasswordResetForm form={this.props.form} />
                    </Modal>}
            </Header>
        );
    }
}

export default MyHeader;
