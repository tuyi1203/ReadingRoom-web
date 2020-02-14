import * as React from 'react';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

/**
 * DEMO2
 */
class Dashboard extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>首页</div>
    );
  }
}

export default Dashboard;
