import * as React from 'react';
import { Form } from 'antd';
import { DragSource, DropTarget } from 'react-dnd';

let dragingIndex = -1;

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
// const EditableRow = (props: any) => (
//   <EditableContext.Provider value={props.form}>
//     <tr {...props} />
//   </EditableContext.Provider>
// );

export interface IProps {
  form: any;
  isOver: any;
  connectDragSource: any;
  connectDropTarget: any;
  moveRow: any;
  style: any;
  className: any;
  index: any;
  // props: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

class BodyRow extends React.PureComponent<IProps, IState> {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, form, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    // return connectDragSource(
    //   connectDropTarget(
    //     <div>
    //       <EditableContext.Provider value={form}>
    //         <tr {...restProps} className={className} style={style} />
    //       </EditableContext.Provider>
    //     </div>
    //   ),
    // );
    return (
      <EditableContext.Provider value={form}>
        {
          connectDragSource(
            connectDropTarget(
              <tr {...restProps} className={className} style={style} />
            ),
          )}
      </EditableContext.Provider>);
  }
}

const rowSource = {
  beginDrag(props: any) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props: any, monitor: any) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

// const EditableFormRow = Form.create()(EditableRow);

const EditableFormRow = Form.create()(DragableBodyRow);

export { EditableContext, EditableFormRow };
// export EditableContext;