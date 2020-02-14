import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Datadict from './Datadict';
import Datacenter from './Datacenter/';
import UserManager from './Usermanager';
import NetElementManager from './NetElementManager';
import Orchestration from './Orchestration';
import IPManager from './IPManager';
import ISPManager from './ISPManager';

const routers = [
  <Route key="/dashboard" path="*/dashboard" component={Dashboard} />,
  <Route exact={true} key="/infra/datadict" path="*/infra/datadict" component={Datadict} />, // 网元字典
  <Route key="/infra/datacenter" path="*/infra/datacenter" component={Datacenter} />, // 数据中心字典
  <Route key="/usermanager" path="*/usermanager" component={UserManager} />, // 用户管理
  <Route key="/orchestration" path="*/orchestration" component={Orchestration} />, // 编排器管理
  <Route key="/infra/netelementmanager" path="*/infra/netelementmanager" component={NetElementManager} />, // 网元管理
  <Route key="/ispmanager" path="*/ispmanager/" component={ISPManager} />, // 运营商管理
  <Route key="/ipmanager" path="*/ipmanager/" component={IPManager} />, // IP资源管理
  <Route key="/ipmanager" path="*/ipmanager/" component={IPManager} />, // IP资源管理
];

export default routers;