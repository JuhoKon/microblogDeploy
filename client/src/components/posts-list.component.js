import React, { Component, Fragment } from "react";
import { Jumbotron } from "reactstrap";
import { connect } from "react-redux";
import { getItems } from "../actions/post.actions";
import TweetComponent from "./tweetComponent";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
import CreatePost from "../components/create-post.component";

class PostList extends Component {
  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getItems();
    this.interval = setInterval(() => {
      this.props.getItems();
    }, 30000); //get items every 30 seconds (ms)
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { items } = this.props.item;
    const { isAuth } = this.props.auth;
    const { user } = this.props.auth;
    const authLinks = (
      <Fragment>
        <CreatePost />
        <br />
      </Fragment>
    );
    return (
      <div className="container-fluid">
        <Jumbotron>
          <div className="container">
            <h3>{user ? `Welcome back ${user.name}!` : ""}</h3>
            <br />
            <p>
              {user
                ? "Here you can create posts with a character limit of 256 for content and 50 for title."
                : "Hey! You have to login in order to create posts. No worries, creating an account will only take 30 seconds!"}
            </p>
            <p>
              {user
                ? "For files only jpeg/png formats are supported up to 10MB/picture"
                : null}
            </p>
          </div>
        </Jumbotron>

        <div className="container">
          <span>{isAuth ? authLinks : null} </span>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  item: state.item,
  auth: state.auth
});
//actions we want to use as second paranthesis
export default connect(mapStateToProps, { getItems })(PostList);
