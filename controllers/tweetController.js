const Tweet = require("../models/tweets");
const User = require("../models/users");
const Tag = require("../models/tags");
const { findOrCreateTag } = require("../modules/findOrCreateTag");
const { updateTweetLikes } = require("../modules/updateTweetLikes");
const { updateLikeStatus } = require("../modules/updateLikeStatus");
const { getUserId } = require("../modules/getUserId");
async function createTweet(req, res) {
  try {
    const { tag, content } = req.body;
    const user = req.user;

    if (!tag) {
      const newDoc = new Tweet({
        user: user._id,
        content,
      });
      const newTweet = await newDoc.save();
      return res.json({ result: true, newTweet });
    }

    const { tagDoc, tagId } = await findOrCreateTag(tag);

    const newDoc = new Tweet({
      user: user._id,
      content,
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
      return res.json({ result: true, error: "no tweets found" });
    }

    const userId = await getUserId(req.params.token);

    const formattedTweets = updateLikeStatus(tweets, userId);
    res.json({ result: true, formattedTweets });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
}

async function updateLike(req, res) {
  try {
    const { tweetId } = req.body;
    const user = req.user;

    const update = await updateTweetLikes(tweetId, user._id);

    if (update.result.modifiedCount === 1) {
      res.json({ result: true, isLiked: update.likeStatus });
    } else {
      res.json({ result: false, error: "Tweet not updated" });
    }
  } catch (error) {
    console.error("updateLike error:", error);
    res.status(500).json({ result: false, error: error.message });
  }
}

module.exports = { createTweet, getTweets, updateLike };
