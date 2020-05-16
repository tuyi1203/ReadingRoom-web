import * as React from 'react';
import { Popconfirm, Button, Table } from 'antd';
import { EditableFormRow } from './editableRow';
import EditableCell from './editableCell';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

export interface IProps {
  form: any;
  editAble: boolean;
  editData: any;
  tablechange: any;
  getOptions: any;
  activeKey: string;
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
      count: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const dataSource: any[] = [];

    if (nextProps.editData && nextProps.editData.experience && nextProps.editData.experience.length > 0) {
      nextProps.editData.experience.forEach((item: any, index: number) => {
        if (this.props.activeKey === '1') {
          dataSource.push({
            start: item.start_year + '-' + item.start_month,
            end: item.end_year + '-' + item.end_month,
            education: item.education,
            prove_person: item.prove_person,
            school_name: item.school_name,
            key: index + 1,
          });
        } else if (this.props.activeKey === '3') {
          dataSource.push({
            start: item.start_year + '-' + item.start_month,
            end: item.end_year + '-' + item.end_month,
            company: item.company,
            affairs: item.affairs,
            prove_person: item.prove_person,
            key: index + 1,
          });
        } else if (this.props.activeKey === '4') {
          dataSource.push({
            start: item.start_year + '-' + item.start_month,
            end: item.end_year + '-' + item.end_month,
            affairs: item.affairs,
            prove_person: item.prove_person,
            key: index + 1,
          });
        }

      });
    }
    this.props.tablechange(dataSource);
    console.log(nextProps.editData, dataSource);
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
    const { activeKey } = this.props;
    const eduOptions = this.props.getOptions('education');
    // const yearOptions: any[] = [];

    const handleAdd = () => {
      const { count, dataSource } = this.state;
      const date = new Date();
      const thisMonth = date.getFullYear() + '-' + (date.getMonth() + 1);
      let newData: any = {};
      if (this.props.activeKey === '1') {
        newData = {
          key: count + 1,
          start: thisMonth,
          end: thisMonth,
          school_name: '',
          education: 1,
          prove_person: '',
          // address: `London, Park Lane no. ${count}`,
        };
      } else if (this.props.activeKey === '3') {
        newData = {
          key: count + 1,
          start: thisMonth,
          end: thisMonth,
          company: '',
          affairs: '',
          prove_person: '',
          // address: `London, Park Lane no. ${count}`,
        };
      } else if (this.props.activeKey === '4') {
        newData = {
          key: count + 1,
          start: thisMonth,
          end: thisMonth,
          affairs: '',
          prove_person: '',
          // address: `London, Park Lane no. ${count}`,
        };
      }

      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
      }, () => {
        this.props.tablechange(this.state.dataSource);
      });
    };

    let columns: any[] = [];
    if (activeKey === '1') {
      columns = [
        {
          title: '开始日期',
          dataIndex: 'start',
          width: 100,
          editable: this.state.editAble,
        },
        {
          title: '结束日期',
          dataIndex: 'end',
          width: 100,
          editable: this.state.editAble,
        },
        {
          title: '毕业院校及专业名称（以毕业证为准）',
          dataIndex: 'school_name',
          width: '30%',
          editable: this.state.editAble,
        },
        {
          title: '学历',
          dataIndex: 'education',
          width: 250,
          editable: this.state.editAble,
          render: (text: any, record: any) => {
            return text
              ? eduOptions.filter((item: any) => { return item.value === text.toString(); })[0].label
              : null;
          }
        },
        {
          title: '证明人',
          dataIndex: 'prove_person',
          editable: this.state.editAble,
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
    } else if (activeKey === '3') {
      columns = [
        {
          title: '开始日期',
          dataIndex: 'start',
          width: 150,
          editable: this.state.editAble,
        },
        {
          title: '结束日期',
          dataIndex: 'end',
          width: 150,
          editable: this.state.editAble,
        },
        {
          title: '工作单位',
          dataIndex: 'company',
          width: '25%',
          editable: this.state.editAble,
        },
        {
          title: '从事何专业、技术工作（任教学科）',
          dataIndex: 'affairs',
          width: '25%',
          editable: this.state.editAble,
        },
        {
          title: '证明人',
          dataIndex: 'prove_person',
          editable: this.state.editAble,
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
    } else if (activeKey === '4') {
      columns = [
        {
          title: '开始日期',
          dataIndex: 'start',
          width: 150,
          editable: this.state.editAble,
        },
        {
          title: '结束日期',
          dataIndex: 'end',
          width: 150,
          editable: this.state.editAble,
        },
        {
          title: '担任何种学生管理工作',
          dataIndex: 'affairs',
          width: '25%',
          editable: this.state.editAble,
        },
        {
          title: '证明人',
          dataIndex: 'prove_person',
          editable: this.state.editAble,
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
    }

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
          eduoptions: eduOptions,
          activeKey,
        }),
      };
    });

    const moveRow = (dragIndex: any, hoverIndex: any) => {
      if (!this.props.editAble) {
        return;
      }
      const { dataSource } = this.state;
      const dragRow = dataSource[dragIndex];

      this.setState(
        update(this.state, {
          dataSource: {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
          },
        }), () => {
          this.props.tablechange(this.state.dataSource);
        }
      );
    };

    return (
      <div>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} disabled={!this.state.editAble}>
          {
            (activeKey === '1' && '增加教育经历')
            || (activeKey === '3' && '增加工作经历')
            || (activeKey === '4' && '增加教育管理工作经历')
          }
        </Button>
        <DndProvider backend={HTML5Backend}>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered={true}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            onRow={(record, index) => ({
              index,
              moveRow
            })}
          />
        </DndProvider>
      </div>
    );
  }
}

export default EditableTable;