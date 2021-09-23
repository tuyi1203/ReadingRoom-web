import * as React from 'react';
import { Switch, } from 'react-router-dom';
import { Layout, message, Form } from 'antd';
import routes from './router';
import Header from 'src/display/components/Header';
import Slider from 'src/display/components/Slider';
// import Breadcrumb from 'src/display/components/Breadcrumb';
import './index.css';

const { Sider, Content } = Layout;

message.config({
    maxCount: 1,
});

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
    history: any;
    form: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
    collapsed: boolean;
    contentHeight: number;
}

class Home extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            collapsed: false, // 左侧菜单是否收起
            contentHeight: document.body.clientHeight - 98, // content屏幕高度
        };
    }

    /**
     * 切换菜单展开/收起
     */
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    public render() {
        const onCollapse = (collapsed: any, type: any) => {
            this.toggle();
        };
        return (
            <Layout>
                <Header
                    collapsed={this.state.collapsed}
                    toggle={this.toggle}
                    history={this.props.history}
                    form={this.props.form}
                />
                <Layout>
                    <Sider
                        trigger={null}
                        collapsible={true}
                        collapsed={this.state.collapsed}
                        theme="light"
                        className="layout-sider"
                        width="200"
                        onCollapse={onCollapse}
                    >
                        <Slider {...this.props} />
                    </Sider>
                    <Content className="layout-content" style={{ height: this.state.contentHeight }}>
                        <Switch>
                            {routes}
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default Form.create({})(Home);
