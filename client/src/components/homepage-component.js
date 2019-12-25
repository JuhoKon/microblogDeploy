import React, { Component } from "react";
import { Container, Jumbotron } from "reactstrap";
import peoplesvg from "../public/images/undraw_people_tax5.svg";
import sharesvg from "../public/images/undraw_share_opinion_jpw0.svg";
import updates from "../public/images/undraw_updates_et2k.svg";
import { Link } from "react-router-dom";

export default class Homepage extends Component {
  render() {
    return (
      <div className="app">
        <Jumbotron>
          <div className="container">
            <h1 className="display-3">Welcome to MicroBlog!</h1>
            <br />
            <p>
              This is a MERN stack application made for course work. With
              MicroBlog you can create your own posts and share them with other
              users. You can also view other users' posts and follow them!
            </p>
            <p>Some techniques used in the project:</p>
            <p>
              React frontend + Redux, ORM and models in backend, supporting
              picture storage with multer, using a redis cache on backend,
              responsive front-end through reactstrap, XHR for data transfer,
              providing data with a RESTful API, user authenthication through
              JWT and password storage.
            </p>
            <p>
              <Link
                className="btn btn-primary btn-lg"
                to="/posts"
                role="button"
              >
                Click Here To See Posts &raquo;
              </Link>
            </p>
          </div>
        </Jumbotron>
        <Container>
          <br />
          <div className="">
            <div className="col-lg-4">
              <img
                className="rounded-circle"
                src={sharesvg}
                alt="share-content"
                width="130"
                height="86"
              />
              <h2>Share your content</h2>
              <p>Share your content for everyone to see.</p>
            </div>
            <div className="col-lg-4">
              <img
                className="rounded-circle"
                src={peoplesvg}
                alt="connect-people"
                width="130"
                height="86"
              />
              <h2>Connect with people</h2>
              <p>Find interesting users and follow them!</p>
            </div>
            <div className="col-lg-4">
              <img
                className="rounded-circle"
                src={updates}
                alt="discover-new"
                width="250"
                height="86"
              />
              <h2>Discover new</h2>
              <p>Checkout what other people are posting.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}
