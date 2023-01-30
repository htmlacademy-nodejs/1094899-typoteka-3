'use strict';

const {DatePattern} = require(`../../constants`);
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

const commentConverter = (comment) => {
  const viewComment = Object.assign(comment, {
    createdDateHuman: parseDate(comment.createdAt, DatePattern.HUMAN_READABLE),
    createdDateRobot: parseDate(comment.createdAt, DatePattern.ROBOT_READABLE),
  });

  if (comment.users) {
    viewComment.name = comment.users.name;
    viewComment.avatar = comment.users.avatar;
  }

  return viewComment;
};

const convertViewArticle = (article, totalCategories) => {
  const viewArticle = Object.assign(article, {
    createdDateHuman: parseDate(article.createdAt, DatePattern.HUMAN_READABLE),
    createdDateRobot: parseDate(article.createdAt, DatePattern.ROBOT_READABLE),
    createdDateReverse: parseDate(article.createdAt, DatePattern.DATE_REVERSE),
    comments: article.comments ? article.comments.map(commentConverter) : []
  });

  if (article.image) {
    viewArticle.image = `/img/${article.image}`;
  }

  if (totalCategories) {
    viewArticle.categories = enrichCategoryCount(viewArticle.categories, totalCategories);
  }

  return viewArticle;
};

const convertViewArticles = (articles) => articles.map((singleArticle) => convertViewArticle(singleArticle));

const convertViewTopText = (textWrappers, limitText) => textWrappers.map((textWrapper) => {
  if (textWrapper.text.length > limitText) {
    return {
      ...textWrapper,
      text: `${textWrapper.text.substring(0, limitText)}...`
    };
  }

  return textWrapper;
});

const parseViewArticle = (body, file, user) => {
  const articleData = {
    image: file ? file.filename : undefined,
    updatedAt: parseDate(body.date, DatePattern.DEFAULT, DatePattern.DATE_REVERSE),
    announce: body.announcement,
    text: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.category),
    userId: user.id,
  };

  return articleData;
};

module.exports = {
  convertViewArticle,
  convertViewArticles,
  parseViewArticle,
  enrichCategoryCount,
  convertViewTopText,
};
