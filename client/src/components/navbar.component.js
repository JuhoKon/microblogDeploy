import React, { Component, Fragment } from "react";
import "../public/stylesheets/navbar.css";
import RegisterModal from "./auth/registerModal.component";
import LogOut from "./auth/logout.component";
import LoginModal from "./auth/loginModal.component";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadUser } from "../actions/auth.actions";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

import store from "../store";

class NavbarComponent extends Component {
  constructor(props) {
    super(props);

    // https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp
    let prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
      let currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0";
      } else {
        document.getElementById("navbar").style.top = "-50px";
      }
      prevScrollpos = currentScrollPos;
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  };
  state = {
    isOpen: false
  };
  componentDidMount() {
    store.dispatch(loadUser());
    this.interval = setInterval(() => {
      store.dispatch(loadUser());
    }, 60000); //check if the user is logged in every minute
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { isAuth } = this.props.auth; //get everything from authreducer, what we defined there, user.. auth etc.

    const authLinks = (
      <Fragment>
        <li className="navbar-item">
          <NavLink href="/user" className="nav-link">
            Profile
          </NavLink>
        </li>
        <li>
          <LogOut />
        </li>
      </Fragment>
    );
    const guestLinks = (
      <Fragment>
        <li>
          <RegisterModal />
        </li>
        <li>
          <LoginModal />
        </li>
      </Fragment>
    );
    const toggle = () =>
      this.setState({
        isOpen: !this.state.isOpen
      });
    return (
      <div>
        <Navbar
          id="navbar"
          color="dark"
          dark
          expand="md"
          className="navbar navbar-dark navbar-expand-lg"
        >
          <NavLink href="/" className="navbar-brand">
            MicroBlog
          </NavLink>
          <NavbarToggler onClick={toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="navbar-nav mr-auto">
              <NavItem>
                <NavLink href="/posts" className="nav-link">
                  All Posts
                </NavLink>
              </NavItem>
              {isAuth ? (
                <NavItem>
                  <NavLink href="/followed" className="nav-link">
                    Followed Posts
                  </NavLink>
                </NavItem>
              ) : null}
            </Nav>
            <ul className="navbar-nav">{isAuth ? authLinks : guestLinks}</ul>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth //from reducer
});
//connect to store -> data to mapstatetoprops
//actions we want to use as second paranthesis
export default connect(mapStateToProps, null)(NavbarComponent);
