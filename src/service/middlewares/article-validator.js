'use strict';

const {HTTP_CODE, VALID_ARTICLE_KEYS} = require(`../../constants`);

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = keys.every((key) => VALID_ARTICLE_KEYS.includes(key));

  if (!keysExists) {
    return res.status(HTTP_CODE.clientError)
      .send(`Bad request: incorrect article keys`);
  }

  return next();
};
