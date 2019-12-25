var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var postSchema = new Schema(
  {
    username: { type: String, required: true },
    text: { type: String, required: true, maxlength: 256 },
    title: { type: String, required: true, maxlength: 50 },
    owner: { type: String, required: true },
    blogImage: { type: String }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Post", postSchema);
