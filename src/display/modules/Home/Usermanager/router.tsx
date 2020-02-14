import React from 'react';
import { Route } from 'react-router-dom';
import User from './User';
import Domain from './Domain';
import Group from './Group';
import Permission from './Permission';

const routers = [
  <Route key="/user" path="*/user" component={User} />,
  <Route key="/group" path="*/group" component={Group} />,
  <Route key="/domain" path="*/domain" component={Domain} />,
  <Route key="/auth" path="*/auth" component={Permission} />,
];

export default routers;