var express = require("express");
var router = express.Router();
var auth = require("../middleware/auth");
var multer = require("multer");

var {
  postValidationRules,
  postvalidate
} = require("../middleware/postvalidator.js");
var { storage, fileFilter } = require("../middleware/multer");
var upload = multer({
  storage: storage, //server storage
  limits: {
    fileSize: 1024 * 1024 * 10 //Only accept 10MB files
    //fileSize: 1
  },
  fileFilter: fileFilter //use filefilter
});

// Require controllers
var post_controller = require("../controllers/postController");

/**
 * @api{get} /posts Request Posts
 * @apiName GetPosts
 * @apiGroup posts
 * @apiSuccessExample Example data on success:
 *  {
 *   "posts": [
 *     {
 *     "_id": "5dd8478b55b9a60104361157",
 *     "title": "My first post",
 *     "username": "John123",
 *     "text": "Hello World",
 *     "owner": "5dd8455740f12f13ecbb48bf",
 *     "createdAt": "2019-11-22T20:39:39.580Z",
 *     "updatedAt": "2019-11-22T20:39:39.580Z",
 *     "__v": 0
 *    },
 *    {
 *     "_id": "5dd8478b55b9a60104361157",
 *     "title": "My first post with an image",
 *     "username": "John123",
 *     "text": "Hello World!",
 *     "owner": "5dd8455740f12f13ecbb48bf",
 *     "blogImage": "uploads\\1574457248168dog.png",
 *     "createdAt": "2019-11-23T20:39:39.580Z",
 *     "updatedAt": "2019-11-23T20:39:39.580Z",
 *     "__v": 0
 *    }
 *   ]
 * }
 *
 *
 */
router.get("/", post_controller.index);

/**
 * @api{post} /posts/create Request Create New Post
 * @apiName CreatePost
 * @apiGroup posts
 * @apiParam (Auth) {String} pass Only logged in (authorized) users can create posts.
 * @apiParam {String} title Title of the post (max 50 characters)
 * @apiParam {String} text Content of the post (max 256characters)
 * @apiParam {file:jpeg/png} [blogImage] An image file (max size 10 MB)
 * @apiParam {String} username Name of the user
 * @apiParam {String} owner ID of the user
 * @apiParamExample {json} Request-Example:
 *     {
 *       "title": "My first post",
 *       "text" : "Hello World";
 *       "username" : "John123",
 *       "owner" : "5dd8455740f12f13ecbb48bf"
 *     }
 * @apiSuccessExample Example data on success:
 *  {
 *    "_id": "5dd8478b55b9a60104361157",
 *    "title": "My first post",
 *    "username": "John123",
 *    "text": "Hello World",
 *    "owner": "5dd8455740f12f13ecbb48bf",
 *    "createdAt": "2019-11-22T20:39:39.580Z",
 *    "updatedAt": "2019-11-22T20:39:39.580Z",
 *    "__v": 0
 *  }
 *
 *@apiErrorExample {json} Missing fields:
 *     400 Bad request
 *{
 *  "error": "Please enter all fields"
 *}
 *
 *@apiErrorExample {json} Token isn't valid:
 *     400 Bad request
 *{
 *  "msg": "Token is not valid"
 *}
 *
 *@apiErrorExample {json} No token:
 *     401 Unauthorized
 *{
 *  "msg": "No token, authorization denied."
 *}
 *@apiErrorExample {json} Exceeding limits:
 *    422Unprocessable Entity
 *{
 *   "erro": [
 *      {
 *           "title": "Maximum length for a title is 50 characters."
 *       },
 *       {
 *           "text": "Maximum length for text is 256 characters."
 *       }
 *   ]
 * }
 */
router.post(
  "/create",
  auth,
  upload.single("image"),
  postValidationRules(),
  postvalidate,
  post_controller.create
);

/**
 * @api{get} /posts/find/:id Search Posts by postID
 * @apiName GetPostsByID
 * @apiGroup posts
 * @apiParam {string} ID ID of the post
 * @apiParamExample Request example:
 *  http://localhost:8080/posts/find/5dd8478b55b9a60104361157
 * @apiSuccessExample Example data on success:
 * {
 *  posts: [
 *     {
 *     "_id": "5dd8478b55b9a60104361157",
 *     "title": "My first post with an image",
 *     "username": "John123",
 *     "text": "Hello World!",
 *     "owner": "5dd8455740f12f13ecbb48bf",
 *     "blogImage": "uploads\\1574457248168dog.png",
 *     "createdAt": "2019-11-23T20:39:39.580Z",
 *     "updatedAt": "2019-11-23T20:39:39.580Z",
 *     "__v": 0
 *   }
 *  ]
 * }
 */

router.get("/find/:id", post_controller.findByID);

