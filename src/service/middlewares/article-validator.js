'use strict';

const {HTTP_CODE} = require(`../../constants`);

const articleKeys = [`category`, `announce`, `fullText`, `title`, `createdDate`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HTTP_CODE.clientError)
      .send(`Bad request`);
  }

  return next();
};
