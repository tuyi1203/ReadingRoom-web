import * as React from 'react';
import { Table } from 'antd';
import _ from 'lodash';
import { system } from 'src/api';
import moment from 'moment';
// import CommonUtils from 'src/utils/commonUtils';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  selectedDomains: any;
  onSelectChange: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  page: number;
  pageSize: number;
  total: number;
  domainList: any[];
}

/**
 * UserListModal
 */
class DomainListModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0, // 总条数
      domainList: [], // 组织列表
    };
  }

  UNSAFE_componentWillMount() {
    this.getDomainList();
  }

  /**
   * 获取用户组列表
   */
  getDomainList = async () => {
    const res = await system.getDomain({
      page: this.state.pageSize,
      page_size: this.state.pageSize
    });
    if (!res.code) {
      return;
    }
    if (res) {
      this.setState({
        domainList: res.results.data,
        total: res.results.count
      });
    }
  }

  /**
   * 组织类型
   */
  domainTypes = [{
    label: '内部组织',
    value: true
  }, {
    label: '外部组织',
    value: false
  }];

  render() {
    const { onSelectChange, selectedDomains } = this.props;
    const { domainList } = this.state;
    const {
      total,
      page,
      pageSize,
    } = this.state;
    console.log(selectedDomains);

    /**
     * 改变分页
     */
    const changePage = (page: number) => {
      this.setState({
        page: page
      }, () => {
        this.getDomainList();
      });
    };

    /**
     * 改变页大小
     */
    const changePageSize = (current: number, size: number) => {
      this.setState({
        pageSize: size,
        page: 1,
      }, () => {
        this.getDomainList();
      });
    };

    /**
     * 资源归属弹窗选中值发生变化时处理
     */
    const rowSelection = {
      selectedRowKeys: selectedDomains,
      onChange: onSelectChange,
      getCheckboxProps: (record: any) => {
        return {
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        };
      },
    };

    const column = [
      {
        title: '组织名',
        key: 'name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '组织类别',
        key: 'internal_domain',
        dataIndex: 'internal_domain',
        width: 200,
        render: (text: any, record: any) => {
          return (_.find(this.domainTypes, ['value', text]) ?.label);
        }
      },
      // {
      //   title: '组织管理员',
      //   key: 'domain_admin_role_count',
      //   dataIndex: 'domain_admin_role_count',
      //   width: 200,
      //   render: (text: any, record: any) => {
      //     return (<span><a onClick={() => showDrawer(record)}>{text}</a></span>);
      //   }
      // },
      {
        title: '描述',
        key: 'description',
        dataIndex: 'description',
        width: 200,
      },
      {
        title: '创建日期',
        key: 'create_date',
        dataIndex: 'create_date',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <span>
              {moment(text).format('YYYY-MM-DD & HH:mm:ss')}
            </span>
          );
        }
      },
    ];

    return (
      <Table
        columns={column}
        rowKey="id"
        dataSource={domainList}
        bordered={true}
        rowSelection={rowSelection}
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
    );
  }
}

export default DomainListModal;
