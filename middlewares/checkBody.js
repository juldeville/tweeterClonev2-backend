function checkBody(requiredFields) {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(
      (field) => !req.body[field] || req.body[field].trim() === ""
    );

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ result: false, error: `missing these fields: ${missingFields} ` });
    }
    next();
  };
}

module.exports = { checkBody };
