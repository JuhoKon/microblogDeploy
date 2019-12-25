import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import store from "../store";
import { loadUser } from "../actions/auth.actions";
import TweetComponent from "./tweetComponent";
import { getItemsByUserID, deleteItem } from "../actions/post.actions";
import { Container, Jumbotron } from "reactstrap";

class UserInfo extends Component {
  state = {
    rendered: false
  };
  static propTypes = {
    getItemsByUserID: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired
  };
  componentDidMount() {
    store.dispatch(loadUser()); //load user
    //Hacky way to get the new props, if not done this way, only old props will load, and on refresh the new ones
    //will load
    //have to call it this way as user from props isn't defined when the component mounts first time
    const { user } = this.props.auth;
    this.interval = setInterval(() => {
      if (user) {
        if (!this.state.rendered) {
          this.props.getItemsByUserID(user._id, "ID");
          this.toggle();
        }
      }
    }, 1);
  }
  componentDidUpdate() {
    //Hacky way to get the new props, if not done this way, only old props will load, and on refresh the new ones
    //will load
    const { user } = this.props.auth;
    if (!this.state.rendered) {
      if (user) {
        this.props.getItemsByUserID(user._id, "ID");
        this.toggle();
      }
    }
  }
  toggle = () => {
    //part of the hack
    this.setState({
      rendered: !this.state.rendered
    });
    clearInterval(this.interval);
  };

  render() {
    const { isAuth, user } = this.props.auth;
    const { items } = this.props.items;

    const guestContent = (
      <Fragment>Please login to view profile information.</Fragment>
    );
    const authContent = (
      <Jumbotron>
        <span>{user ? `Signed in as: ${user.name}!` : ""}</span>
        <br />
        <span>{user ? `Your email is: ${user.email}` : ""}</span>
        <br />
        <span>{user ? `Date of birth is marked as: ${user.age}` : ""}</span>
      </Jumbotron>
    );
    const authPosts = (
      <div>
        <h3>Your posts:</h3>
        <br />
        {items.map(
          ({
            _id,
            title,
            text,
            username,
            owner,
            blogImage,
            updatedAt,
            createdAt
          }) => (
            <Container
              key={_id}
              //check if user exists, display users posts
              className={user && owner === user._id ? "tweet-body" : null}
            >
              {user && owner === user._id ? (
                <TweetComponent
                  title={user && owner === user._id ? title : null}
                  text={user && owner === user._id ? text : null}
                  username={user && owner === user._id ? username : null}
                  blogImage={user && owner === user._id ? blogImage : null}
                  updatedAt={user && owner === user._id ? updatedAt : null}
                  userId={user && owner === user._id ? user._id : null}
                  owner={user && owner === user._id ? owner : null}
                  postId={user && owner === user._id ? _id : null}
                  createdAt={user && owner === user._id ? createdAt : null}
                />
              ) : null}
            </Container>
          )
        )}
      </div>
    );
    //actual rendering, checks for auth
    return (
      <div className="container">
        <span>{isAuth ? authContent : guestContent} </span>
        <span>{isAuth ? authPosts : null} </span>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  items: state.item,
  auth: state.auth
});
//actions we want to use as second paranthesis
export default connect(mapStateToProps, {
  getItemsByUserID,
  deleteItem
})(UserInfo);
