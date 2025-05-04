var express = require("express");
var router = express.Router();
const { checkBody } = require("../middlewares/checkBody");
const { checkUser } = require("../middlewares/checkUser");
const { createUser, authenticateUser } = require("../controllers/userController");

router.post("/signup", checkBody(["username", "password", "firstname"]), checkUser({ exists: false }), createUser);
router.post("/signin", checkBody(["username", "password"]), checkUser({ exists: true }), authenticateUser);

module.exports = router;
