import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/main/Profile";
import EditProfile from "./components/main/EditProfile";
import PrivateRoutes from "./components/routing/PrivateRoutes";
import NavBar from "./components/layout/NavBar";
import "./css/main.css";
import store from "./store";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <Provider store={store}>
      <CookiesProvider>
        <Fragment>
          <Router>
            <Switch>
              <PrivateRoutes
                exact
                path={["/", "/editProfile"]}
                component={NavBar}
              />
            </Switch>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoutes exact path="/" component={Profile} />
              <PrivateRoutes
                exact
                path="/editProfile"
                component={EditProfile}
              />
            </Switch>
          </Router>
        </Fragment>
      </CookiesProvider>
    </Provider>
  );
}

export default App;
