import React from 'react';
import { Route } from 'react-router-dom';
import SpecialityInfoSearch from './SpecialityInfo';

const routers = [
  <Route key="/speciality/info/search" path="*/speciality/info/search" component={SpecialityInfoSearch} />,
  // <Route key="/domain" path="*/domain" component={Domain} />,
  // <Route key="/role" path="*/role" component={Role} />,
];

export default routers;