'use strict';

const {DATE_PATTERN} = require(`../../constants`);
const {parseDate} = require(`../../utils/date`);
const {ensureArray} = require(`../../utils/common`);

const commentConverter = (comment) =>
  (Object.assign({
    createdDateHuman: parseDate(comment.createdDate, DATE_PATTERN.humanReadable),
    createdDateRobot: parseDate(comment.createdDate, DATE_PATTERN.robotReadable)
  }, comment));

module.exports.convertViewArticle = (article) => {
  const viewArticle = Object.assign({
    createdDateHuman: parseDate(article.createdDate, DATE_PATTERN.humanReadable),
    createdDateRobot: parseDate(article.createdDate, DATE_PATTERN.robotReadable),
    createdDateReverse: parseDate(article.createdDate, DATE_PATTERN.dateReverse),
    comments: article.comments.map(commentConverter)
  }, article);

  if (article.image) {
    viewArticle.image = `img/${article.image}`;
  }

  return viewArticle;
};

module.exports.convertViewArticles = (articles) => articles.map(exports.convertViewArticle);

module.exports.parseViewArticle = (body, file) => {
  const articleData = {
    image: file ? file.filename : ``,
    createdDate: parseDate(body.date, DATE_PATTERN.default, DATE_PATTERN.dateReverse),
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    category: ensureArray(body.category),
  };

  return articleData;
};
