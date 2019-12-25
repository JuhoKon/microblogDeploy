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
  Alert
} from "reactstrap";
import { updateItem, clearMessages } from "../actions/post.actions";
import { connect } from "react-redux";
import { clearErrors } from "../actions/error.actions";
import PropTypes from "prop-types";

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      title: props.title,
      text: props.text,
      postid: props.id,
      owner: props.owner,
      username: props.username,
      messageTest: []
    };
  }
  static propTypes = {
    updateItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearMessages: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      //CHECK FOR ERRORS
      //ADD THEM TO STATE
      if (typeof error.message !== "undefined") {
        this.setState({ messageTest: error.message.erro });
        this.props.clearMessages();
      } else {
        this.setState({ messageTest: [] });
      }
    }
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
    this.props.clearErrors();
    this.props.clearMessages();
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    //Update the thing
    e.preventDefault();

    const { title, text, owner, username } = this.state;
    //get attributes
    const updatedPost = {
      title,
      text,
      owner,
      username
    };
    //console.log(this.props.id);
    this.props.updateItem(updatedPost, this.props.id);
    this.props.clearErrors();
  };

  render() {
    const errors = [];
    const { message } = this.props.item;
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
        <Button className="btn-edit" onClick={this.toggle} href="">
          Edit
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Edit post</ModalHeader>
          {message ? (
            <Alert dismissible="true" color="success">
              {message}
            </Alert>
          ) : (
            <Alert color="" />
          )}
          {alerts}
          <Form onSubmit={this.onSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  type="title"
                  name="title"
                  id="title"
                  className="mb-4"
                  value={this.state.title || ""}
                  onChange={this.onChange}
                ></Input>

                <Label for="name">Content</Label>
                <Input
                  type="text"
                  name="text"
                  id="text"
                  className="mb-4"
                  value={this.state.text || ""}
                  onChange={this.onChange}
                ></Input>
                <Button className="btn btn-primary">Update</Button>
              </FormGroup>
            </ModalBody>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  item: state.item,
  items: state.items,
  error: state.error
});
//connect to store -> data to mapstatetoprops
//actions we want to use as second paranthesis
export default connect(mapStateToProps, {
  updateItem,
  clearErrors,
  clearMessages
})(EditModal);
