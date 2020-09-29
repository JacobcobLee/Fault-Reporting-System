/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)
=========================================================

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index';
import { Provider } from 'react-redux';
import Login from './containers/Login';
import LoadingComponent from './containers/LoadingComponent';
import AuthenticatedComponent from './containers/AuthenticatedComponent';


// core components
import Admin from "layouts/Admin.js";
import Solve from "layouts/Solve.js";
import View from "layouts/View.js";
import Pending from "layouts/Pending.js";
import Editqrcode from "layouts/Editqrcode.js";
import Addstore from "layouts/Addstore.js";
import Editstore from "layouts/Editstore.js";
import AddFault from "layouts/AddFault.js";
import EditFault from "layouts/EditFault.js";


import "assets/css/material-dashboard-react.css?v=1.9.0";

const hist = createBrowserHistory();
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);


ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
  <BrowserRouter>
  <LoadingComponent>
  <Router history={hist}>
    <Switch>
      {/* Default go to login page first */}
      <Route path="/Login" component={Login}/>

      {/* Only if user is logged in then can access */}
      <AuthenticatedComponent>
      {/* Allows user to edit the url and not be keep redirected to /admin/dashboard */}
      <Route exact path="/" render={() => (
        <Redirect to="/admin/dashboard"/>
      )}/>
      <Route exact path="/material-dashboard-react" render={() => (
        <Redirect to="/admin/dashboard"/>
      )}/>
      <Route path="/admin" component={Admin} />
      <Route path="/newcases/solve/" component={Solve}/>
      <Route path="/pending/view/" component={Pending}/>
      <Route path="/resolvedcases/view/" component={View} />
      <Route path="/qr/editqrcode/" component={Editqrcode} />
      <Route path="/store/addstore" component={Addstore} />
      <Route path="/store/editstore/" component={Editstore} />
      <Route path="/fault/addfault/" component={AddFault} />
      <Route path="/fault/editfault/" component={EditFault} />
      </AuthenticatedComponent>
    </Switch>
  </Router>
  </LoadingComponent>
  </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
