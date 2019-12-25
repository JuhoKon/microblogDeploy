const { body, validationResult } = require("express-validator");
const postValidationRules = () => {
  return [
    body("title", "Maximum length for a title is 50 characters.").isLength({
      max: 50
    }),
    body("text", "Maximum length for text is 256 characters.").isLength({
      max: 256
    })
  ];
};
const postvalidate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  console.log(extractedErrors);
  return res.status(422).json({
    erro: extractedErrors
  });
};

module.exports = {
  postValidationRules,
  postvalidate
};
