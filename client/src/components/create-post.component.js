import React, { Component } from "react";
import "../public/stylesheets/button.css";
import { addItem, clearMessages } from "../actions/post.actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Alert } from "reactstrap";
import { clearErrors } from "../actions/error.actions";
import { loadUser } from "../actions/auth.actions";

class CreatePost extends Component {
  state = {
    text: "",
    title: "",
    file: null,
    messageTest: [],
    errorMessage: ""
  };
  static propTypes = {
    auth: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearMessages: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      //CHECK FOR ERRORS
      //ADD THEM TO STATE
      if (typeof error.message.erro !== "undefined") {
        this.props.clearMessages(); //clear the success message (if exists)
        this.setState({ messageTest: error.message.erro });
      } else if (typeof error.message.msg !== "undefined") {
        this.props.clearMessages(); //clear the success message (if exists)
        this.setState({ errorMessage: error.message.msg });
      } else {
        this.setState({ messageTest: [], errorMessage: "" }); //can't clearerrors here since it will put us on an endless loop
      }
    }
  }
  componentWillUnmount() {
    //CLEAR MESSAGES WHEN THE COMPONENT STOPS EXISTING
    this.props.clearMessages();
  }
  handleFile(e) {
    //HANDLE FILE UPLOAD
    let file = e.target.files[0];
    this.setState({ file: file });
  }

  onChangetext = e => {
    this.setState({
      text: e.target.value
    });
  };
  onChangeTitle = e => {
    this.setState({
      title: e.target.value
    });
  };
  onSubmit = e => {
    e.preventDefault();
    const { user } = this.props.auth;
    const post = new FormData(); //CONSTRUCTING THE POST ELEMENT TO BE SENT TO THE API
    post.append("username", user.name);
    post.append("owner", user._id);
    post.append("text", this.state.text);
    post.append("title", this.state.title);
    post.append("image", this.state.file);
    this.props.addItem(post);
    this.props.clearErrors(); //clear errors so we clear out previous alert
    this.setState({
      text: "",
      title: "",
      file: null
    });
  };

  render() {
    const errors = [];
    //Iterate through errors and add them in to array for easier rendering
    if (this.state.messageTest !== null) {
      if (typeof this.state.messageTest !== "undefined") {
        this.state.messageTest.map(msg => {
          if (msg.title) {
            errors.push(msg.title);
          }
          if (msg.text) {
            errors.push(msg.text);
          }
          return null;
        });
      }
    }
    const alerts = ( //ITERATE THROUGH ERRORS AND DISPLAY THEM
      <div>
        {errors.map(msg => (
          <Alert color="danger" key={msg}>
            {msg}
          </Alert>
        ))}
        {this.state.errorMessage ? (
          <Alert color="danger" key={this.state.errorMessage}>
            {this.state.errorMessage}
          </Alert>
        ) : null}
      </div>
    );

    const { isAuth } = this.props.auth; //For checking if the user is logged in
    const { message } = this.props.item; //ON SUCCESS CREATING POST, WE GET A MESSAGE

    //CONTENT THAT WILL REQUIRE AUTH (LOGGED IN USER)
    const authContent = (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          {message ? (
            <Alert dismissible="true" color="success">
              {message}
            </Alert>
          ) : (
            <Alert color="" />
          )}
          {alerts}
          <label>Title: </label>
          <input
            type="text"
            required
            className="form-control "
            value={this.state.title}
            onChange={this.onChangeTitle}
          />
        </div>
        <div className="form-group">
          <label>Text: </label>
          <input
            type="textarea"
            required
            className="form-control "
            value={this.state.text}
            onChange={this.onChangetext}
          />
        </div>
        <div className="form-group">
          <label>File (max 10MB) </label>
          <input type="file" name="file" onChange={e => this.handleFile(e)} />
          <br />
          <label>
            {this.state.file
              ? `File selected: ${this.state.file.name} ${Math.round(
                  (this.state.file.size / 1024 / 1024 + Number.EPSILON) * 100
                ) / 100} MB`
              : "No file is selected."}
          </label>
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Create a post"
            className="btn btn-primary"
          />
        </div>
      </form>
    );
    return (
      <div className="container-fluid createPost">
        <br />
        <h3>Create a new post</h3>
        {isAuth ? authContent : "Please login to create posts."}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  item: state.item,
  error: state.error
});
//connect to store -> data to props from state
export default connect(mapStateToProps, {
  addItem,
  clearMessages,
  clearErrors,
  loadUser
})(CreatePost);
