'use strict';

const {DATE_PATTERN} = require(`../../constants`);
const {parseDate} = require(`../../utils/date`);

const articleConverter = (article) =>
  (Object.assign({
    createdDateHuman: parseDate(article.createdDate, DATE_PATTERN.humanReadable),
    createdDateRobot: parseDate(article.createdDate, DATE_PATTERN.robotReadable)
  }, article));

module.exports.convertViewArticles = (articles) => articles.map(articleConverter);
