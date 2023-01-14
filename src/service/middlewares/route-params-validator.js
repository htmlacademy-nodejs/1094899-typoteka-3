'use strict';

const Joi = require(`joi`);
const {HTTP_CODE} = require(`../../constants`);

const schema = Joi.object({
  articleId: Joi.number().integer().min(1),
  commentId: Joi.number().integer().min(1)
});

module.exports = (req, res, next) => {
  const params = req.params;

  const {error} = schema.validate(params);

  if (error) {
    return res.status(HTTP_CODE.clientError)
      .send(error.details.map((err) => err.message).join(`\n`));
  }
  return next();
};
