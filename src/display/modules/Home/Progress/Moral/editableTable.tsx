import * as React from 'react';
import { Popconfirm, Button, Table } from 'antd';
import { EditableFormRow } from './editableRow';
import EditableCell from './editableCell';

export interface IProps {
  form: any;
  editAble: boolean;
  editData: any;
  tablechange: any;
  getOptions: any;
  // props: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  dataSource: any[];
  count: number;
  editAble: boolean;
}

class EditableTable extends React.PureComponent<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
      editAble: props.editAble,
      dataSource: [],
      // dataSource: [
      //   {
      //     key: '0',
      //     name: 'Edward King 0',
      //     age: '32',
      //     address: 'London, Park Lane no. 0',
      //   },
      //   {
      //     key: '1',
      //     name: 'Edward King 1',
      //     age: '32',
      //     address: 'London, Park Lane no. 1',
      //   },
      // ],
      count: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const dataSource: any[] = [];
    for (let i = 1; i < 6; i++) {
      if (nextProps.editData['niandu' + i]) {
        const column: any = {
          key: i,
          niandu_start: nextProps.editData['niandu' + i].split('-')[0],
          niandu_end: nextProps.editData['niandu' + i].split('-')[1],
          kaohe_level: nextProps.editData['niandu' + i + '_kaohe'],
        };
        dataSource.push(column);
      }
    }
    this.props.tablechange(dataSource);
    // console.log(nextProps.editData, dataSource);
    this.setState({
      editAble: nextProps.editAble,
      dataSource,
      count: dataSource.length,
    });
  }

  handleDelete = (key: any) => {
    const dataSource = [...this.state.dataSource];
    const newData = dataSource.filter(item => item.key !== key);
    this.setState({ dataSource: newData, count: this.state.count - 1 }, () => {
      this.props.tablechange(newData);
    });
  }

  handleSave = (row: any) => {
    console.log('row=', row);
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log('newdata=', newData);
    this.setState({ dataSource: newData }, () => {
      this.props.tablechange(newData);
    });
  }

  render() {

    const { dataSource } = this.state;
    const kaoheOptions = this.props.getOptions('kaohe_level');
    const yearOptions: any[] = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date();
      const year = date.getFullYear();
      const yearOption = {
        value: (year - i).toString(),
        label: (year - i).toString(),
      };
      yearOptions.push(yearOption);
    }

    const handleAdd = () => {
      const { count, dataSource } = this.state;
      const newData = {
        key: count + 1,
        niandu_start: yearOptions[0].value,
        niandu_end: yearOptions[0].value,
        kaohe_level: kaoheOptions[0].value,
        // address: `London, Park Lane no. ${count}`,
      };
      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
      }, () => {
        this.props.tablechange(this.state.dataSource);
      });
    };

    let columns = [
      {
        title: '年度（开始）',
        dataIndex: 'niandu_start',
        width: '30%',
        editable: this.state.editAble,
      },
      {
        title: '年度（结束）',
        dataIndex: 'niandu_end',
        editable: this.state.editAble,
      },
      {
        title: '考核等级',
        dataIndex: 'kaohe_level',
        editable: this.state.editAble,
        render: (text: any, record: any) => {
          const kaoheLevel = kaoheOptions.filter((item: any) => {
            // console.log(item, record);
            return item.value === record['kaohe_level'];
          });

          return kaoheLevel.length ? kaoheLevel[0].label : '';
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text: any, record: any) =>
          this.state.dataSource.length >= 1 && this.state.editAble ? (
            <Popconfirm title="确认删除吗?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      },
    ];
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record: any) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          kaoheoptions: kaoheOptions,
          yearoptions: yearOptions,
        }),
      };
    });
    return (
      <div>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} disabled={!this.state.editAble || this.state.count > 4}>
          增加一个年度
          </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered={true}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default EditableTable;