var Post = require("../models/post.model");
var User = require("../models/user.model");
var redis = require("redis"); //Cache
require("dotenv").config();

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const client = redis.createClient(REDIS_PORT, REDIS_HOST);
client.on("error", err => {
  console.log("Error " + err);
});

const fs = require("fs"); //for deleting local files
// Display list of all posts.

exports.index = function(req, res, next) {
  client.get("Posts", function(err, reply) {
    if (reply) {
      try {
        const posts = JSON.parse(reply);
        res.json({ posts });
      } catch (ex) {
        console.error(ex);
      }
    } else {
      console.log("Fetching Data from Database...");
      Post.find()
        .then(posts => {
          client.setex("Posts", 1800, JSON.stringify(posts));

          res.json({ posts: posts });
        }) //return all posts
        .catch(err => res.status(400).json("Error: " + err));
    }
  });
};
// Handle create on POST.
exports.create = function(req, res, next) {
  //most of input validation done in middleware (postvalidator.js)
  if (!req.body.title || !req.body.text) {
    return res.status(400).json({ error: "Please enter all fields" });
  }

  if (typeof req.file === "undefined") {
    //no imagefile
    var post = new Post({
      title: req.body.title,
      username: req.body.username,
      text: req.body.text,
      owner: req.body.owner
    });
  } else {
    //image file is submitted
    var post = new Post({
      title: req.body.title,
      username: req.body.username,
      text: req.body.text,
      owner: req.body.owner,
      blogImage: req.file.path
    });
  }
  post
    .save() //attempt to save to the database
    .then(() => {
      client.del("Posts"); //Delete main cache
      client.del(req.body.username); //delete username's cache
      client.del(req.body.owner); //delete userID's cache
      res.json(post);
    })
    .catch(err => res.status(400).json("Error: " + err));
};
//handle search by ID GET request
exports.findByID = function(req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({ error: "Id is not submitted." });
  }
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(400).json("Error: " + err));
};

//handle update by ID put request
exports.updateByID = function(req, res, next) {
  if (!req.body.title || !req.body.text) {
    let errorArray = [{ title: "Please enter all fields" }]; //for rendering in client side
    return res.status(400).json({ erro: errorArray });
  }
  Post.findById(req.params.id).then(post => {
    //find post
    //delete posts from cache, so we can update the cache with new post
    client.del("Posts"); //delete main cache
    client.del(req.body.username); //delete username's cache
    client.del(req.body.owner); //delete userID's cache
    post.title = req.body.title;
    post.text = req.body.text;
    post
      .save() //attempt to save the post
      .then(() => res.json(post))
      .catch(err => res.status(400).json("Error: " + err));
  });
};
//handle delete by ID DELETE request
exports.deleteByID = function(req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({ error: "Id is not submitted." });
  }
  const id = req.params.id;
  Post.findById(id, function(err, results) {
    //checking if there are results
    if (typeof results !== "undefined" && results !== null) {
      if (typeof results.blogImage !== "undefined") {
        //if there's an image, try to delete it from the directory
        try {
          fs.unlinkSync(results.blogImage);
        } catch (err) {
          console.error(err);
        }
      }
      Post.findByIdAndDelete(id) //delete actual post from the database
        .then(() => {
          client.del("Posts");
          client.del(results.username); //delete username's cache
          client.del(results.owner); //delete userID's cache
          res.json("Post deleted.");
        })
        .catch(err => res.status(400).json("Error: " + err));
    } else {
      //no post found
      res.status(404).json("Error: No post found on the database.");
    }
  });
};
//handle post search by userID request
exports.postsByID = function(req, res, next) {
  if (!req.body.owner) {
    //owner is userID in this function
    return res.status(400).json({ error: "Id is not submitted." });
  }
  client.get(req.body.owner, function(err, reply) {
    if (reply) {
      try {
        const posts = JSON.parse(reply);
        res.json({ posts });
      } catch (ex) {
        console.error(ex);
      }
    } else {
      console.log("Fetching Data from Database...");
      Post.find({ owner: req.body.owner })
        .then(posts => {
          client.setex(req.body.owner, 1800, JSON.stringify(posts));

          res.json({ posts: posts });
        }) //return all posts
        .catch(err => res.status(400).json("Error: " + err));
    }
  });
};
//handle post searching by username
exports.postsByUsername = function(req, res, next) {
  //owner is username in this function
  if (!req.body.owner) {
    return res.status(400).json({ error: "Username is not submitted." });
  }
  client.get(req.body.owner, function(err, reply) {
    if (reply) {
      try {
        const posts = JSON.parse(reply);

        res.json({ posts });
      } catch (ex) {
        console.error(ex);
      }
    } else {
      console.log("Fetching Data from Database...");
      Post.find({ username: req.body.owner })
        .then(posts => {
          client.setex(req.body.owner, 1800, JSON.stringify(posts));

          res.json({ posts: posts });
        }) //return all posts
        .catch(err => res.status(400).json("Error: " + err));
    }
  });
};

exports.FollowedPosts = function(req, res, next) {
  console.log(req.body);
  Post.find({
    owner: { $in: req.body }
  })
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json("Error : " + err));
};
