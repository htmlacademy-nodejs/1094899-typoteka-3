'use strict';

const {Router} = require(`express`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const user = require(`./user`);
const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService,
} = require(`../data-service`);

let apiRouter;

const buildRouter = () => {
  if (apiRouter) {
    return apiRouter;
  }

  apiRouter = new Router();
  const sequelize = getSequelize();
  defineModels(sequelize);

  category(apiRouter, new CategoryService(sequelize));
  search(apiRouter, new SearchService(sequelize));
  article(apiRouter, new ArticleService(sequelize), new CommentService(sequelize));
  user(apiRouter, new UserService(sequelize));

  return apiRouter;
};

module.exports = {buildRouter};
