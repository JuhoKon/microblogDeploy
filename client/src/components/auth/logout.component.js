import React, { Component } from "react";
import { logout } from "../../actions/auth.actions";
import { NavLink } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export class LogOut extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired
  };
  render() {
    return (
      <div>
        <NavLink onClick={this.props.logout} href="#">
          Logout
        </NavLink>
      </div>
    );
  }
}

export default connect(null, { logout })(LogOut);
