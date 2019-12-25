import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert
} from "reactstrap";

import { connect } from "react-redux";
import { login } from "../../actions/auth.actions";
import { clearErrors } from "../../actions/error.actions";
import PropTypes from "prop-types";

class LoginModal extends Component {
  state = {
    modal: false,
    email: "",
    password: "",
    message: null
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, auth } = this.props;
    if (error !== prevProps.error) {
      //CHECK FOR REGISTER ERROR
      if (error.id === "LOGIN_FAIL") {
        this.setState({ message: error.message.msg });
      } else {
        this.setState({ message: null });
      }
    }
    if (this.state.modal) {
      //IF modal is true, popup is on
      if (auth.isAuth) {
        //if auth.isauth true, already authenthicated, so close popup.
        this.toggle();
      }
    }
  }

  toggle = () => {
    this.props.clearErrors(); //clearing errors
    this.setState({
      //close popup
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    const user = {
      email,
      password
    };

    this.props.login(user); //ATTEMPT TO LOGIN
  };

  render() {
    return (
      <div>
        <NavLink onClick={this.toggle} href="#">
          Login
        </NavLink>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader className="mb-3" toggle={this.toggle}>
            Login
          </ModalHeader>
          {this.state.message ? (
            <Alert color="danger">{this.state.message}</Alert>
          ) : null}
          <h3 className="title mx-auto">Welcome</h3>
          <Form onSubmit={this.onSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="name">Email:</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  className="mb-4"
                  onChange={this.onChange}
                ></Input>
                <Label for="name">Password:</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="mb-4"
                  onChange={this.onChange}
                ></Input>
                <Button className="btn btn-primary my-4 btn-block">
                  Sign in
                </Button>
              </FormGroup>
            </ModalBody>
          </Form>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  //specify what state we want as props
  auth: state.auth,
  error: state.error //get these from the reducer, have error and auth there
});

export default connect(mapStateToProps, { login, clearErrors })(LoginModal);
