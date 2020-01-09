import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Container, Jumbotron, Button } from "reactstrap";
import PropTypes from "prop-types";
import { getItemsByUsername } from "../actions/post.actions";
import { getUser, follow, unfollow } from "../actions/auth.actions";
import isEqual from "react-fast-compare";
import TweetComponent from "./tweetComponent";
class OtherUserInfo extends Component {
  state = {
    followed: [],
    followId: ""
  };
  static propTypes = {
    getItemsByUsername: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.props.getItemsByUsername(this.props.match.params.id, "foo");
    this.props.getUser(this.props.match.params.id);
  }
  componentDidUpdate(prevProps) {
    const { user } = this.props.auth;
    const { item } = this.props.items;
    if (!isEqual(this.props, prevProps)) {
      //if change in props
      if (user && item) {
        if (user.followed && item[0]) {
          this.setState({
            followed: user.followed,
            followId: item[0]._id
          });
        }
      }
    }
  }
  follow() {
    const { user } = this.props.auth;
    const { item } = this.props.items;
    const followId = item[0]._id;
    const ownId = user._id;

    this.props.follow(ownId, followId);
  }
  unfollow() {
    const { user } = this.props.auth;
    const { item } = this.props.items;
    const followId = item[0]._id;
    const ownId = user._id;
    this.props.unfollow(ownId, followId);
  }
  render() {
    const { isAuth } = this.props.auth;
    const { items } = this.props.items;

    const guestContent = (
      <Fragment>Please login to view profile information.</Fragment>
    );
    const authContent = (
      <Jumbotron>
        Welcome to {this.props.match.params.id}'s page!
        <br />
      </Jumbotron>
    );
    const authPosts = (
      <div>
        <h3>Posts by the author: {this.props.match.params.id}</h3>

        {this.state.followed.includes(this.state.followId) ? (
          <Button className="btn-edit" onClick={e => this.unfollow()}>
            Unfollow
          </Button>
        ) : (
          <Button className="btn-edit" onClick={e => this.follow()}>
            Follow
          </Button>
        )}

        <br />
        <br />
        <br />
        <br />
        {items.map(
          ({ _id, title, text, username, blogImage, updatedAt, createdAt }) => (
            <Container key={_id} className="tweet-body">
              <TweetComponent
                title={title}
                text={text}
                username={username}
                blogImage={blogImage}
                updatedAt={updatedAt}
                createdAt={createdAt}
              />
            </Container>
          )
        )}
      </div>
    );

    return (
      <div className="container">
        <span>{isAuth ? authContent : guestContent} </span>
        <span>{isAuth && items.length > 0 ? authPosts : null} </span>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  items: state.item,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getItemsByUsername,
  follow,
  getUser,
  unfollow
})(OtherUserInfo);
