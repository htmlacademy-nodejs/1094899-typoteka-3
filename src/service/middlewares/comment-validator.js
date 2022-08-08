'use strict';

const {HTTP_CODE} = require(`../../constants`);

const commentKeys = [`text`];

module.exports = (req, res, next) => {
  const comment = req.body;
  const keys = Object.keys(comment);
  const keysExists = commentKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HTTP_CODE.clientError)
      .send(`Bad request`);
  }

  return next();
};
