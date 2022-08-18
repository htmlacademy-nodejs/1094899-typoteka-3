'use strict';

const {DATE_PATTERN} = require(`../../constants`);
const {parseDate} = require(`../../utils/date`);

const commentConverter = (comment) =>
  (Object.assign({
    createdDateHuman: parseDate(comment.createdDate, DATE_PATTERN.humanReadable),
    createdDateRobot: parseDate(comment.createdDate, DATE_PATTERN.robotReadable)
  }, comment));

const articleConverter = (article) =>
  (Object.assign({
    createdDateHuman: parseDate(article.createdDate, DATE_PATTERN.humanReadable),
    createdDateRobot: parseDate(article.createdDate, DATE_PATTERN.robotReadable),
    comments: article.comments.map(commentConverter)
  }, article));

module.exports.convertViewArticles = (articles) => articles.map(articleConverter);
