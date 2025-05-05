const Tweet = require("../models/tweets");
const User = require("../models/users");
const Tag = require("../models/tags");
const findOrCreateTag = require("../modules/findOrCreateTag");

async function createTweet(req, res) {
  try {
    const { tag, content } = req.body;
    const user = req.user;

    const { tagDoc, tagId } = await findOrCreateTag(tag);

    const newDoc = new Tweet({
      user: user._id,
      content: content,
      tag: tagId,
    });

    const newTweet = await newDoc.save();
    await Tag.updateOne({ _id: tagDoc._id }, { $push: { tweets: newTweet._id } });

    res.json({ result: true, newTweet });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
}

async function getTweets(req, res) {
  try {
    const tweets = await Tweet.find().populate(["tag", "user"]);
    if (tweets.length === 0) {
      res.json({ result: false, error: "no tweets foudn" });
    }
    res.json({ result: true, tweets });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
}

async function updateLike(req, res) {
  try {
    const { tweetId } = req.body;
    const user = req.user;

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) return res.status(404).json({ result: false, error: "Tweet not found" });
    const isLiked = tweet.likes.includes(user._id);
    const update = isLiked ? { $pull: { likes: user._id } } : { $push: { likes: user._id } };
    const result = await Tweet.updateOne({ _id: tweetId }, update);

    if (result.modifiedCount === 1) {
      res.json({ result: true, liked: !isLiked });
    } else {
      res.json({ result: false, error: "Tweet not updated" });
    }
  } catch (error) {
    console.error("updateLike error:", error);
    res.status(500).json({ result: false, error: error.message });
  }
}

module.exports = { createTweet, getTweets, updateLike };
