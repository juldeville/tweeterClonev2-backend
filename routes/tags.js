var express = require("express");
var router = express.Router();
const { getTags } = require("../controllers/tagController");

router.get("/mostPopular", getTags);

module.exports = router;
