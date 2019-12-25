import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./public/stylesheets/styles.css";
import "./public/stylesheets/navbar.css";
import store from "./store";
import Navbar from "./components/navbar.component";
import PostsList from "./components/posts-list.component";
import UserInfo from "./components/userinfo-component";
import OtherUserInfo from "./components/otheruserinfo-component";
import FollowedPosts from "./components/followedposts-component.js";
import HomePage from "./components/homepage-component";
function App() {
  const Page404 = ({ location }) => (
    <div className="container">
      <br />
      <h2>
        404 error. The requested url {location.pathname} was not found on this
        server.
      </h2>
    </div>
  );
  return (
    <div className="app">
      <Provider store={store}>
        <Router>
          <Navbar></Navbar>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/posts" exact component={PostsList} />
            <Route path="/user" exact component={UserInfo} />
            <Route path="/user:id" exact component={OtherUserInfo} />
            <Route path="/followed" exact component={FollowedPosts} />
            <Route component={Page404} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
