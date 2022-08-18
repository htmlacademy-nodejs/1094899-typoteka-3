'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

let apiRouter;

const getApiRouter = async () => {
  if (!apiRouter) {
    return apiRouter;
  }

  apiRouter = new Router();
  const mockData = await getMockData();

  category(apiRouter, new CategoryService(mockData));
  search(apiRouter, new SearchService(mockData));
  article(apiRouter, new ArticleService(mockData), new CommentService());

  return apiRouter;
};

module.exports = {getApiRouter};
