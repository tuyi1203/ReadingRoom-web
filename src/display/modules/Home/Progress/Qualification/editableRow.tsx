import * as React from 'react';
import { Form } from 'antd';

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {

}

interface IContextProps {
  state: IState;
  dispatch: ({ type }: { type: string }) => void;
  form: any;
}

const EditableContext = React.createContext({} as IContextProps);

// const EditableRow = ({ form: any, index, ...props: any }) => (
const EditableRow = (props: any) => (
  <EditableContext.Provider value={props.form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

export { EditableContext, EditableFormRow };
// export EditableContext;