/**
 * @api{put} /posts/update/:id Update Posts by postID
 * @apiName UpdatePostsByID
 * @apiGroup posts
 * @apiParam (Auth) {String} pass Only logged in users can edit posts.
 * @apiParam {string} title Title of the post (max 50 characters)
 * @apiParam {string} text Text of the post (max 256 characters)
 * @apiSuccessExample Example data on success:
 *
 *  {
 *    posts: [
 *     {
 *     "_id": "5dd8478b55b9a60104361157",
 *     "title": "My first edited post",
 *     "username": "John123",
 *     "text": "Hello World",
 *     "owner": "5dd8455740f12f13ecbb48bf",
 *     "createdAt": "2019-11-22T20:39:39.580Z",
 *     "updatedAt": "2019-11-22T20:45:39.580Z",
 *     "__v": 0
 *     }
 *    ]
 *  }
 *
 * @apiErrorExample {json} Token isn't valid:
 *     400 Bad request
 *{
 *  "msg": "Token is not valid"
 *}
 *
 * @apiErrorExample {json} No token:
 *     401 Unauthorized
 *{
 *  "msg": "No token, authorization denied."
 *}
 * @apiErrorExample {json} Missing fields:
 *     400 Bad Request
 *{
 *  "error": "Please enter all fields."
 *}
 * @apiErrorExample {json} Exceeding limits:
 *    422Unprocessable Entity
 *{
 *   "erro": [
 *      {
 *           "title": "Maximum length for a title is 50 characters."
 *       },
 *       {
 *           "text": "Maximum length for text is 256 characters."
 *       }
 *   ]
 * }
 */
router.put(
  "/update/:id",
  auth,
  postValidationRules(),
  postvalidate,
  post_controller.updateByID
);

/**
 * @api{delete} /posts/:id Delete Posts by postID
 * @apiName DeletePostsByID
 * @apiGroup posts
 * @apiParam (Auth) {String} pass Only logged in users can delete posts.
 * @apiParam {string} ID ID of the post
 * @apiParamExample Request example:
 *  http://localhost:8080/posts/5dd84ec55aecf2093c5a7452
 * @apiSuccessExample Example data on success:
 * "Post deleted"
 * @apiErrorExample {json} No auth:
 *     401 Unauthorized
 * {
 *    "msg" : "No token, authorization denied"
 * }
 * @apiErrorExample {json} Post not found:
 *     404 Not found
 *
 * "Error: No post found on the database"
 *
 */
router.delete("/:id", auth, post_controller.deleteByID);

/**
 * @api{post} /posts/postsByID Posts by userID
 * @apiName GetpostsByID
 * @apiGroup posts
 * @apiParam {String} owner ID of the user
 * @apiParamExample {json} Request-Example:
 *     {
 *       "owner": "5dd8455740f12f13ecbb48bf"
 *     }
 * @apiSuccessExample Example data on success:
 * [
 *  {
 *    "_id": "5dd8478b55b9a60104361157",
 *    "title": "My first post",
 *    "username": "John123",
 *    "text": "Hello World",
 *    "owner": "5dd8455740f12f13ecbb48bf",
 *    "createdAt": "2019-11-22T20:39:39.580Z",
 *    "updatedAt": "2019-11-22T20:39:39.580Z",
 *    "__v": 0
 *  },
 *  {
 *    "_id": "5dd8478b55b9a60104361157",
 *    "title": "My first post with an image",
 *    "username": "John123",
 *    "text": "Hello World!",
 *    "owner": "5dd8455740f12f13ecbb48bf",
 *    "blogImage": "uploads\\1574457248168dog.png",
 *    "createdAt": "2019-11-23T20:39:39.580Z",
 *    "updatedAt": "2019-11-23T20:39:39.580Z",
 *    "__v": 0
 *  }
 * ]
 *@apiErrorExample {json} Missing fields:
 *     400 Bad request
 *{
 *  "error": "Id is not submitted"
 *}
 *
 */
router.post("/postsByID", post_controller.postsByID);

/**
 * @api{post} /posts/postsByUsername Posts by username
 * @apiName GetpostsByUsername
 * @apiGroup posts
 * @apiParam {String} owner Username of the user
 * @apiParamExample {json} Request-Example:
 *     {
 *       "owner": "John123"
 *     }
 * @apiSuccessExample Example data on success:
 * [
 *  {
 *    "_id": "5dd8478b55b9a60104361157",
 *    "title": "My first post",
 *    "username": "John123",
 *    "text": "Hello World",
 *    "owner": "5dd8455740f12f13ecbb48bf",
 *    "createdAt": "2019-11-22T20:39:39.580Z",
 *    "updatedAt": "2019-11-22T20:39:39.580Z",
 *    "__v": 0
 *  },
 *  {
 *    "_id": "5dd8478b55b9a60104361157",
 *    "title": "My first post with an image",
 *    "username": "John123",
 *    "text": "Hello World!",
 *    "owner": "5dd8455740f12f13ecbb48bf",
 *    "blogImage": "uploads\\1574457248168dog.png",
 *    "createdAt": "2019-11-23T20:39:39.580Z",
 *    "updatedAt": "2019-11-23T20:39:39.580Z",
 *    "__v": 0
 *  }
 * ]
 *@apiErrorExample {json} Missing fields:
 *     400 Bad request
 *{
 *  "error": "Username is not submitted"
 *}
 *
 */
router.post("/postsByUsername", post_controller.postsByUsername);

router.post("/followedPosts", post_controller.FollowedPosts);
module.exports = router;
