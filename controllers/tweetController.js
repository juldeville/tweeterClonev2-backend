const Tweet = require("../models/tweets");
const User = require("../models/users");
const Tag = require("../models/tags");
const { findOrCreateTag } = require("../db/findOrCreateTag");
const { updateTweetLikes } = require("../db/updateTweetLikes");
const { updateLikeStatus } = require("../db/updateLikeStatus");
const { getUserId } = require("../db/getUserId");
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
    const formattedTweet = await newTweet.populate("tag");
    res.json({ result: true, formattedTweet });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
}

async function getTweets(req, res) {
  try {
    const { tagId } = req.query;
    const filter = tagId ? { tag: tagId } : {};
    const tweets = await Tweet.find(filter).populate(["tag", "user"]);
    const tagDoc = tagId ? await Tag.findById(tagId) : null;

    if (tweets.length === 0) {
      return res.json({ result: true, message: "no tweets found" });
    }

    const userId = await getUserId(req.params.token);

    const formattedTweets = updateLikeStatus(tweets, userId);
    res.json({ result: true, formattedTweets, tagName: tagDoc?.tag || null });
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

async function deleteTweet(req, res) {
  try {
    const tweet = await Tweet.findOne({ _id: req.body.tweetId });
    const tagDoc = tweet.tag.toString();

    await Tag.updateOne({ _id: tagDoc }, { $pull: { tweets: tweet._id } });
    const updatedTag = await Tag.findOne({ _id: tagDoc });
    if (updatedTag.tweets.length === 0) {
      await Tag.deleteOne({ _id: tagDoc });
    }

    const deleted = await Tweet.deleteOne({ _id: req.body.tweetId });

    if (deleted.deletedCount === 0) {
      throw new Error("Delete failed or tweet not found");
    }
    res.json({ result: true });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
}

module.exports = { createTweet, getTweets, updateLike, deleteTweet };
