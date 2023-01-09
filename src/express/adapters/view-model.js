'use strict';

const {DATE_PATTERN} = require(`../../constants`);
const {parseDate} = require(`../../utils/date`);
const {ensureArray} = require(`../../utils/common`);

/* Добавляет количество статей в категории */
const enrichCategoryCount = (partialCategories, totalCategories) => {
  const categories = partialCategories.slice();
  categories.forEach((partialCat) => {
    const index = totalCategories.findIndex((richCat) => richCat.id === partialCat.id);
    partialCat.count = index === -1 ? 0 : totalCategories[index].count;
  });
  return categories;
};

const commentConverter = (comment) =>
  (Object.assign(comment, {
    createdDateHuman: parseDate(comment.createdAt, DATE_PATTERN.humanReadable),
    createdDateRobot: parseDate(comment.createdAt, DATE_PATTERN.robotReadable)
  }));

const convertViewArticle = (article, totalCategories) => {
  const viewArticle = Object.assign(article, {
    createdDateHuman: parseDate(article.createdAt, DATE_PATTERN.humanReadable),
    createdDateRobot: parseDate(article.createdAt, DATE_PATTERN.robotReadable),
    createdDateReverse: parseDate(article.createdAt, DATE_PATTERN.dateReverse),
    comments: article.comments.map(commentConverter)
  });

  if (article.image) {
    viewArticle.image = `img/${article.image}`;
  }

  if (totalCategories) {
    viewArticle.categories = enrichCategoryCount(viewArticle.categories, totalCategories);
  }

  return viewArticle;
};

const convertViewArticles = (articles) => articles.map((singleArticle) => convertViewArticle(singleArticle));

const parseViewArticle = (body, file) => {
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

module.exports = {
  convertViewArticle,
  convertViewArticles,
  parseViewArticle,
  enrichCategoryCount
};
