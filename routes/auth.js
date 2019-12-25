var express = require("express");
var router = express.Router();
var auth = require("../middleware/auth");
var authController = require("../controllers/authController");

/**
 * @api{post} /auth Credentials Check
 * @apiName authCredentialCheck
 * @apiGroup Auth
 * @apiParam {string} email Email of the user
 * @apiParam {string} password Password of the user
 * @apiSuccessExample Example data on success:
 *    200 OK
 *{
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZDg0Y2IzMGZhZjRjMThkYzJlYjU0ZSIsImlhdCI6MTU3NDQ1NjUwMCwiZXhwIjoxNTc0NDYwMTAwfQ.sFVZWOgykCbUQYix3Zzvgu8flHj75ZBxVYu9PILi59s",
 *    "user": {
 *            "_id": "5dd84cb30faf4c18dc2eb54e",
 *            "name": "John123",
 *            "email": "Johnmail@gmail.com",
 *            "age": "1997-11-07"
 *     }
 *}
 *
 * @apiErrorExample {json} Missing fields:
 *     400 Bad Request
 *{
 *  "error": "Please enter all fields."
 *}
 * @apiErrorExample {json} User doesn't exist:
 *     400 Bad Request
 *{
 *  "msg": "User doesn't exist."
 *}
 * @apiErrorExample {json} Wrong password:
 *     400 Bad Request
 *{
 *  "msg": "Invalid credentials."
 *}
 */
router.post("/", authController.auth);

/**
 * @api{get} /auth/user Request User Information By Token
 * @apiName authGetUserInformation
 * @apiGroup Auth
 * @apiParam {String} x-auth-token Users' JWT (JSON Web Token)
 * @apiSuccessExample Example data on success:
 *{
 *   "_id": "5dd8622cf01ecb128885f502",
 *   "name": "John123",
 *   "email": "Johmail@gmail.com",
 *   "age": "2019-11-07",
 *   "createdAt": "2019-11-22T22:33:16.496Z",
 *   "updatedAt": "2019-11-22T22:33:16.496Z",
 *   "__v": 0
 *}
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
 */
router.get("/user", auth, authController.findUser);
module.exports = router;
