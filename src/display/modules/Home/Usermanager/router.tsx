import React from 'react';
import { Route } from 'react-router-dom';
import User from './User';
import Domain from './Domain';
import Group from './Group';
import Role from './Role';

const routers = [
  <Route key="/list" path="*/list" component={User} />,
  <Route key="/user" path="*/user" component={User} />,
  <Route key="/group" path="*/group" component={Group} />,
  <Route key="/domain" path="*/domain" component={Domain} />,
  <Route key="/role" path="*/role" component={Role} />,
];

export default routers;