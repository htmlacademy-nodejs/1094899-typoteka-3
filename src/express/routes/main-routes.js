'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const {convertViewArticles} = require(`../adapters/view-model`);

mainRouter.get(`/`, async (_req, res) => {
  const articles = await api.getArticles();
  const template = articles.length === 0 ? `main-empty` : `main`;
  res.render(template, {
    articles: convertViewArticles(articles)
  });
});

mainRouter.get(`/register`, (_req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (_req, res) => res.render(`login`));
mainRouter.get(`/search`, (_req, res) => res.render(`search`));

module.exports = mainRouter;
