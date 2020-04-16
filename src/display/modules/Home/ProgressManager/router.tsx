import React from 'react';
import { Route } from 'react-router-dom';
import BaseInfo from './Baseinfo';

const routers = [
  <Route key="/baseinfo" path="*/baseinfo" component={BaseInfo} />,
  // <Route key="/user" path="*/user" component={User} />,
  // <Route key="/group" path="*/group" component={Group} />,
  // <Route key="/domain" path="*/domain" component={Domain} />,
  // <Route key="/role" path="*/role" component={Role} />,
];

export default routers;