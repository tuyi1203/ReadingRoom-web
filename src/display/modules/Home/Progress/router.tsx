import React from 'react';
import { Route } from 'react-router-dom';
import BaseInfo from './Baseinfo';
import Moral from './Moral';
import Qualification from './Qualification';
import Research from './Research';
import Teach from './Teach';
import Educate from './Educate';
import Datadict from './Datadict';
import Teacher from './Teacher';
import Award from './Award';
import AwardSearch from './AwardSearch';

const routers = [
  <Route key="/baseinfo" path="*/baseinfo" component={BaseInfo} />,
  <Route key="/moral" path="*/moral" component={Moral} />,
  <Route key="/qualification" path="*/qualification" component={Qualification} />,
  <Route key="/research" path="*/research" component={Research} />,
  <Route key="/teach" path="*/teach" component={Teach} />,
  <Route key="/educate" path="*/educate" component={Educate} />,
  <Route key="/award/search" path="*/award/search" component={AwardSearch} />,
  <Route key="/award" path="*/award" component={Award} />,
  <Route key="/dict" path="*/dict" component={Datadict} />,
  <Route key="/teacher" path="*/teacher" component={Teacher} />,
  // <Route key="/domain" path="*/domain" component={Domain} />,
  // <Route key="/role" path="*/role" component={Role} />,
];

export default routers;