const Tag = require("../models/tags");

async function getTags(req, res) {
  try {
    const tags = await Tag.find();

    res.json({ result: true, data: tags });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
}

module.exports = { getTags };
