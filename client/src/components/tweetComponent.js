import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";
import isEqual from "react-fast-compare";
import Moment from "react-moment";
import EditModal from "./editItem-Modal";
import { connect } from "react-redux";
import { deleteItem } from "../actions/post.actions";
import PropTypes from "prop-types";

class tweetComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      text: props.text,
      username: props.username,
      blogImage: props.blogImage,
      updatedAt: props.updatedAt,
      createdAt: props.createdAt,
      owner: props.owner,
      userId: props.userId,
      postId: props.postId
    };
  }
  static propTypes = {
    deleteItem: PropTypes.func.isRequired
  };
  componentDidUpdate(prevProps) {
    if (!isEqual(this.props, prevProps)) {
      //if change in props
      this.setState({
        title: this.props.title,
        text: this.props.text,
        username: this.props.username,
        blogImage: this.props.blogImage,
        updatedAt: this.props.updatedAt,
        userId: this.props.userId,
        createdAt: this.props.createdAt
      });
    }
  }
  onDeleteClick = id => {
    this.props.deleteItem(id);
  };
  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <span style={{ flexDirection: "column" }}>
              {this.state.owner && this.state.owner === this.state.userId ? ( //Can only delete your own posts
                <Button
                  className="btn-edit"
                  onClick={this.onDeleteClick.bind(this, this.state.postId)}
                >
                  Delete
                </Button>
              ) : null}
            </span>
            <span>
              {this.state.owner && this.state.owner === this.state.userId ? ( //Can only edit your own posts
                <EditModal
                  id={this.state.postId}
                  title={this.state.title}
                  text={this.state.text}
                  owner={this.state.userId}
                  username={this.state.username}
                />
              ) : null}
            </span>
            <CardTitle>{this.state.title}</CardTitle>
            <CardText>
              <Link className="text-muted" to={`/user${this.state.username}`}>
                Posted by: {this.state.username}
              </Link>
            </CardText>
            <CardText>{this.state.text}</CardText>
            <CardText>
              <small className="text-muted">
                Last updated: <Moment fromNow>{this.state.updatedAt}</Moment>
              </small>
            </CardText>
            <CardText>
              <small className="text-muted">
                Created at: <Moment>{this.state.createdAt}</Moment>
              </small>
            </CardText>
          </CardBody>
          {this.state.blogImage ? (
            <CardImg
              bottom
              width="100%"
              src={this.state.blogImage}
              alt={this.state.blogImage}
            />
          ) : null}
        </Card>
        <br />
      </div>
    );
  }
}
//actions we want to use as second paranthesis
export default connect(null, {
  deleteItem
})(tweetComponent);
