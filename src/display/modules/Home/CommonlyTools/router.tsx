import React from 'react';
import { Route } from 'react-router-dom';
import Notifications from './Notifications';
import ClassTables from './ClassTables';
import WeeklyTables from './WeeklyTables';
const routers = [
    <Route key="/notifications" path="*/notifications" component={Notifications} />,
    <Route key="/class_tables" path="*/class_tables" component={ClassTables} />,
    <Route key="/weekly_tables" path="*/weekly_tables" component={WeeklyTables} />,
    // <Route key="/domain" path="*/domain" component={Domain} />,
    // <Route key="/role" path="*/role" component={Role} />,
];

export default routers;