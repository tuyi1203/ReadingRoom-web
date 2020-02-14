import * as React from 'react';
import { Drawer, Table } from 'antd';
// import CommonUtils from 'src/utils/commonUtils';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  // form: any;
  drawerData: any;
  onClose: any;
  visible: boolean;
  userList: any[];
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  // pageList: any[]; // 当前页授权用户列表
}

/**
 * UserInfoDrawer
 */
class UserInfoDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: this.props.userList.length, // 总条数
    };
  }

  render() {
    const { drawerData, onClose, userList } = this.props;
    const { page, pageSize, total } = this.state;
    // console.log(this.props.visible);

    const pStyle = {
      fontSize: 16,
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: 16,
    };

    /**
     * 改变分页
     */
    const changePage = (page: number) => {
      this.setState({
        page: page
      }, () => {
        // this.getList();
      });
    };

    /**
     * 改变页大小
     */
    const changePageSize = (current: number, size: number) => {
      this.setState({
        pageSize: size
      }, () => {
        // this.getList();
      });
    };

    /**
     * 工作空间列
     */
    const column = [
      {
        title: '用户名',
        key: 'username',
        dataIndex: 'username',
        width: 200,
      },
      {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
        width: 200,
      },
      {
        title: '手机',
        key: 'telephone',
        dataIndex: 'telephone',
        width: 200,
      },
    ];

    return (
      <Drawer
        width={600}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
      >
        <p style={{ ...pStyle, marginBottom: 24 }}>工作空间：{drawerData && drawerData.name}用户信息</p>
        <Table
          columns={column}
          rowKey="id"
          dataSource={userList}
          bordered={true}
          pagination={{
            size: 'small',
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: changePage,
            onShowSizeChange: changePageSize,
            total,
            current: page,
            pageSize,
          }}
        />
      </Drawer>
    );
  }
}

export default UserInfoDrawer;
