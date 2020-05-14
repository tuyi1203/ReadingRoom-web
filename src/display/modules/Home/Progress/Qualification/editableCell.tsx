import * as React from 'react';
import {
  Input,
  Form, Select,
  DatePicker
} from 'antd';
import { EditableContext } from './editableRow';
// import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  form: any;
  record: any;
  handleSave: any;
  dataIndex: string;
  title: string;
  children: any;
  editable: boolean;
  index: number;
  eduoptions: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  editing: boolean;
}

const { Option } = Select;
const { MonthPicker } = DatePicker;

class EditableCell extends React.PureComponent<IProps, IState> {

  input: any;
  // yearOptions: any[];
  // form: any;

  constructor(props: any) {
    super(props);
    // this.yearOptions = [];
    this.state = {
      editing: false,
    };

  }

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;

    const { getFieldDecorator } = this.props.form;

    const toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing && this.input) {
          this.input.focus();
        }
      });
    };

    const save = (e: any) => {
      const { record, handleSave } = this.props;
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        console.log(values);
        if (err) {
          return;
        }
        toggleEdit();
        handleSave({ ...record, ...values });
      });
    };

    /**
     * 学历单选改变时的回调
     */
    const onChange = (value: any) => {
      const { record, handleSave } = this.props;
      // console.log(record);
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        if (err) {
          return;
        }
        console.log(values);
        let param = {
          start: record.start,
          end: record.end,
          school_name: record.school_name,
          prove_person: record.prove_person,
          key: record.key,
          education: value,
        };

        handleSave({ ...param });
        // toggleEdit();
      });
    };

    /**
     * 日期选择时的回调
     */
    const onDateChange = (date: any, dateString: string) => {
      const { record, handleSave } = this.props;
      this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
        if (err) {
          return;
        }
        console.log(values);
        let param = {
          start: record.start,
          end: record.end,
          school_name: record.school_name,
          prove_person: record.prove_person,
          key: record.key,
          education: record.education,
        };

        if (dataIndex === 'start') {
          param.start = dateString;
        }

        if (dataIndex === 'end') {
          param.end = dateString;
        }

        handleSave({ ...param });
        // toggleEdit();
      });
    };

    /**
     * 年度改变时的回调
     */
    // const onDateChange = (type: string, value: any) => {
    //   const { record, handleSave } = this.props;
    //   console.log(record);
    //   this.props.form.validateFields(/*['loginId'],*/ async (err: boolean, values: any) => {
    //     if (err) {
    //       return;
    //     }
    //     let param = {
    //       kaohe: record.value,
    //       niandu_start: record.niand_start,
    //       niandu_end: record.niandu_end,
    //       key: record.key,
    //     };
    //     if (type === 'niandu_start') {
    //       param.niandu_start = value;
    //     } else if (type === 'niandu_end') {
    //       param.niandu_end = value;
    //     }

    //     handleSave({ ...param });
    //     // toggleEdit();
    //   });
    // };

    const renderCell = (form: any) => {
      // this.form = form;
      const { children, dataIndex, record, title } = this.props;
      const { editing } = this.state;
      console.log(record, dataIndex, children);
      return editing ? (
        (dataIndex === 'school_name'
          && (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                initialValue: record[dataIndex] ? record[dataIndex].toString() : null,
                rules: [
                  { required: true, message: `${title}不能为空` }
                ],
              })(
                <Input
                  onPressEnter={save}
                  onBlur={save}
                  placeholder="请输入毕业院校以及专业名称"
                />
              )}
            </Form.Item>
          ))
        || (dataIndex === 'prove_person'
          &&
          (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                initialValue: record[dataIndex] ? record[dataIndex].toString() : null,
                rules: [
                  { required: true, message: `${title}不能为空` }
                ],
              })(
                <Input
                  onPressEnter={save}
                  onBlur={save}
                />
              )}
            </Form.Item>
          )) || (dataIndex === 'education'
            &&
            (
              <Form.Item style={{ margin: 0 }}>
                {
                  getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `${title}不能为空`,
                      },
                    ],
                    // initialValue: moment(record[dataIndex], 'YYYY'),
                    initialValue: record[dataIndex].toString(),
                  })
                    (<Select
                      style={{ width: 200 }}
                      onChange={onChange}
                    >
                      {this.props.eduoptions.map((item: any) => (
                        <Option value={item.value} key={item.value}>{item.label}</Option>
                      ))}
                    </Select>)
                }
              </Form.Item >
            )) || (['start', 'end'].indexOf(dataIndex) !== -1
              &&
              (
                <Form.Item style={{ margin: 0 }}>
                  {
                    getFieldDecorator(dataIndex, {
                      rules: [
                        {
                          required: true,
                          message: `${title}不能为空`,
                        },
                      ],
                      initialValue: moment(record[dataIndex], 'YYYY-MM'),
                      // initialValue: record[dataIndex],
                    })
                      (<MonthPicker onChange={onDateChange} />)
                  }
                </Form.Item >
              ))) : (
          <div
            className="editable-cell-value-wrap"
            style={{ paddingRight: 24 }}
            onClick={toggleEdit}
          >
            {(['school_name', 'prove_person'].indexOf(dataIndex) !== -1
              && record[dataIndex])
              ||
              (['education'].indexOf(dataIndex) !== -1
                && (record[dataIndex] ? this.props.eduoptions.filter((item: any) => { return item.value === record[dataIndex].toString(); })[0].label : null)
              )
              ||
              (['start', 'end'].indexOf(dataIndex) !== -1
                && record[dataIndex]
              )}
          </div>
        );
    };

    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}

export default Form.create()(EditableCell);