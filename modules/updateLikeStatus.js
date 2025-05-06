function updateLikeStatus(tweetData, id) {
  const formattedTweets = tweetData.map((tweet) => {
    return { ...tweet.toObject(), isLiked: tweet.likes.includes(id) };
  });
  return formattedTweets;
}

module.exports = { updateLikeStatus };
