var express = require("express");
var router = express.Router();
const { checkBody } = require("../middlewares/checkBody");
const { checkUserByUsername } = require("../middlewares/checkUserByUsername");
const { createUser, authenticateUser } = require("../controllers/userController");

router.post("/signup", checkBody(["username", "password", "firstname"]), checkUserByUsername({ exists: false }), createUser);
router.post("/signin", checkBody(["username", "password"]), checkUserByUsername({ exists: true }), authenticateUser);

module.exports = router;
