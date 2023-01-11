'use strict';

const {Router} = require(`express`);
const privateRouter = new Router();
const api = require(`../api`).getAPI();
const {convertViewArticles} = require(`../adapters/view-model`);

privateRouter.get(`/`, async (_req, res) => {
  const articles = await api.getArticles();
  res.render(`my-posts`, {
    articles: convertViewArticles(articles)
  });
});

privateRouter.get(`/categories`, async (_req, res) => {
  const categories = await api.getCategories(true);
  res.render(`all-categories`, {categories});
});

privateRouter.get(`/comments`, async (_req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render(`comments`, {
    articles: convertViewArticles(articles)
  });
});

module.exports = privateRouter;
