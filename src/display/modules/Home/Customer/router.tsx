import React from 'react';
import { Route } from 'react-router-dom';
import Info from './Info';
import Detail from './Detail';
import Tag from './Tag';

const routers = [
  <Route exact={true} key="/info" path="*/info" component={Info} />, // 客户信息管理
  <Route key="/info/detail" path="*/info/detail" component={Detail} />, // 客户详情管理
  <Route exact={true} key="/tag" path="*/tag" component={Tag} />, // 客户标签管理
];

export default routers;