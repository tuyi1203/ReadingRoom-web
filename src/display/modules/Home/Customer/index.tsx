import * as React from 'react';
import { Switch } from 'react-router-dom';
import routes from './router';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
}

/**
 * Customer
 */
class Customer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Switch>
        {routes}
      </Switch>
    );
  }
}

export default Customer;