import React from 'react';
import { Route } from 'react-router-dom';
import Yang from './Yangs';
import Heatbeatgroups from './Heatbeatgroups';
import Infos from './Infos';

const routers = [
  <Route key="/yangs" path="*/yangs" component={Yang} />,
  <Route key="/heatbeatgroups" path="*/heatbeatgroups" component={Heatbeatgroups} />,
  <Route key="/infos" path="*/infos" component={Infos} />,
];

export default routers;