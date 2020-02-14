import * as React from 'react';
import { IPManage } from 'src/api';
import moment from 'moment';
import { Table } from 'antd';
/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  resourceType: any;
  onSelectChange: any;
  hasSelected?: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
  DomainListUnLoginList: any;
  selected: any;
}

/**
 * OwnerdomainsSelectModal
 */
class OwnerdomainsSelectModal extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      DomainListUnLoginList: [],
      selected: []
    };
  }

  UNSAFE_componentWillMount() {
    this.getDomainList();
    console.log('拿到的resourceType:', this.props.resourceType);
    console.log('拿到的hasSelected:', this.props.hasSelected);
    if (this.props.hasSelected) {
      this.setState({ selected: this.props.hasSelected });
    }
  }

  // 获取资源归属
  getDomainList = async () => {
    const res = await IPManage.getDomainListUnLogin({});
    console.log('所有资源归属::', res.results.data);
    if (res.code) {
      const { resourceType } = this.props;
      let list: any = [];
      if (res.results.data && res.results.data.length > 0) {
        if (resourceType === 2) {
          res.results.data.forEach((e: any) => {
            if (!e.internal_domain) {
              list.push(e);
            }
          });
        }
        if (resourceType === 3) {
          res.results.data.forEach((e: any) => {
            list.push(e);
          });
        }
      }
      this.setState({
        DomainListUnLoginList: list,
      }, () => {
        console.log('筛选后资源归属::', this.state.DomainListUnLoginList);
      });
    }
  }
  onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    console.log(selectedRowKeys);
    console.log(selectedRows);
    this.setState({ selected: selectedRowKeys }, () => {
      this.props.onSelectChange(selectedRowKeys, selectedRows);
    });
  }
  render() {
    const { selected } = this.state;
    const rowSelection = {
      selectedRowKeys: selected,
      onChange: this.onSelectChange,
    };
    const column = [
      {
        title: '资源名',
        key: 'name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '资源类别',
        key: 'internal_domain',
        dataIndex: 'internal_domain',
        width: 200,
        render: (text: any, record: any) => {
          return text ? '内部资源' : '外部资源';
        }
      },
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
      <div>
        <Table
          columns={column}
          rowKey="id"
          dataSource={this.state.DomainListUnLoginList}
          bordered={true}
          rowSelection={rowSelection}
          pagination={false}
        // pagination={{
        //   size: 'small',
        //   showQuickJumper: true,
        //   showSizeChanger: true,
        //   onChange: changePage,
        //   onShowSizeChange: changePageSize,
        //   total,
        //   current: page,
        //   pageSize,
        // }}
        />
      </div>
    );
  }
}

export default OwnerdomainsSelectModal;