const User = require("../models/users");

function authenticateByToken() {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ token: req.body.token });
      if (!user) {
        return res.status(404).json({ result: false, error: "User doesn't exist" });
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(500).json({ result: false, error: err.message });
    }
  };
}

module.exports = { authenticateByToken };
