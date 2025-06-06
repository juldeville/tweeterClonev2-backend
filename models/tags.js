const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  tag: { type: String, required: true },
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tweets" }],
});

const Tag = mongoose.model("tags", tagSchema);

module.exports = Tag;
