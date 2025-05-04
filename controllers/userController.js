const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const token = require("uid2");

async function createUser(req, res) {
  try {
    const { username, firstname } = req.body;
    const password = bcrypt.hashSync(req.body.password, 10);
    const newDoc = new User({
      username,
      firstname,
      password,
      token: uid2(32),
    });
    const newUser = await newDoc.save();

    res.json({
      result: true,
      user: {
        username: newUser.username,
        firstname: newUser.firstname,
        token: newUser.token,
      },
    });
  } catch (err) {
    res.status(400).json({ result: false, error: err.message });
  }
}

async function authenticateUser(req, res) {
  try {
    const { password } = req.body;
    const user = req.user;
    if (bcrypt.compareSync(password, user.password)) {
      res.json({ result: true, token: user.token });
    } else {
      res.json({ result: false, error: "Incorrect password" });
    }
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
}

module.exports = { createUser, authenticateUser };
