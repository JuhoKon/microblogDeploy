import React, { Component, Fragment, useReducer } from "react";
import { Jumbotron } from "reactstrap";
import { connect } from "react-redux";
import { getFollowed } from "../actions/post.actions";
import TweetComponent from "./tweetComponent";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

import isEqual from "react-fast-compare";

class FollowedPosts extends Component {
  static propTypes = {
    getFollowed: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };
  state = {
    followed: []
  };
  componentDidMount() {
    this.props.getFollowed(this.state.followed);
    this.interval = setInterval(() => {
      this.props.getFollowed(this.state.followed);
    }, 30000); //get items every 30 seconds (ms)
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props.auth;

    if (!isEqual(this.props, prevProps)) {
      //if change in props
      if (user) {
        if (user.followed && !isEqual(user.followed, this.state.followed)) {
          this.props.getFollowed(user.followed);
          this.setState({
            followed: user.followed
          });
        }
      }
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { items } = this.props.item;
    const { user } = this.props.auth;
    return (
      <div className="container-fluid">
        <Jumbotron>
          <div className="container">
            <h1 className="display-3">
              <p>Followed posts</p>
            </h1>
            <br />
            <p>If you see no posts then you have not followed anyone yet!</p>
          </div>
        </Jumbotron>
        {user ? (
          <div className="container">
            {items.map(
              ({
                _id,
                title,
                text,
                username,
                blogImage,
                updatedAt,
                createdAt
              }) => (
                <CSSTransition key={_id} timeout={500} classNames="fade">
                  <TweetComponent
                    title={title}
                    text={text}
                    username={username}
                    blogImage={blogImage}
                    updatedAt={updatedAt}
                    createdAt={createdAt}
                    userId={null}
                    postId={null}
                  />
                </CSSTransition>
              )
            )}
          </div>
        ) : (
          "Items are loading..."
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  item: state.item,
  auth: state.auth
});
//actions we want to use as second paranthesis
export default connect(mapStateToProps, { getFollowed })(FollowedPosts);
