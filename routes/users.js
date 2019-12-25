var express = require("express");
var router = express.Router();
var userController = require("../controllers/userController");
var {
  userValidationRules,
  uservalidate
} = require("../middleware/uservalidator.js");

var auth = require("../middleware/auth");
/**
 * @api{get} /users Get Users
 * @apiName getUsers
 * @apiGroup users
 *
 *
 * @apiSuccessExample Example data on success:
 * {
 *  "_id": '65b5de958c50c45'
 *  "name": 'Juho'
 * },
 * {
 *  "_id": '32bhge01dd80f7d'
 *  "name": 'Antti'
 * }
 */
router.get("/", userController.index);

/**
 * @api{post} /users/create Creating a New User
 * @apiName createUser
 * @apiGroup users
 *
 * @apiParam {String} name Name of the user (min 3 characters)
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user (min 8 characters)
 * @apiParam {String} date Date of birth
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "John",
 *       "email" : "exampleemail@gmail.com";
 *       "password" : "ad45ee79566",
 *       "age" : "1997-11-07"
 *     }
 * @apiSuccessExample Example data on success:
 *{
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZDg0Y2IzMGZhZjRjMThkYzJlYjU0ZSIsImlhdCI6MTU3NDQ1NjUwMCwiZXhwIjoxNTc0NDYwMTAwfQ.sFVZWOgykCbUQYix3Zzvgu8flHj75ZBxVYu9PILi59s",
 *    "user": {
 *            "_id": "5dd84cb30faf4c18dc2eb54e",
 *            "name": "John123",
 *            "email": "Johnmail@gmail.com",
 *            "age": "1997-11-07"
 *     }
 *}
 * @apiErrorExample {json} Error-Response:
 *     422 Unprocessable Entity
 *{
 *    "erro": [
 *       {
 *           "name": "Name has to be longer than 3 characters."
 *       },
 *       {
            "name": "Name can't have whitespaces in it."
         },
 *       {
 *           "email": "Invalid email address."
 *       },
 *       {
 *           "password": "Password needs to be 8 characters long."
 *       }
 *     ]
 *}
 *
 */
router.post(
  "/create",
  userValidationRules(),
  uservalidate,
  userController.create
);

//TODO handle delete and update

router.put("/update", auth, userController.follow);

router.get("/getUserInfo", auth, userController.getUserInfo);
router.delete("/unfollow", auth, userController.unfollow);
module.exports = router;
