import * as React from 'react';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义一致 */
export interface IState {
}

/**
 * Tag
 */
class Tag extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <div>客户标签管理</div>
      </div>
    );
  }
}

export default Tag;