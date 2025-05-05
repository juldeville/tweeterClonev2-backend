const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const User = require("../models/users");

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
    res.status(500).json({ result: false, error: err.message });
  }
}

async function authenticateUser(req, res) {
  try {
    const { password } = req.body;
    const userData = req.user;
    if (bcrypt.compareSync(password, userData.password)) {
      res.json({
        result: true,
        user: {
          username: userData.username,
          firstname: userData.firstname,
          token: userData.token,
        },
      });
    } else {
      res.json({ result: false, error: "Incorrect password" });
    }
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
}

module.exports = { createUser, authenticateUser };
