const User = require("../models/users");

async function getUserId(token) {
  const user = await User.findOne({ token: token });
  if (!user) throw new Error("User does not exist");
  return user._id;
}

module.exports = { getUserId };
