var express = require("express");
var router = express.Router();

router.post("/newTweet");
router.post("/deleteTweet");
router.put("updateLike");

module.exports = router;
