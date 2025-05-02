const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  date: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tags" }],
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
