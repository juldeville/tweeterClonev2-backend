const { checkBody } = require("../middlewares/checkBody");
const { createTweet, getTweets, updateLike } = require("../controllers/tweetController");
var express = require("express");
const { authenticateByToken } = require("../middlewares/authenticateByToken");
var router = express.Router();

router.post("/newTweet", checkBody(["content", "token"]), authenticateByToken(), createTweet);
router.get("/getTweets/:token", getTweets);
router.put("/updateLike", checkBody(["tweetId", "token"]), authenticateByToken(), updateLike);

// router.delete("/deleteTweet");

module.exports = router;
