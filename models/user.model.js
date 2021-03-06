var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    age: {
      type: String,
      required: true
    },
    followed: {
      type: Array
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
