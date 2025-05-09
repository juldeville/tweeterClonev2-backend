const Tag = require("../models/tags");
const Tweet = require("../models/tweets");

async function updateTweetLikes(tweetId, userId) {
  try {
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      console.log("no tweet found");
      return null;
    }
    const isLiked = tweet.likes.includes(userId);
    const update = isLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } };

    const result = await Tweet.updateOne({ _id: tweetId }, update);

    return { result, likeStatus: isLiked };
  } catch (err) {
    console.error("error is", err);
    throw err;
  }
}

module.exports = { updateTweetLikes };
