const Tag = require("../models/tags");
const Tweet = require("../models/tweets");
async function findOrCreateTag(tagProp) {
  let tagId = null;
  let tagDoc;

  try {
    const tagExists = await Tag.findOne({ tag: tagProp });
    console.log("tagExists is: ", tagExists);
    if (!tagExists) {
      const newDoc = new Tag({
        tag: tagProp,
      });
      const newTag = await newDoc.save();
      tagId = newTag._id;
      tagDoc = newTag;
    } else {
      tagId = tagExists._id;
      tagDoc = tagExists;
    }
    return { tagId, tagDoc };
  } catch (error) {
    console.error("error is: ", error);
    throw error;
  }
}

module.exports = { findOrCreateTag };
