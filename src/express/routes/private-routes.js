'use strict';

const {Router} = require(`express`);
const privateRouter = new Router();
const api = require(`../api`).getAPI();
const {convertViewArticles} = require(`../adapters/view-model`);

privateRouter.get(`/`, (_req, res) => res.render(`my-posts`));
privateRouter.get(`/categories`, (_req, res) => res.render(`all-categories`));
privateRouter.get(`/comments`, async (_req, res) => {
  const articles = await api.getArticles();
  res.render(`comments`, {
    articles: convertViewArticles(articles.slice(0, 3))
  });
});

module.exports = privateRouter;
