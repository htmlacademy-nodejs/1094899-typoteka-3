'use strict';

const Joi = require(`joi`);
const {HTTP_CODE, ErrorCommentMessage} = require(`../../constants`);

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': ErrorCommentMessage.TEXT
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorCommentMessage.USER_ID
  })
});

module.exports = (req, res, next) => {
  const comment = req.body;
  const {error} = schema.validate(comment, {abortEarly: false});

  if (error) {
    return res.status(HTTP_CODE.clientError)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
