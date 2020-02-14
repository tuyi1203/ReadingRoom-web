import * as React from 'react';
import IPages from 'src/dataModel/IPages';
import storageUtils from 'src/utils/storageUtils';
import Constant from 'src/dataModel/Constant';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  currentPage: IPages;
}

/**
 * DEMO2
 */
class CurrentPage extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentPage: JSON.parse(storageUtils.get(Constant.CURRENT_PAGE_KEY))
    };
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      currentPage: JSON.parse(storageUtils.get(Constant.CURRENT_PAGE_KEY))
    });
  }

  render() {
    const { currentPage } = this.state;

    return (
      <span>{currentPage ? currentPage.name : ''}</span>
    );
  }
}

export default CurrentPage;
