import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { ConfigProvider } from 'antd';
import './index.css';

ReactDOM.render(
  <ConfigProvider locale={zh_CN}>
    <App />
  </ConfigProvider>,
  document.getElementById('root') as HTMLElement
);
