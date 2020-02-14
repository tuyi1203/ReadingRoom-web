import * as React from 'react';
import { Button } from 'antd';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {

}

/**
 * DEMO2
 */
class CommonButton extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    /**
     * 刷新
     */
    const refesh = () => {
      window.location.reload();
    };

    return (
      <Button icon="sync" onClick={() => { refesh(); }} />
    );
  }
}

export default CommonButton;
