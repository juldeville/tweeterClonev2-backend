const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  date: { type: Date, default: Date.now },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  tag: { type: mongoose.Schema.Types.ObjectId, ref: "tags" },
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
