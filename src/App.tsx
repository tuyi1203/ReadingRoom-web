import * as React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import AuthRoute from 'src/display/components/AuthRoute';
import Login from './display/modules/Login';
import Home from './display/modules/Home';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/login" component={Login} />
          <AuthRoute path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
