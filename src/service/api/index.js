'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

let apiRouter;

const getApiRouter = async () => {
  if (apiRouter) {
    return apiRouter;
  }

  apiRouter = new Router();

  defineModels(sequelize);

  category(apiRouter, new CategoryService(sequelize));
  search(apiRouter, new SearchService(sequelize));
  article(apiRouter, new ArticleService(sequelize), new CommentService(sequelize));

  return apiRouter;
};

module.exports = {getApiRouter};
