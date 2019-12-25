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
import { register } from "../../actions/auth.actions";
import { clearErrors } from "../../actions/error.actions";
import PropTypes from "prop-types";

class RegisterModal extends Component {
  state = {
    modal: false,
    name: "",
    email: "",
    password: "",
    age: Date,
    message: null,
    messageTest: []
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, auth } = this.props;
    if (error !== prevProps.error) {
      //CHECK FOR REGISTER ERROR
      if (error.id === "REGISTER_FAIL") {
        this.setState({
          message: error.message.err,
          messageTest: error.message.erro
        });
      } else {
        this.setState({ message: null });
      }
    }
    //handle closing the modal
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
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { name, email, password, age } = this.state;
    //get attributes
    const newUser = {
      name,
      email,
      password,
      age
    };
    this.props.register(newUser); //attempt to register user
  };

  render() {
    //iterate through errors and add them to array for alerts
    const errors = [];
    if (this.state.messageTest !== null) {
      if (typeof this.state.messageTest !== "undefined") {
        this.state.messageTest.map(msg => {
          if (msg.password) {
            errors.push(msg.password);
          }
          if (msg.email) {
            errors.push(msg.email);
          }
          if (msg.name) {
            errors.push(msg.name);
          }
          return null;
        });
      }
    }
    //display alerts
    const alerts = (
      <div>
        {errors.map(msg => (
          <Alert color="danger" key={msg}>
            {msg}
          </Alert>
        ))}
      </div>
    );

    return (
      <div>
        <NavLink onClick={this.toggle} href="#">
          Register
        </NavLink>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader className="mb-4" toggle={this.toggle}>
            Sign up
          </ModalHeader>
          {this.state.message ? (
            <Alert color="danger">{this.state.message}</Alert>
          ) : null}
          {alerts}
          <p className="formText text-center">
            Please fill in this form to create an account!
          </p>
          <Form onSubmit={this.onSubmit}>
            <ModalBody>
              <FormGroup>
                <Label className="mb-3" for="name">
                  Username:
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Username"
                  className="mb-3"
                  onChange={this.onChange}
                ></Input>
                <Label className="mb-3" for="name">
                  Email address:
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  className="mb-3"
                  onChange={this.onChange}
                ></Input>
                <Label className="mb-" for="name">
                  Password:
                </Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="mb-3"
                  onChange={this.onChange}
                ></Input>
                <small className="form-text text-muted mb-2 text-center">
                  At least 8 characters
                </small>
                <Label for="name">Date of birth</Label>
                <Input
                  type="Date"
                  name="age"
                  id="age"
                  placeholder="age"
                  className="mb-3"
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
  auth: state.auth,
  error: state.error //get these from the reducer, have error and auth there
});

export default connect(mapStateToProps, { register, clearErrors })(
  RegisterModal
);
