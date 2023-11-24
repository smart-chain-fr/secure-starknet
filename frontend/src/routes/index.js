import React from 'react';
import { Route, Switch } from 'react-router';
import Home from '../components/Home';
import Hello from '../components/Hello';
import NoMatch from '../components/NoMatch';
import NavBar from '../components/NavBar';
import Toastr from '../components/Toastr';
import Login from '../pages/Login';
import Register from '../pages/Register';

const routes = (
  <div>
    <NavBar />
    <Toastr />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route path="/hello" component={Hello} />
      <Route component={NoMatch} />
    </Switch>
  </div>
);

export default routes;
