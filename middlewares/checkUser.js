const User = require("../models/users");

function checkUser({ exists = true }) {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (exists && !user) {
        return res.status(404).json({ result: false, error: "User doesn't exist" });
      } else if (!exists && user) {
        return res.status(409).json({ result: false, error: "User already exists" });
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(500).json({ result: false, error: err.message });
    }
  };
}

module.exports = { checkUser };
